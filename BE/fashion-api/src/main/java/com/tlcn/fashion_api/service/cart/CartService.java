package com.tlcn.fashion_api.service.cart;

import com.tlcn.fashion_api.dto.request.cart.AddCartItemRequest;
import com.tlcn.fashion_api.dto.request.cart.UpdateCartItemRequest;
import com.tlcn.fashion_api.dto.response.cart.CartItemResponse;
import com.tlcn.fashion_api.dto.response.cart.CartResponse;
import com.tlcn.fashion_api.dto.response.cart.VariantOptionResponse;
import com.tlcn.fashion_api.entity.cart.Cart;
import com.tlcn.fashion_api.entity.cart.CartItem;
import com.tlcn.fashion_api.entity.product.*;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.cart.CartItemRepository;
import com.tlcn.fashion_api.repository.cart.CartRepository;
import com.tlcn.fashion_api.repository.product.ProductImageRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.ProductVariantRepository;
import com.tlcn.fashion_api.repository.stock.StockRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tlcn.fashion_api.security.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StockRepository stockRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;   // <-- THÊM


    @Transactional
    public CartResponse getMyCart() {
        Long userId = SecurityUtils.getCurrentUserId();

        Cart cart = cartRepository
                .findFirstByUserIdAndStatusOrderByIdDesc(userId, "active")
                .orElseGet(() -> createNewCartForUser(userId));



        List<CartItem> items = cart.getItems() != null ? cart.getItems() : List.of();

        // ⭐ NEW: normalize lại giỏ (clamp số lượng theo stock hiện tại)
        Map<Long, String> adjustmentMessages = normalizeCartItems(cart);

        // Sau normalize, lấy lại list items (vì có thể có item bị xóa)
        items = cart.getItems() != null ? cart.getItems() : List.of();

        List<CartItemResponse> itemResponses = items.stream()
                .map(item -> mapCartItemToResponse(item, adjustmentMessages)) // 👈 truyền messages
                .toList();

        BigDecimal total = itemResponses.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .totalPrice(total)
                .items(itemResponses)
                .build();
    }



    /** Tạo cart mới cho user (KHÔNG dùng builder, KHÔNG dùng setUserId) */
    private Cart createNewCartForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);          // 👈 đúng với entity Cart của bạn
        cart.setStatus("active");
        return cartRepository.save(cart);
    }


    /** Thêm item vào giỏ */
    @Transactional
    public CartResponse addItem(AddCartItemRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();

        Cart cart = cartRepository
                .findFirstByUserIdAndStatusOrderByIdDesc(userId, "active")
                .orElseGet(() -> createNewCartForUser(userId));



        if (req.getProductId() == null) {
            throw new RuntimeException("productId is required");
        }

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ❗ CHỈ CHECK: nếu KHÔNG có variantId VÀ KHÔNG có color -> không biết chọn gì
        if (req.getVariantId() == null &&
                (req.getColor() == null || req.getColor().isBlank())) {
            throw new RuntimeException("Cần gửi variantId hoặc ít nhất màu (color) để chọn biến thể.");
        }

        // ⭐ Từ đây: luôn có 1 variant thật (FE gửi hoặc BE tự chọn)
        ProductVariant variant = resolveVariantForAdd(product, req);

        int qty = req.getQuantity() != null ? req.getQuantity() : 1;

        int maxStock = stockRepository.findByVariantId(variant.getId())
                .map(Stock::getQuantity)
                .orElse(0);

        if (maxStock <= 0) throw new RuntimeException("Hết hàng");
        if (qty > maxStock) qty = maxStock;

        Optional<CartItem> existingOpt = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId())
                        && i.getVariant() != null
                        && i.getVariant().getId().equals(variant.getId()))
                .findFirst();

        if (existingOpt.isPresent()) {
            CartItem item = existingOpt.get();
            int newQty = Math.min(item.getQty() + qty, maxStock);
            item.setQty(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setVariant(variant);
            item.setQty(qty);
            item.setPriceSnapshot(variant.getPrice());
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }

        return getMyCart();
    }




    @Transactional
    public CartResponse updateItem(Long cartItemId, UpdateCartItemRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();

        CartItem item = cartItemRepository.findByIdAndCartUserId(cartItemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // đổi variant (giữ y như bạn đang có)
        if (req.getVariantId() != null &&
                (item.getVariant() == null ||
                        !req.getVariantId().equals(item.getVariant().getId()))) {

            ProductVariant newVariant = productVariantRepository.findById(req.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            if (!newVariant.getProduct().getId().equals(item.getProduct().getId())) {
                throw new RuntimeException("Variant không thuộc product này");
            }

            item.setVariant(newVariant);
            item.setPriceSnapshot(newVariant.getPrice());
        }

        // ⭐ ĐỔI QTY
        if (req.getQuantity() != null) {
            int requested = req.getQuantity();
            log.info("Update qty for cartItemId={} userId={} requestedQty={}",
                    cartItemId, userId, requested);

            if (requested <= 0) {
                log.info("Qty <= 0 -> delete cartItemId={} userId={}", cartItemId, userId);
                int deleted = cartItemRepository.deleteByIdAndCartUserId(cartItemId, userId);
                log.info("Deleted rows = {}", deleted);
                return getMyCart();
            }

            Long variantId = item.getVariant() != null ? item.getVariant().getId() : null;
            int maxStock = (variantId == null)
                    ? Integer.MAX_VALUE
                    : stockRepository.findByVariantId(variantId)
                    .map(Stock::getQuantity)
                    .orElse(0);

            if (maxStock <= 0) {
                log.info("maxStock <= 0 -> delete cartItemId={} userId={}", cartItemId, userId);
                int deleted = cartItemRepository.deleteByIdAndCartUserId(cartItemId, userId);
                log.info("Deleted rows = {}", deleted);
                return getMyCart();
            }

            int finalQty = Math.min(requested, maxStock);
            item.setQty(finalQty);
        }

        cartItemRepository.save(item);
        return getMyCart();
    }



    /** Xóa item */
    @Transactional
    public CartResponse removeItem(Long cartItemId) {
        Long userId = SecurityUtils.getCurrentUserId();

        // để chắc chắn item tồn tại và thuộc user
        CartItem item = cartItemRepository.findByIdAndCartUserId(cartItemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // XÓA BẰNG JPQL DELETE
        cartItemRepository.deleteByIdAndCartUserId(cartItemId, userId);

        // Sau khi delete & clear context, gọi lại getMyCart()
        return getMyCart();
    }




    // map CartItem -> CartItemResponse
    private CartItemResponse mapCartItemToResponse(CartItem item,Map<Long, String> adjustmentMessages) {
        Product product = item.getProduct();
        ProductVariant variant = item.getVariant();

        String color = null;
        String size = null;

        // Lấy COLOR & SIZE từ attributeValues của variant
        // Lấy COLOR & SIZE từ attributeValues của variant
        if (variant != null && variant.getAttributeValues() != null) {
            for (VariantAttributeValue vav : variant.getAttributeValues()) {
                AttributeValue av = vav.getAttributeValue();
                if (av == null) continue;

                Attribute attr = av.getAttribute();
                if (attr == null || attr.getName() == null) continue;

                String attrName = attr.getName().trim().toLowerCase();

                // hỗ trợ cả tiếng Việt + tiếng Anh
                if (attrName.contains("color") || attrName.contains("màu")) {
                    color = av.getValue();
                } else if (attrName.contains("size") || attrName.contains("kích cỡ") || attrName.contains("kích thước")) {
                    size = av.getValue();
                }
            }
        }


        // ⭐ ẢNH: ưu tiên ảnh của VARIANT, nếu không có thì lấy ảnh sản phẩm
        String imageUrl = null;

        if (variant != null && variant.getImages() != null && !variant.getImages().isEmpty()) {
            imageUrl = variant.getImages().stream()
                    .sorted((a, b) -> {
                        // ưu tiên isPrimary = true, rồi sortOrder, rồi id
                        int primaryCompare = Boolean.compare(
                                Boolean.FALSE.equals(a.getIsPrimary()),
                                Boolean.FALSE.equals(b.getIsPrimary())
                        );
                        if (primaryCompare != 0) return primaryCompare;

                        Integer sa = a.getSortOrder() != null ? a.getSortOrder() : 0;
                        Integer sb = b.getSortOrder() != null ? b.getSortOrder() : 0;
                        int sortCompare = sa.compareTo(sb);
                        if (sortCompare != 0) return sortCompare;

                        return a.getId().compareTo(b.getId());
                    })
                    .map(VariantImage::getImageUrl)
                    .findFirst()
                    .orElse(null);
        }

        // fallback ảnh product nếu variant không có ảnh
        if (imageUrl == null) {
            imageUrl = productImageRepository
                    .findByProductIdOrderBySortOrderAsc(product.getId())
                    .stream()
                    .findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse(null);
        }

        // tồn kho tối đa cho variant hiện tại
        int maxQty = 0;
        if (variant != null) {
            maxQty = stockRepository.findByVariantId(variant.getId())
                    .map(Stock::getQuantity)
                    .orElse(0);
        }

        // options biến thể cho dropdown
        List<VariantOptionResponse> options = buildVariantOptions(product);

        // ⭐ NEW: xem item này có bị chỉnh không
        boolean adjusted = adjustmentMessages != null
                && adjustmentMessages.containsKey(item.getId());
        String message = adjusted ? adjustmentMessages.get(item.getId()) : null;

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .variantId(variant != null ? variant.getId() : null)
                .color(color)
                .size(size)
                .price(item.getPriceSnapshot())
                .quantity(item.getQty())  // qty đã được normalize trong normalizeCartItems()
                .maxQuantity(maxQty)
                .imgSrc(imageUrl)
                .variantOptions(options)
                .adjusted(adjusted)       // ⭐ NEW
                .message(message)         // ⭐ NEW
                .build();
    }


    // build list variant cho 1 sản phẩm (dùng ở dropdown trong cart)
    private List<VariantOptionResponse> buildVariantOptions(Product product) {
        // lấy tất cả variant "active" của product
        List<ProductVariant> variants =
                productVariantRepository.findByProductIdAndStatus(product.getId(), "active");

        // ảnh default của product (fallback khi variant không có ảnh riêng)
        List<ProductImage> images =
                productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId());
        String defaultImg = images.stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);

        return variants.stream().map(v -> {

            String color = null;
            String size = null;

            if (v.getAttributeValues() != null) {
                for (VariantAttributeValue vav : v.getAttributeValues()) {
                    AttributeValue av = vav.getAttributeValue();
                    if (av == null) continue;

                    Attribute attr = av.getAttribute();
                    if (attr == null || attr.getName() == null) continue;

                    String attrName = attr.getName().trim().toLowerCase();

                    if (attrName.contains("color") || attrName.contains("màu")) {
                        color = av.getValue();
                    } else if (attrName.contains("size") || attrName.contains("kích cỡ") || attrName.contains("kích thước")) {
                        size = av.getValue();
                    }
                }
            }


            // tồn kho từng variant
            int maxQty = stockRepository.findByVariantId(v.getId())
                    .map(Stock::getQuantity)
                    .orElse(0);

            // ⭐ ảnh: ưu tiên ảnh variant
            String imgUrl = null;
            if (v.getImages() != null && !v.getImages().isEmpty()) {
                imgUrl = v.getImages().stream()
                        .sorted((a, b) -> {
                            int primaryCompare = Boolean.compare(
                                    Boolean.FALSE.equals(a.getIsPrimary()),
                                    Boolean.FALSE.equals(b.getIsPrimary())
                            );
                            if (primaryCompare != 0) return primaryCompare;

                            Integer sa = a.getSortOrder() != null ? a.getSortOrder() : 0;
                            Integer sb = b.getSortOrder() != null ? b.getSortOrder() : 0;
                            int sortCompare = sa.compareTo(sb);
                            if (sortCompare != 0) return sortCompare;

                            return a.getId().compareTo(b.getId());
                        })
                        .map(VariantImage::getImageUrl)
                        .findFirst()
                        .orElse(null);
            }

            if (imgUrl == null) {
                imgUrl = defaultImg;
            }

            return VariantOptionResponse.builder()
                    .variantId(v.getId())
                    .color(color)
                    .size(size)
                    .price(v.getPrice())
                    .maxQuantity(maxQty)
                    .imageUrl(imgUrl)
                    .build();
        }).collect(Collectors.toList());
    }
    private ProductVariant resolveVariantForAdd(Product product, AddCartItemRequest req) {
        // ✅ Nếu FE đã gửi variantId → dùng luôn, không quan tâm color
        if (req.getVariantId() != null) {
            ProductVariant variant = productVariantRepository.findById(req.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));
            if (!variant.getProduct().getId().equals(product.getId())) {
                throw new RuntimeException("Variant không thuộc product này");
            }
            return variant;
        }

        // ✅ FE chỉ gửi color
        String reqColor = Optional.ofNullable(req.getColor()).orElse("").trim();
        List<ProductVariant> variants =
                productVariantRepository.findByProductIdAndStatus(product.getId(), "active");

        if (variants.isEmpty()) {
            throw new RuntimeException("Sản phẩm chưa có biến thể nào.");
        }

        // ❗ Nếu FE không gửi màu luôn → chọn default (hoặc id nhỏ nhất)
        if (reqColor.isEmpty()) {
            return variants.stream()
                    .filter(v -> Boolean.TRUE.equals(v.getIsDefault()))
                    .findFirst()
                    .orElse(
                            variants.stream()
                                    .min(Comparator.comparingLong(ProductVariant::getId))
                                    .orElseThrow(() -> new RuntimeException("Không tìm được biến thể phù hợp"))
                    );
        }

        // ✅ Lọc theo COLOR (attribute name có thể là "Color", "Màu", "Màu sắc"...)
        List<ProductVariant> filtered = variants.stream()
                .filter(v -> {
                    if (v.getAttributeValues() == null) return false;
                    for (VariantAttributeValue vav : v.getAttributeValues()) {
                        AttributeValue av = vav.getAttributeValue();
                        if (av == null) continue;

                        Attribute attr = av.getAttribute();
                        if (attr == null || attr.getName() == null) continue;

                        String attrName = attr.getName().trim().toLowerCase();
                        // name chứa "color" hoặc "màu"
                        if (attrName.contains("color") || attrName.contains("màu")) {
                            String dbColor = Optional.ofNullable(av.getValue()).orElse("").trim();
                            if (dbColor.equalsIgnoreCase(reqColor)) {
                                return true;
                            }
                        }
                    }
                    return false;
                })
                .toList();

        if (filtered.isEmpty()) {
            // ❗ Nếu không match được màu → fallback: lấy default / id nhỏ nhất
            return variants.stream()
                    .filter(v -> Boolean.TRUE.equals(v.getIsDefault()))
                    .findFirst()
                    .orElse(
                            variants.stream()
                                    .min(Comparator.comparingLong(ProductVariant::getId))
                                    .orElseThrow(() ->
                                            new RuntimeException("Không tìm được biến thể phù hợp (fallback cũng fail)"))
                    );
        }

        // ✅ Có nhiều variant cùng màu → pick cái "đầu tiên" (id nhỏ nhất)
        return filtered.stream()
                .min(Comparator.comparingLong(ProductVariant::getId))
                .orElseThrow(() -> new RuntimeException("Không tìm được biến thể phù hợp"));
    }

    /**
     * Chuẩn hóa lại giỏ:
     * - Nếu stock <= 0  -> xóa item khỏi giỏ
     * - Nếu qty > stock -> giảm qty về = stock
     * Trả về map<cartItemId, message> để FE biết item nào bị chỉnh.
     */
    private Map<Long, String> normalizeCartItems(Cart cart) {
        Map<Long, String> messages = new HashMap<>();

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            return messages;
        }

        // Dùng iterator để vừa duyệt vừa remove
        Iterator<CartItem> it = cart.getItems().iterator();
        while (it.hasNext()) {
            CartItem item = it.next();
            ProductVariant variant = item.getVariant();

            if (variant == null) continue; // sản phẩm không có variant, bạn có thể custom thêm

            int stockQty = stockRepository.findByVariantId(variant.getId())
                    .map(Stock::getQuantity)
                    .orElse(0);

            int currentQty = item.getQty();

            // Hết hàng -> xóa item
            if (stockQty <= 0) {
                String msg = "Sản phẩm '" + item.getProduct().getName() +
                        "' đã hết hàng và được xóa khỏi giỏ.";
                log.info("[Cart] Remove item {} vì hết hàng. userId={}", item.getId(), cart.getUser().getId());
                messages.put(item.getId(), msg);

                // xóa khỏi DB + list trong cart
                cartItemRepository.delete(item);
                it.remove();
                continue;
            }

            // Nếu qty > stock -> giảm về stock
            if (currentQty > stockQty) {
                String msg = "Số lượng sản phẩm '" + item.getProduct().getName() +
                        "' đã được giảm từ " + currentQty + " xuống " + stockQty +
                        " vì kho chỉ còn " + stockQty + ".";
                log.info("[Cart] Adjust qty item {}: {} -> {}. userId={}",
                        item.getId(), currentQty, stockQty, cart.getUser().getId());

                item.setQty(stockQty);
                messages.put(item.getId(), msg);
                // Không cần save explicit, @Transactional sẽ flush
            }
        }

        return messages;
    }

}
