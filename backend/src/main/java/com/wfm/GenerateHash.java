package com.wfm;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class GenerateHash {
    public static void main(String[] args) {
        System.out.println("HASH_IS:" + new BCryptPasswordEncoder().encode("Wfm@12345"));
    }
}
