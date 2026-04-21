package com.tlcn.fashion_api.service.coupon;

import com.tlcn.fashion_api.common.enums.CouponType;
import com.tlcn.fashion_api.dto.request.coupon.ApplyCouponRequest;
import com.tlcn.fashion_api.dto.request.coupon.CreateCouponRequest;
import com.tlcn.fashion_api.dto.request.coupon.UpdateCouponRequest;
import com.tlcn.fashion_api.dto.response.coupon.ApplyCouponResponse;
import com.tlcn.fashion_api.dto.response.coupon.CouponAdminDto;
import com.tlcn.fashion_api.entity.coupon.Coupon;
import com.tlcn.fashion_api.entity.coupon.CouponUsage;
import com.tlcn.fashion_api.repository.coupon.CouponRepository;
import com.tlcn.fashion_api.repository.coupon.CouponUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    // ====================== FRONT / USER ======================

    public List<Coupon> getActiveCouponsForUser(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Coupon> all = couponRepository.findAllActive(now);

        // Lọc thêm theo usage_limit & per_user_limit
        return all.stream()
                .filter(coupon -> isCouponUsableForUser(coupon, userId))
                .collect(Collectors.toList());
    }

    private boolean isCouponUsableForUser(Coupon coupon, Long userId) {
        long totalUsed = couponUsageRepository.countByCouponId(coupon.getId());
        if (coupon.getUsageLimit() != null && totalUsed >= coupon.getUsageLimit()) {
            return false;
        }
        if (coupon.getPerUserLimit() != null && userId != null) {
            long usedByUser = couponUsageRepository
                    .countByCouponIdAndUserId(coupon.getId(), userId);
            return usedByUser < coupon.getPerUserLimit();
        }
        return true;
    }

    @Transactional
    public ApplyCouponResponse applyCoupon(ApplyCouponRequest req) {
        if (req.getSubtotal() == null || req.getSubtotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền không hợp lệ");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(req.getCode())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        // 1. Trạng thái
        if (!"active".equalsIgnoreCase(coupon.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không còn hoạt động");
        }

        // 2. Thời gian hiệu lực
        if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa bắt đầu áp dụng");
        }
        if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn");
        }

        // ⭐️ FIX: Kiểm tra lại từ DB để tránh race condition
        // Reload coupon để đảm bảo dữ liệu mới nhất
        coupon = couponRepository.findById(coupon.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại"));

        // 3. Tổng số lượt dùng - check lại sau khi reload
        long totalUsed = couponUsageRepository.countByCouponId(coupon.getId());
        if (coupon.getUsageLimit() != null && totalUsed >= coupon.getUsageLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã dùng hết số lượt");
        }

        // 4. Số lượt / user
        if (coupon.getPerUserLimit() != null) {
            if (req.getUserId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần đăng nhập để dùng mã này");
            }
            long usedByUser = couponUsageRepository
                    .countByCouponIdAndUserId(coupon.getId(), req.getUserId());
            if (usedByUser >= coupon.getPerUserLimit()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã dùng hết số lượt cho mã này");
            }
        }

        // 5. Check min_order
        BigDecimal subtotal = req.getSubtotal();
        if (coupon.getMinOrder() != null &&
                subtotal.compareTo(coupon.getMinOrder()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã");
        }

        // 6. Tính số tiền giảm
        BigDecimal discount = calculateDiscount(coupon, subtotal);

        BigDecimal finalTotal = subtotal.subtract(discount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) {
            finalTotal = BigDecimal.ZERO;
        }

        // Lưu ý: KHÔNG tạo bản ghi coupon_usages ở đây,
        // mà tạo sau khi đơn hàng được tạo/thanh toán thành công trong OrderService.

        return ApplyCouponResponse.builder()
                .code(coupon.getCode())
                .valid(true)
                .message("Áp dụng mã thành công")
                .discountAmount(discount)
                .finalTotal(finalTotal)
                .build();
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;
        if (coupon.getType() == CouponType.PERCENT) {
            // value = % (ví dụ 10 -> 10%)
            discount = subtotal
                    .multiply(coupon.getValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
        } else { // FIXED
            discount = coupon.getValue();
        }

        // Giới hạn max_discount
        if (coupon.getMaxDiscount() != null &&
                discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }

        // Không được giảm quá subtotal
        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }
        return discount;
    }

    /**
     * Hàm này gọi khi đơn hàng thanh toán thành công
     * để lưu lại lịch sử sử dụng mã.
     * ⭐️ FIX: Kiểm tra lại limit trước khi save để tránh vượt quá limit
     */
    @Transactional
    public void saveCouponUsage(Long couponId, Long orderId, Long userId, BigDecimal discountAmount) {
        // Kiểm tra xem đã có usage cho order này chưa (tránh duplicate)
        Optional<CouponUsage> existing = couponUsageRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            // Đã có rồi, không tạo lại
            return;
        }

        // ⭐️ FIX: Kiểm tra lại limit trước khi save
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Coupon not found"));

        // Check usage limit
        long totalUsed = couponUsageRepository.countByCouponId(couponId);
        if (coupon.getUsageLimit() != null && totalUsed >= coupon.getUsageLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Mã giảm giá đã dùng hết số lượt");
        }

        // Check per user limit
        if (coupon.getPerUserLimit() != null && userId != null) {
            long usedByUser = couponUsageRepository
                    .countByCouponIdAndUserId(couponId, userId);
            if (usedByUser >= coupon.getPerUserLimit()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                        "Bạn đã dùng hết số lượt cho mã này");
            }
        }

        CouponUsage usage = CouponUsage.builder()
                .couponId(couponId)
                .orderId(orderId)
                .userId(userId)
                .discountAmount(discountAmount)
                .usedAt(LocalDateTime.now())
                .build();
        couponUsageRepository.save(usage);
    }

    /**
     * Xóa coupon usage khi order bị hủy
     * Để user có thể dùng lại coupon (rollback limit)
     */
    @Transactional
    public void removeCouponUsageByOrderId(Long orderId) {
        couponUsageRepository.deleteByOrderId(orderId);
    }

    // ====================== ADMIN / MARKETING ======================

    public Page<CouponAdminDto> listCoupons(String keyword, String status, int page, int size) {
        var pageable = PageRequest.of(page, size);
        Page<Coupon> couponPage = couponRepository.searchAdmin(keyword, status, pageable);
        return couponPage.map(this::toAdminDto);
    }

    public CouponAdminDto getCouponDetail(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy coupon"));
        return toAdminDto(coupon);
    }

    public CouponAdminDto createCoupon(CreateCouponRequest request) {
        // Check trùng code
        if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã tồn tại");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().trim())
                .type(request.getType())
                .value(request.getValue())
                .minOrder(request.getMinOrder())
                .maxDiscount(request.getMaxDiscount())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .usageLimit(request.getUsageLimit())
                .perUserLimit(request.getPerUserLimit())
                .usedCount(0)
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .build();

        Coupon saved = couponRepository.save(coupon);
        return toAdminDto(saved);
    }

    public CouponAdminDto updateCoupon(Long id, UpdateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy coupon"));

        // Cho phép update từng field nếu != null
        if (request.getCode() != null && !request.getCode().isBlank()) {
            // Nếu đổi code thì check trùng
            if (!request.getCode().equalsIgnoreCase(coupon.getCode())
                    && couponRepository.existsByCodeIgnoreCase(request.getCode())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã tồn tại");
            }
            coupon.setCode(request.getCode().trim());
        }
        if (request.getType() != null) {
            coupon.setType(request.getType());
        }
        if (request.getValue() != null) {
            coupon.setValue(request.getValue());
        }
        if (request.getMinOrder() != null) {
            coupon.setMinOrder(request.getMinOrder());
        }
        if (request.getMaxDiscount() != null) {
            coupon.setMaxDiscount(request.getMaxDiscount());
        }
        if (request.getStartAt() != null) {
            coupon.setStartAt(request.getStartAt());
        }
        if (request.getEndAt() != null) {
            coupon.setEndAt(request.getEndAt());
        }
        if (request.getUsageLimit() != null) {
            coupon.setUsageLimit(request.getUsageLimit());
        }
        if (request.getPerUserLimit() != null) {
            coupon.setPerUserLimit(request.getPerUserLimit());
        }
        if (request.getStatus() != null) {
            coupon.setStatus(request.getStatus());
        }

        Coupon saved = couponRepository.save(coupon);
        return toAdminDto(saved);
    }

    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy coupon"));

        // Soft delete: set status = deleted (để không áp dụng nữa nhưng vẫn giữ lịch sử)
        coupon.setStatus("deleted");
        couponRepository.save(coupon);
    }

    public CouponAdminDto updateCouponStatus(Long id, String status) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy coupon"));

        coupon.setStatus(status);
        Coupon saved = couponRepository.save(coupon);
        return toAdminDto(saved);
    }

    // ====================== Helper mapping ======================

    private CouponAdminDto toAdminDto(Coupon coupon) {
        CouponAdminDto dto = new CouponAdminDto();

        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setType(coupon.getType());
        dto.setValue(coupon.getValue());
        dto.setMinOrder(coupon.getMinOrder());
        dto.setMaxDiscount(coupon.getMaxDiscount());
        dto.setStartAt(coupon.getStartAt());
        dto.setEndAt(coupon.getEndAt());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setPerUserLimit(coupon.getPerUserLimit());

        // ⭐ SỐ LẦN SỬ DỤNG THỰC TẾ THEO DB
        long totalUsed = couponUsageRepository.countByCouponId(coupon.getId());
        dto.setUsedCount((int) totalUsed);

        dto.setStatus(coupon.getStatus());
        dto.setCreatedAt(coupon.getCreatedAt());

        return dto;
    }


    public Coupon getByCodeOrThrow(String code) {
        return couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại"));
    }

}
