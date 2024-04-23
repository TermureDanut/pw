package pw.project.pwProject.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 50, nullable = false)
    @Pattern(regexp = "^[a-zA-Z]+$")
    private String firstName;

    @Column(length = 50, nullable = false)
    @Pattern(regexp = "^[a-zA-Z]+$")
    private String lastName;

    @Column(length = 50, nullable = false, unique = true)
    @Email
    private String email;

    @Column(length = 50, nullable = false)
    private String password;

    @Column(length = 50, nullable = false)
    private String faculty;

    @Column(length = 50, nullable = false)
    private String studiesProgram;

    @Column(length = 50, nullable = false)
    private String studiesType;

    @Column(length = 50, nullable = false)
    private String specialization;

    @Column
    private boolean deleted;

    @Column
    private LocalDateTime estimatedHardDelete;
}
