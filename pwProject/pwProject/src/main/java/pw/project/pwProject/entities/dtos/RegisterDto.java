package pw.project.pwProject.entities.dtos;

import lombok.Data;

@Data
public class RegisterDto {
    private int userType;           // 0 for secretary, 1 for student

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String faculty;

    private String studiesProgram;

    private String studiesType;

    private String specialization;
}
