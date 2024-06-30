package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.Student;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByEmail (String email);
    Student findByEmail (String email);
    List<Student> findAllByDeleted (boolean deleted);
}
