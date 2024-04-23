package pw.project.pwProject.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/")
public class AuthController {
    @PostMapping("login")
    public ResponseEntity<?> login () {
        return null; // to do
    }

    @PostMapping("register")
    public ResponseEntity<?> register () {
        return null; // to do
    }

    @PostMapping("recover/account")
    public ResponseEntity<?> recoverAccount () {
        return null; // to do
    }

    @PostMapping("recover/password")
    public ResponseEntity<?> recoverPassword () {
        return null; // to do
    }
}
