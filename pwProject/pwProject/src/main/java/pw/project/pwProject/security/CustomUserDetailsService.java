package pw.project.pwProject.security;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pw.project.pwProject.entities.Secretary;
import pw.project.pwProject.entities.Student;
import pw.project.pwProject.entities.payload.CustomUserDetails;
import pw.project.pwProject.repositories.SecretaryRepository;
import pw.project.pwProject.repositories.StudentRepository;

import java.util.Collections;

@AllArgsConstructor
@NoArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SecretaryRepository secretaryRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Secretary secretary = secretaryRepository.findByEmail(email);
        Student student = studentRepository.findByEmail(email);

        if (secretary == null && student == null) {
            throw new UsernameNotFoundException(email);
        }
        if (secretary != null) {
            return new CustomUserDetails(secretary);
        }
        if (student != null) {
            return new CustomUserDetails(student);
        }
        return null;
    }
}
