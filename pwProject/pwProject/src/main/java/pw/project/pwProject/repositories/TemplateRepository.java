package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.Template;

import java.util.List;

public interface TemplateRepository extends JpaRepository<Template, Long> {
    boolean existsById (Long id);
    boolean existsByName (String name);
    List<Template> findAllByDeleted(boolean isDeleted);
}
