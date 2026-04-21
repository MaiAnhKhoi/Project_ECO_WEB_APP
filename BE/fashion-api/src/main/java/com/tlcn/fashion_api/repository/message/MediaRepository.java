package com.tlcn.fashion_api.repository.message;

import com.tlcn.fashion_api.entity.media.Media;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {
}