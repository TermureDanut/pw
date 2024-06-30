package pw.project.pwProject.entities.payload;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pw.project.pwProject.entities.Secretary;
import pw.project.pwProject.entities.Student;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {
    private String email;
    private String password;
    @Getter
    @Setter
    private boolean isSecretary;
    @Getter
    @Setter
    private boolean isStudent;
    @Getter
    private Object user;

    public CustomUserDetails(Secretary secretary) {
        this.email = secretary.getEmail();
        this.password = secretary.getPassword();
        this.isSecretary = true;
        this.isStudent = false;
        this.user = secretary;
    }

    public CustomUserDetails(Student student) {
        this.email = student.getEmail();
        this.password = student.getPassword();
        this.isSecretary = false;
        this.isStudent = true;
        this.user = student;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

