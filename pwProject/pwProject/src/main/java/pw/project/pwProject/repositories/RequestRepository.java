package pw.project.pwProject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.project.pwProject.entities.Request;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> getByCompleted (boolean completed);
    List<Request> getByStudentId (long studentId);
}
