package pw.project.pwProject.services;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pw.project.pwProject.entities.Request;
import pw.project.pwProject.entities.Secretary;
import pw.project.pwProject.entities.dtos.SecretaryDto;
import pw.project.pwProject.repositories.SecretaryRepository;
//import pw.project.pwProject.security.PasswordEncryption;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class SecretaryService {
    @Autowired
    private SecretaryRepository secretaryRepository;
    @Autowired
    private RequestService requestService;

    private final Validator validator;

    public SecretaryService () {
        try (ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory()) {
            validator = validatorFactory.getValidator();
        }
    }

    public ResponseEntity<?> post(SecretaryDto secretaryDto) {
        if (secretaryRepository.existsByEmail(secretaryDto.getEmail())) {
            return new ResponseEntity<>("Failed: email already exists", HttpStatus.BAD_REQUEST);
        }

        if (secretaryDto.getFirstName() == null || secretaryDto.getLastName() == null || secretaryDto.getEmail() == null || secretaryDto.getPassword() == null) {
            return new ResponseEntity<>("Failed: missing necessary fields", HttpStatus.BAD_REQUEST);
        }

        Secretary newSecretary = new Secretary();
        newSecretary.setFirstName(secretaryDto.getFirstName());
        newSecretary.setLastName(secretaryDto.getLastName());
        newSecretary.setEmail(secretaryDto.getEmail());
//        newSecretary.setPassword(PasswordEncryption.encrypt(secretary.getPassword()));
        newSecretary.setPassword(secretaryDto.getPassword());
        newSecretary.setDeleted(false);
        newSecretary.setEstimatedHardDelete(LocalDateTime.now());

        Set<ConstraintViolation<Secretary>> violations = validator.validate(newSecretary);

        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Failed: ");
            for (ConstraintViolation<Secretary> violation : violations) {
                errorMessage.append(" ").append(violation.getMessage()).append(",");
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        secretaryRepository.save(newSecretary);

        return new ResponseEntity<>(newSecretary, HttpStatus.CREATED);
    }

    public ResponseEntity<?> getUncompleted () {
        List<Request> requests = requestService.getUncompleted();
        return requests.isEmpty() ? new ResponseEntity<>("No uncompleted requests found", HttpStatus.NO_CONTENT) : new ResponseEntity<>(requests, HttpStatus.OK);
    }

    public ResponseEntity<?> patch (Long id, SecretaryDto secretaryDto) {
        if (secretaryRepository.existsByEmail(secretaryDto.getEmail())) {
            return new ResponseEntity<>("Failed: email already exists", HttpStatus.BAD_REQUEST);
        }

        Secretary foundSecretary = secretaryRepository.findById(id).orElse(null);
        if (foundSecretary == null) {
            return new ResponseEntity<>("Failed: secretary not found", HttpStatus.BAD_REQUEST);
        }

        if (secretaryDto.getFirstName() != null) {
            foundSecretary.setFirstName(secretaryDto.getFirstName());
        }

        if (secretaryDto.getLastName() != null) {
            foundSecretary.setLastName(secretaryDto.getLastName());
        }

        if (secretaryDto.getEmail() != null) {
            foundSecretary.setEmail(secretaryDto.getEmail());
        }

        Set<ConstraintViolation<Secretary>> violations = validator.validate(foundSecretary);

        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Failed: ");
            for (ConstraintViolation<Secretary> violation : violations) {
                errorMessage.append(" ").append(violation.getMessage()).append(",");
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        secretaryRepository.save(foundSecretary);
        return new ResponseEntity<>(foundSecretary, HttpStatus.OK);
    }

    public ResponseEntity<?> getById (Long id) {
        Secretary foundSecretary = secretaryRepository.findById(id).orElse(null);
        if (foundSecretary == null) {
            return new ResponseEntity<>("Failed: secretary not found", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(foundSecretary, HttpStatus.OK);
    }

    public ResponseEntity<?> delete (Long id) {
        Secretary foundSecretary = secretaryRepository.findById(id).orElse(null);
        if (foundSecretary == null) {
            return new ResponseEntity<>("Failed: secretary not found", HttpStatus.BAD_REQUEST);
        }
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime estimatedHardDelete = now.plusDays(30);
        foundSecretary.setDeleted(true);
        foundSecretary.setEstimatedHardDelete(estimatedHardDelete);
        secretaryRepository.save(foundSecretary);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
