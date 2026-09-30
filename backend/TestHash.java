import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.matches("Wfm@12345", "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy"));
    }
}
