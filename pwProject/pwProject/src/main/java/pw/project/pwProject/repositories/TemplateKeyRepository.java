package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.TemplateKey;

import java.util.List;

public interface TemplateKeyRepository extends JpaRepository<TemplateKey, Long> {
    List<TemplateKey> findAllByTemplateId (Long templateId);
}
