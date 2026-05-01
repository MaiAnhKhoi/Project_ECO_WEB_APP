package com.tlcn.fashion_api.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


/**
 * Redis cache configuration với per-cache TTL.
 *
 * Cache names and TTLs:
 *   ai:trending      — 10 min  (trending products)
 *   ai:outfit        — 1 hour  (outfit generation per prompt)
 *   ai:products      — 5 min   (product recommendations)
 *   ai:faq           — 24 hours (FAQ/static responses)
 *   products:detail  — 30 min  (product detail)
 *   products:list    — 5 min   (product listing)
 *
 * <p>Nếu {@code RedisAutoConfiguration} bị tắt (vd. dev dùng {@code spring.cache.type=simple}),
 * lớp này không tạo bean — Spring Boot dùng cache manager mặc định.</p>
 */
@Configuration
@ConditionalOnBean(RedisConnectionFactory.class)
@Slf4j
public class RedisConfig {

    // -----------------------------------------------------------------------
    // Cache name constants — referenced in @Cacheable annotations
    // -----------------------------------------------------------------------

    public static final String CACHE_AI_TRENDING  = "ai:trending";
    public static final String CACHE_AI_OUTFIT    = "ai:outfit";
    public static final String CACHE_AI_PRODUCTS  = "ai:products";
    public static final String CACHE_AI_FAQ       = "ai:faq";
    public static final String CACHE_PRODUCT_DETAIL = "products:detail";
    public static final String CACHE_PRODUCT_LIST   = "products:list";

    // -----------------------------------------------------------------------
    // Internal factory — creates ObjectMapper for Redis (NOT exposed as @Bean
    // to avoid conflict with Spring Boot's primary Jackson ObjectMapper).
    // -----------------------------------------------------------------------

    private ObjectMapper buildRedisObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // Embed type info so polymorphic types round-trip correctly through Redis
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        return mapper;
    }

    // -----------------------------------------------------------------------
    // RedisTemplate — for programmatic cache operations (non-@Cacheable usage)
    // -----------------------------------------------------------------------

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jsonSerializer =
                new GenericJackson2JsonRedisSerializer(buildRedisObjectMapper());

        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);
        template.afterPropertiesSet();

        log.info("RedisTemplate configured with JSON serialization");
        return template;
    }

    // -----------------------------------------------------------------------
    // CacheManager — Spring @Cacheable / @CacheEvict support
    // -----------------------------------------------------------------------

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        GenericJackson2JsonRedisSerializer jsonSerializer =
                new GenericJackson2JsonRedisSerializer(buildRedisObjectMapper());

        RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(jsonSerializer))
                .disableCachingNullValues()
                .entryTtl(Duration.ofMinutes(30)); // global default

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put(CACHE_AI_TRENDING,   defaults.entryTtl(Duration.ofMinutes(10)));
        cacheConfigs.put(CACHE_AI_OUTFIT,     defaults.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put(CACHE_AI_PRODUCTS,   defaults.entryTtl(Duration.ofMinutes(5)));
        cacheConfigs.put(CACHE_AI_FAQ,        defaults.entryTtl(Duration.ofHours(24)));
        cacheConfigs.put(CACHE_PRODUCT_DETAIL, defaults.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put(CACHE_PRODUCT_LIST,   defaults.entryTtl(Duration.ofMinutes(5)));

        RedisCacheManager manager = RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaults)
                .withInitialCacheConfigurations(cacheConfigs)
                .transactionAware()
                .build();

        log.info("RedisCacheManager initialized with {} cache zones", cacheConfigs.size());
        return manager;
    }
}
