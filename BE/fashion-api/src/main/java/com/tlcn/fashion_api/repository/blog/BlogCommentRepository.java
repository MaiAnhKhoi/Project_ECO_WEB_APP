package com.tlcn.fashion_api.repository.blog;

import com.tlcn.fashion_api.entity.blog.BlogComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {

    Page<BlogComment> findByBlogIdOrderByCreatedAtDesc(Long blogId, Pageable pageable);

    List<BlogComment> findByBlogIdOrderByCreatedAtDesc(Long blogId);

    long countByBlogId(Long blogId);
}
