package com.tlcn.fashion_api.controller;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Mono;

@RestController
public class ImageProxyController {

    // Chỉ cho phép proxy các host ngoài để tránh SSRF.
    private static final List<String> ALLOWED_HOST_SUFFIXES = List.of(
            "product.hstatic.net",
            "gstatic.com",
            "nvncdn.com"
    );

    private final WebClient webClient = WebClient.builder()
            .followRedirect(true)
            .build();

    @GetMapping("/api/image-proxy")
    public Mono<ResponseEntity<byte[]>> proxyImage(
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "u", required = false) String u
    ) {
        String finalUrl = (url != null && !url.isBlank()) ? url : decodeBase64Url(u);
        if (finalUrl == null || finalUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing url");
        }

        final URI uri;
        try {
            uri = URI.create(finalUrl.trim());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid url");
        }

        final String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
        if (!scheme.equals("https")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only https is allowed");
        }

        final String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(Locale.ROOT);
        if (host.isBlank() || ALLOWED_HOST_SUFFIXES.stream().noneMatch(host::endsWith)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Host not allowed");
        }

        return webClient.get()
                .uri(uri)
                .accept(MediaType.ALL)
                .exchangeToMono(this::toBytesResponse)
                .timeout(Duration.ofSeconds(15));
    }

    private String decodeBase64Url(String u) {
        if (u == null || u.isBlank()) return null;
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(u.trim());
            return new String(decoded, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid u");
        }
    }

    private Mono<ResponseEntity<byte[]>> toBytesResponse(ClientResponse res) {
        if (res.statusCode().isError()) {
            return res.bodyToMono(String.class)
                    .defaultIfEmpty("")
                    .flatMap(body -> Mono.error(new ResponseStatusException(res.statusCode(), body)));
        }

        MediaType contentType = res.headers().contentType().orElse(MediaType.APPLICATION_OCTET_STREAM);
        long contentLength = res.headers().contentLength().orElse(-1);

        return res.bodyToMono(byte[].class).map(bytes -> {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(contentType);
            if (contentLength >= 0) headers.setContentLength(contentLength);
            headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
        });
    }
}

