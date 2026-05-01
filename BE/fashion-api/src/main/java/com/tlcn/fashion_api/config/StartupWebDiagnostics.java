package com.tlcn.fashion_api.config;

import com.tlcn.fashion_api.controller.AiController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

/**
 * Giúp phát hiện sớm khi {@link AiController} không được đăng ký mapping — request sẽ rơi vào static resource
 * và gây {@link org.springframework.web.servlet.resource.NoResourceFoundException}.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class StartupWebDiagnostics implements ApplicationRunner {

    private final RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Value("${server.servlet.context-path:}")
    private String servletContextPath;

    @Override
    public void run(ApplicationArguments args) {
        log.info("server.servlet.context-path = '{}'", servletContextPath);

        boolean foundAi = false;
        for (var entry : requestMappingHandlerMapping.getHandlerMethods().entrySet()) {
            Class<?> beanType = entry.getValue().getBeanType();
            if (AiController.class.isAssignableFrom(beanType)) {
                foundAi = true;
                log.info("AI MVC mapping registered: {} -> {}", entry.getKey(), entry.getValue());
            }
        }
        if (!foundAi) {
            log.error(
                    "Không có mapping nào cho AiController. Gợi ý: chạy clean rebuild (mvn clean package), kiểm tra bean AI đủ dependency, "
                            + "hoặc hủy SERVER_CONTEXT_PATH=/api nếu controller vẫn dùng prefix /api trong @RequestMapping."
            );
        }
    }
}
