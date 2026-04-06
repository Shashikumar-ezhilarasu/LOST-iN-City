package com.lostcity.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

/**
 * Central Kafka configuration: topics, producer, consumer.
 * Topics are created automatically via KafkaAdmin on startup.
 */
@EnableKafka
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    // ─── Topic Definitions ────────────────────────────────────────────────────

    @Bean
    public NewTopic lostItemReportedTopic() {
        return TopicBuilder.name("lost-item-reported").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic foundItemPostedTopic() {
        return TopicBuilder.name("found-item-posted").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic claimSubmittedTopic() {
        return TopicBuilder.name("claim-submitted").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic claimApprovedTopic() {
        return TopicBuilder.name("claim-approved").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic rewardTransferredTopic() {
        return TopicBuilder.name("reward-transferred").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic xpCoinsUpdatedTopic() {
        return TopicBuilder.name("xp-coins-updated").partitions(3).replicas(1).build();
    }

    // ─── Producer ─────────────────────────────────────────────────────────────

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        // Key: plain string (topic partition key, e.g. userId)
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        // Value: JSON via Jackson — handles any domain event POJO
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        // Add type info header so the consumer knows which POJO to deserialize into
        config.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, true);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // ─── Consumer ─────────────────────────────────────────────────────────────

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "lost-city-group");
        // Start from the earliest offset if no offset is committed yet (good for dev)
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        // Trust all packages so Jackson can deserialize our event POJOs
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        // Let the deserializer use the type header set by the producer
        config.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, true);
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        // 3 concurrent threads — matches our partition count
        factory.setConcurrency(3);
        return factory;
    }
}
