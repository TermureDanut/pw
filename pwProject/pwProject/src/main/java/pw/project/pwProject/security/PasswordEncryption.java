package pw.project.pwProject.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncryption {
    public static PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}
