package pw.project.pwProject.entities.dtos;

import lombok.Data;

@Data
public class StudentDto {
    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String faculty;

    private String studiesProgram;

    private String studiesType;

    private String specialization;
}
