package pw.project.pwProject.services.auth;

import pw.project.pwProject.entities.payload.LoginDto;

public interface AuthService {
    String login(LoginDto loginDto);
}