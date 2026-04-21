package com.tlcn.fashion_api.mapper.product;

import com.tlcn.fashion_api.dto.response.product.ProductCardResponse;
import com.tlcn.fashion_api.entity.product.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductCardMapper {

    public ProductCardResponse toCard(Product product) {

        ProductCardResponse.ProductCardResponseBuilder dto =
                ProductCardResponse.builder();

        dto.id(product.getId());
        dto.title(product.getName());
        dto.width(684);
        dto.height(972);

        // ---------- Images (product level) ----------
        Set<ProductImage> imageSet = Optional.ofNullable(product.getImages())
                .orElse(Collections.emptySet());

        List<ProductImage> imgs = imageSet.stream()
                .sorted(Comparator.comparing(ProductImage::getSortOrder))
                .toList();

        String primary = imgs.isEmpty() ? null : imgs.get(0).getImageUrl();
        String hover = imgs.size() > 1 ? imgs.get(1).getImageUrl() : primary;

        dto.imgSrc(primary);
        dto.imgHover(hover);

        // ---------- Variants ----------
        Set<ProductVariant> variantSet = Optional.ofNullable(product.getVariants())
                .orElse(Collections.emptySet());

        List<ProductVariant> variants = new ArrayList<>(variantSet);

        Optional<ProductVariant> cheapest = variants.stream()
                .min(Comparator.comparing(ProductVariant::getPrice));

        BigDecimal price = cheapest.map(ProductVariant::getPrice)
                .orElse(BigDecimal.ZERO);

        BigDecimal oldPrice = cheapest.map(ProductVariant::getCompareAtPrice)
                .orElse(null);

        dto.price(price);
        dto.oldPrice(oldPrice);

        // Sale Label
        if (oldPrice != null && oldPrice.compareTo(price) > 0) {
            int percent = oldPrice.subtract(price)
                    .divide(oldPrice, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .intValue();
            dto.saleLabel(percent + "% Off");
        }

        // ---------- Sizes / Colors ----------
        Set<String> sizeSet = new LinkedHashSet<>();
        Set<String> colorSet = new LinkedHashSet<>();

        // map màu -> ảnh variant
        Map<String, String> colorImageMap = new LinkedHashMap<>();

        // map màu -> danh sách size
        Map<String, List<ProductCardResponse.SizeOption>> colorSizeMap = new LinkedHashMap<>();

        // map màu -> css class (lấy từ AttributeValue.colorCssClass)
        Map<String, String> colorCssMap = new LinkedHashMap<>();

        for (ProductVariant v : variants) {

            // Ảnh theo variant
            String variantImage = Optional.ofNullable(v.getImages())
                    .orElse(Collections.emptyList())
                    .stream()
                    .findFirst()
                    .map(VariantImage::getImageUrl)
                    .orElse(primary);

            String colorLabel = null;
            String sizeLabel = null;

            Set<VariantAttributeValue> attrs =
                    Optional.ofNullable(v.getAttributeValues())
                            .orElse(Collections.emptySet());

            for (VariantAttributeValue vav : attrs) {

                Attribute attr = vav.getAttribute();
                AttributeValue av = vav.getAttributeValue();

                if (attr == null || av == null) continue;

                String attrCode = attr.getCode() != null ? attr.getCode() : "";
                String attrName = attr.getName() != null ? attr.getName() : "";
                String val = av.getValue();
                if (val == null) continue;

                // ===== SIZE =====
                boolean isSizeAttr =
                        "SIZE".equalsIgnoreCase(attrCode) ||
                                "SIZE_TOP_BOTTOM".equalsIgnoreCase(attrCode) ||
                                "SIZE_SHOE".equalsIgnoreCase(attrCode) ||
                                attrName.equalsIgnoreCase("Size") ||
                                attrName.equalsIgnoreCase("Size áo/quần") ||
                                attrName.equalsIgnoreCase("Size giày");

                if (isSizeAttr) {
                    sizeSet.add(val);
                    sizeLabel = val;
                }

                // ===== COLOR =====
                boolean isColorAttr =
                        "COLOR".equalsIgnoreCase(attrCode) ||
                                attrName.equalsIgnoreCase("Color") ||
                                attrName.equalsIgnoreCase("Màu sắc");

                if (isColorAttr) {
                    colorSet.add(val);
                    colorLabel = val;

                    // ảnh đại diện theo màu
                    colorImageMap.putIfAbsent(val, variantImage);

                    // css class nếu có
                    if (av.getColorCssClass() != null && !av.getColorCssClass().isBlank()) {
                        colorCssMap.putIfAbsent(val, av.getColorCssClass());
                    }
                }
            }

            // nếu variant không có color + size thì bỏ qua
            if (colorLabel == null || sizeLabel == null) continue;

            // ---------- Tính tồn kho ----------
            int stockQuantity = Optional.ofNullable(v.getStocks())
                    .orElse(Collections.emptySet())
                    .stream()
                    .map(Stock::getQuantity)
                    .filter(Objects::nonNull)
                    .reduce(0, Integer::sum);

            boolean inStock = stockQuantity > 0;

            // ---------- Gắn size vào từng màu ----------
            colorSizeMap.computeIfAbsent(colorLabel, k -> new ArrayList<>())
                    .add(ProductCardResponse.SizeOption.builder()
                            .size(sizeLabel)
                            .inStock(inStock)
                            .variantId(v.getId())
                            .stockQuantity(stockQuantity)
                            .build());
        }

        // ---------- Build colorOptions ----------
        List<ProductCardResponse.ColorOption> colorOptions = colorSet.stream()
                .map(label -> ProductCardResponse.ColorOption.builder()
                        .label(label)
                        // ưu tiên dùng css class từ DB, thiếu thì dùng mapColorCss
                        .value(colorCssMap.getOrDefault(label, mapColorCss(label)))
                        .img(colorImageMap.getOrDefault(label, primary))
                        .sizes(colorSizeMap.getOrDefault(label, Collections.emptyList()))
                        .build()
                )
                .toList();

        dto.sizes(new ArrayList<>(sizeSet));
        dto.filterSizes(new ArrayList<>(sizeSet));
        dto.filterColor(new ArrayList<>(colorSet));
        dto.colors(colorOptions);

        // ---------- Brand Filter ----------
        if (product.getBrandId() != null) {
            dto.filterBrands(List.of(String.valueOf(product.getBrandId())));
        }

        // ---------- Tổng trạng thái còn hàng ----------
        boolean inStockAny = variants.stream()
                .anyMatch(v ->
                        v.getStocks() != null &&
                                v.getStocks().stream()
                                        .anyMatch(s -> s.getQuantity() != null && s.getQuantity() > 0)
                );

        dto.inStock(inStockAny);

        if (product.getProductCategories() != null && !product.getProductCategories().isEmpty()) {
            // Lấy category đầu tiên
            ProductCategory pc = product.getProductCategories().iterator().next();
            Category mainCat = pc.getCategory();

            if (mainCat != null) {
                dto.categoryId(mainCat.getId());
                dto.categoryName(mainCat.getName());
                dto.categorySlug(mainCat.getSlug());
            }
        }


        return dto.build();
    }

    // Fallback: chỉ dùng khi DB chưa cấu hình colorCssClass
    private String mapColorCss(String val) {
        String c = val.toLowerCase().trim();

        // ===== MÀU ĐẶC BIỆT TRƯỚC =====
        if (c.contains("xanh navy") || c.contains("navy")) return "bg-primary";
        if (c.contains("xanh bạc hà") || c.contains("mint")) return "bg-success";
        if (c.contains("xanh biển")) return "bg-primary";
        if (c.contains("xanh rêu")) return "bg-success";
        if (c.contains("xanh da trời") || c.contains("sky")) return "bg-primary";
        if (c.contains("xanh than")) return "bg-dark";

        // ===== ĐEN - TRẮNG - XÁM =====
        if (c.contains("đen") || c.contains("black")) return "bg-dark";
        if (c.contains("trắng") || c.contains("white") || c.contains("trong")) return "bg-white";
        if (c.contains("xám") || c.contains("ghi") || c.contains("gray")) return "bg-secondary";
        if (c.contains("bạc") || c.contains("silver")) return "bg-secondary";

        // ===== ĐỎ =====
        if (c.contains("đỏ đô") || c.contains("đỏ rượu")) return "bg-danger";
        if (c.contains("đỏ cam")) return "bg-warning";
        if (c.contains("đỏ") || c.contains("red") || c.contains("wine")) return "bg-danger";

        // ===== HỒNG =====
        if (c.contains("hồng pastel")) return "bg-warning";
        if (c.contains("hồng")) return "bg-danger";

        // ===== CAM / VÀNG =====
        if (c.contains("cam đất")) return "bg-warning";
        if (c.contains("cam") || c.contains("orange") || c.contains("vàng chanh") || c.contains("vàng"))
            return "bg-warning";

        // ===== XANH LÁ =====
        if (c.contains("xanh lá") || c.contains("xanh lục") || c.contains("green")) return "bg-success";
        if (c.contains("xanh bộ đội") || c.contains("olive") || c.contains("oliu")) return "bg-secondary";

        // ===== TÍM =====
        if (c.contains("tím pastel")) return "bg-secondary";
        if (c.contains("tím") || c.contains("purple")) return "bg-secondary";

        // ===== NÂU / BE / KEM / DA =====
        if (c.contains("nâu đất")) return "bg-secondary";
        if (c.contains("nâu nhạt")) return "bg-secondary";
        if (c.contains("nâu")) return "bg-secondary";
        if (c.contains("be") || c.contains("kem") || c.contains("cream") || c.contains("da") || c.contains("skin"))
            return "bg-secondary";

        // ===== KHÁC =====
        if (c.contains("vintage")) return "bg-secondary";
        if (c.contains("than")) return "bg-dark";

        // fallback
        return "bg-light";
    }

    public List<ProductCardResponse> toList(List<Product> products) {
        return products.stream()
                .map(this::toCard)
                .collect(Collectors.toList());
    }

}
