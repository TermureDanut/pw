package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByEmail (String email);
}
