package com.tlcn.fashion_api.cloudinary;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${app.storage.cloudinary.upload-preset}")
    private String uploadPreset;

    @Value("${app.storage.cloudinary.folder}")
    private String defaultFolder;

    /**
     * Upload 1 file lên Cloudinary
     */
    public String uploadFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            log.warn("File is null or empty, cannot upload");
            return null;
        }

        try {
            log.info("Uploading file to Cloudinary: name={}, size={}, contentType={}, folder={}",
                    file.getOriginalFilename(), file.getSize(), file.getContentType(), folder);

            // Build upload parameters
            Map<String, Object> params = new HashMap<>();
            params.put("folder", folder != null ? folder : defaultFolder);
            params.put("resource_type", "image");

            // Only add upload_preset if it's configured (for unsigned uploads)
            // If not using preset, Cloudinary will use signed upload with API secret
            if (uploadPreset != null && !uploadPreset.isEmpty() && !uploadPreset.equals("null")) {
                params.put("upload_preset", uploadPreset);
                log.debug("Using unsigned upload with preset: {}", uploadPreset);
            } else {
                log.debug("Using signed upload (no preset)");
            }

            log.debug("Cloudinary upload params: folder={}, resource_type={}",
                    params.get("folder"), params.get("resource_type"));

            Map<String, Object> uploadResult = cloudinary.uploader()
                    .upload(file.getBytes(), params);

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            if (secureUrl == null || secureUrl.isEmpty()) {
                log.error("Upload succeeded but secure_url is null. Upload result: {}", uploadResult);
                throw new RuntimeException("Upload succeeded but no URL returned from Cloudinary");
            }

            log.info("File uploaded successfully to Cloudinary: url={}, publicId={}", secureUrl, publicId);

            return secureUrl;

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error uploading to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Upload ảnh từ một URL (Cloudinary sẽ tự fetch ảnh từ server bên thứ 3).
     * Dùng cho trường hợp output thử đồ AI trả về URL tạm thời, cần lưu bản copy lâu dài.
     */
    public String uploadFromUrl(String imageUrl, String folder) {
        if (imageUrl == null || imageUrl.isBlank()) {
            log.warn("Image URL is null or blank, cannot upload");
            return null;
        }

        try {
            log.info("Uploading image from URL to Cloudinary: url={}, folder={}", imageUrl, folder);

            Map<String, Object> params = new HashMap<>();
            params.put("folder", folder != null ? folder : defaultFolder);
            params.put("resource_type", "image");

            if (uploadPreset != null && !uploadPreset.isEmpty() && !"null".equals(uploadPreset)) {
                params.put("upload_preset", uploadPreset);
                log.debug("Using unsigned upload with preset (URL): {}", uploadPreset);
            } else {
                log.debug("Using signed upload (no preset) for URL upload");
            }

            Map<String, Object> uploadResult = cloudinary.uploader()
                    // Cloudinary SDK hỗ trợ truyền trực tiếp URL, nó sẽ tự fetch ảnh
                    .upload(imageUrl, params);

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            if (secureUrl == null || secureUrl.isEmpty()) {
                log.error("URL upload succeeded but secure_url is null. Upload result: {}", uploadResult);
                throw new RuntimeException("URL upload succeeded but no URL returned from Cloudinary");
            }

            log.info("Image uploaded from URL successfully to Cloudinary: url={}, publicId={}", secureUrl, publicId);

            return secureUrl;

        } catch (IOException e) {
            log.error("Failed to upload image from URL to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload image from URL to Cloudinary: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error uploading image from URL to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload image from URL to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Upload nhiều file
     */
    public List<String> uploadFiles(List<MultipartFile> files, String folder) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String url = uploadFile(file, folder);
            if (url != null) {
                urls.add(url);
            }
        }

        return urls;
    }
}