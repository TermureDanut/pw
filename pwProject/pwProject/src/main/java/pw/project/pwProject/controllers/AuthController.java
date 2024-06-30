package pw.project.pwProject.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pw.project.pwProject.entities.dtos.RegisterDto;
import pw.project.pwProject.entities.dtos.SecretaryDto;
import pw.project.pwProject.entities.dtos.StudentDto;
import pw.project.pwProject.entities.payload.CustomUserDetails;
import pw.project.pwProject.entities.payload.JwtAuthResponse;
import pw.project.pwProject.entities.payload.LoginDto;
import pw.project.pwProject.exceptions.InvalidCredentialsException;
import pw.project.pwProject.security.CustomUserDetailsService;
import pw.project.pwProject.services.SecretaryService;
import pw.project.pwProject.services.StudentService;
import pw.project.pwProject.services.auth.AuthService;

@RestController
@RequestMapping("/auth/")
public class AuthController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private SecretaryService secretaryService;

    private final AuthService authService;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthController(AuthService authService, CustomUserDetailsService customUserDetailsService) {
        this.authService = authService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Operation(summary = "Login", description = "Login with the credentials", tags = "Authentication")
    @ApiResponse(responseCode = "200", description = "Login successful and JWT token generated")
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            String token = authService.login(loginDto);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginDto.getEmail());

            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setAccessToken(token);

            if (userDetails instanceof CustomUserDetails) {
                CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
                jwtAuthResponse.setSecretary(customUserDetails.isSecretary());
                jwtAuthResponse.setStudent(customUserDetails.isStudent());
                jwtAuthResponse.setUser(customUserDetails.getUser());
            }

            return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }
    }

    @Operation(summary = "Register a new user", description = "Register a new user", tags = "Authentication")
    @PostMapping("register")
    public ResponseEntity<?> register (@RequestBody RegisterDto registerDto) {
        if (registerDto.getUserType() == 0) {
            SecretaryDto secretaryDto = new SecretaryDto();
            secretaryDto.setFirstName(registerDto.getFirstName());
            secretaryDto.setLastName(registerDto.getLastName());
            secretaryDto.setEmail(registerDto.getEmail());
            secretaryDto.setPassword(registerDto.getPassword());
            return secretaryService.post(secretaryDto);
        } else {
            StudentDto studentDto = new StudentDto();
            studentDto.setFirstName(registerDto.getFirstName());
            studentDto.setLastName(registerDto.getLastName());
            studentDto.setFaculty(registerDto.getFaculty());
            studentDto.setStudiesProgram(registerDto.getStudiesProgram());
            studentDto.setStudiesType(registerDto.getStudiesType());
            studentDto.setSpecialization(registerDto.getSpecialization());
            studentDto.setEmail(registerDto.getEmail());
            studentDto.setPassword(registerDto.getPassword());
            return studentService.post(studentDto);
        }
    }

    @Operation(summary = "Recover a deleted account", description = "Recover a deleted account", tags = "Authentication")
    @PostMapping("recover/account/{id}")
    public ResponseEntity<?> recoverAccount (@PathVariable("id") Long id, @RequestParam("student") boolean isStudent) {
        if (isStudent) {
            return studentService.recover(id);
        }
        return secretaryService.recover(id);
    }
}
