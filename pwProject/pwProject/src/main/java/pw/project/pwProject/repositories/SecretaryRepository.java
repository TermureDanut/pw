package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.Secretary;

public interface SecretaryRepository extends JpaRepository<Secretary, Long> {
    boolean existsByEmail (String email);
}
