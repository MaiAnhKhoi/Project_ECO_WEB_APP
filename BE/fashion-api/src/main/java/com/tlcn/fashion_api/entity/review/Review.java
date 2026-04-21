package com.tlcn.fashion_api.entity.review;

import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rating", nullable = false)
    private Byte rating;

    @Column(name = "content_text")
    private String contentText;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // NEW: dùng join entity thay ManyToMany
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ReviewMedia> reviewMedias;

    // tiện cho FE / service
    @Transient
    public String getFirstMediaUrl() {
        if (reviewMedias == null || reviewMedias.isEmpty()) return null;
        if (reviewMedias.get(0).getMedia() == null) return null;
        return reviewMedias.get(0).getMedia().getUrl();
    }
}
