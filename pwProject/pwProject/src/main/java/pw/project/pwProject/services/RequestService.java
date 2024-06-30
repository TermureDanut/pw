package pw.project.pwProject.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pw.project.pwProject.entities.Request;
import pw.project.pwProject.repositories.RequestRepository;

import java.util.List;

@Transactional
@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public List<Request> getUncompleted () {
        return requestRepository.getByCompleted(false);
    }
}
