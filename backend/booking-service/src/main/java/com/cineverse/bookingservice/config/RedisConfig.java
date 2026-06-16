package com.cineverse.bookingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * RedisConfig sets up the RedisTemplate bean.
 * RedisTemplate is the main class used to interact with Redis in Spring Boot.
 * We use String for both key and value serializers for simplicity.
 */
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        
        // Connect the template to the Redis server
        template.setConnectionFactory(factory);
        
        // Use String serializers so keys/values are human-readable in Redis
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        
        return template;
    }
}
