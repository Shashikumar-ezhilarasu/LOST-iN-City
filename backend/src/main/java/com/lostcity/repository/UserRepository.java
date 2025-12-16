package com.lostcity.repository;

import com.lostcity.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = "{}", sort = "{ 'score': -1 }")
    List<User> findAllOrderByScoreDesc();
}
