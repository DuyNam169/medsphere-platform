package com.medsphere;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    @Test
    void generateHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String rawPassword = "Admin@123456"; // đổi mật khẩu admin tại đây
        String hash = encoder.encode(rawPassword);
        System.out.println("BCRYPT HASH: " + hash);
    }
}

//$2a$12$9UWm4yxXCEcCnKE8TOn8qO/axZpxJtlNmPU9cJFRP7laWydPBREa2