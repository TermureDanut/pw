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
import pw.project.pwProject.entities.Student;
import pw.project.pwProject.entities.Template;
import pw.project.pwProject.entities.dtos.RequestDto;
import pw.project.pwProject.entities.dtos.StudentDto;
import pw.project.pwProject.repositories.RequestRepository;
import pw.project.pwProject.repositories.StudentRepository;
import pw.project.pwProject.repositories.TemplateRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private RequestRepository requestRepository;
    private final Validator validator;

    public StudentService () {
        try (ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory()) {
            validator = validatorFactory.getValidator();
        }
    }

    public ResponseEntity<?> post(StudentDto studentDto) {
        if (studentRepository.existsByEmail(studentDto.getEmail())) {
            return new ResponseEntity<>("Failed: email already exists", HttpStatus.BAD_REQUEST);
        }

        if (studentDto.getFirstName() == null || studentDto.getLastName() == null || studentDto.getEmail() == null || studentDto.getPassword() == null
                || studentDto.getFaculty() == null || studentDto.getStudiesProgram() == null || studentDto.getStudiesType() == null || studentDto.getSpecialization() == null) {
            return new ResponseEntity<>("Failed: missing necessary fields", HttpStatus.BAD_REQUEST);
        }

        Student newStudent = new Student();
        newStudent.setFirstName(studentDto.getFirstName());
        newStudent.setLastName(studentDto.getLastName());
        newStudent.setEmail(studentDto.getEmail());
        //        newStudent.setPassword(PasswordEncryption.encrypt(secretary.getPassword()));
        newStudent.setPassword(studentDto.getPassword());
        newStudent.setFaculty(studentDto.getFaculty());
        newStudent.setStudiesProgram(studentDto.getStudiesProgram());
        newStudent.setStudiesType(studentDto.getStudiesType());
        newStudent.setSpecialization(studentDto.getSpecialization());
        newStudent.setDeleted(false);
        newStudent.setEstimatedHardDelete(LocalDateTime.now());

        Set<ConstraintViolation<Student>> violations = validator.validate(newStudent);

        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Failed: ");
            for (ConstraintViolation<Student> violation : violations) {
                errorMessage.append(" ").append(violation.getMessage()).append(",");
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        studentRepository.save(newStudent);

        return new ResponseEntity<>(newStudent, HttpStatus.CREATED);
    }

    public ResponseEntity<?> getAll () {
        List<Student> students = studentRepository.findAll();
        return students.isEmpty() ? new ResponseEntity<>("No students found", HttpStatus.NO_CONTENT) : new ResponseEntity<>(students, HttpStatus.OK);
    }

    public ResponseEntity<?> patch (Long id, StudentDto studentDto) {
        if (studentRepository.existsByEmail(studentDto.getEmail())) {
            return new ResponseEntity<>("Failed: email already exists", HttpStatus.BAD_REQUEST);
        }

        Student foundStudent = studentRepository.findById(id).orElse(null);
        if (foundStudent == null) {
            return new ResponseEntity<>("Failed: student not found", HttpStatus.BAD_REQUEST);
        }

        if (studentDto.getFirstName() != null) {
            foundStudent.setFirstName(studentDto.getFirstName());
        }

        if (studentDto.getLastName() != null) {
            foundStudent.setLastName(studentDto.getLastName());
        }

        if (studentDto.getEmail() != null) {
            foundStudent.setEmail(studentDto.getEmail());
        }

        if (studentDto.getEmail() != null) {
            foundStudent.setEmail(studentDto.getEmail());
        }

        if (studentDto.getFaculty() != null) {
            foundStudent.setFaculty(studentDto.getFaculty());
        }

        if (studentDto.getStudiesProgram() != null) {
            foundStudent.setStudiesProgram(studentDto.getStudiesProgram());
        }

        if (studentDto.getStudiesType() != null) {
            foundStudent.setStudiesType(studentDto.getStudiesType());
        }

        if (studentDto.getSpecialization() != null) {
            foundStudent.setSpecialization(studentDto.getSpecialization());
        }

        Set<ConstraintViolation<Student>> violations = validator.validate(foundStudent);

        if (!violations.isEmpty()) {
            StringBuilder errorMessage = new StringBuilder("Failed: ");
            for (ConstraintViolation<Student> violation : violations) {
                errorMessage.append(" ").append(violation.getMessage()).append(",");
            }
            return new ResponseEntity<>(errorMessage.toString(), HttpStatus.BAD_REQUEST);
        }

        studentRepository.save(foundStudent);
        return new ResponseEntity<>(foundStudent, HttpStatus.OK);
    }

    public ResponseEntity<?> getById (Long id) {
        Student foundStudent = studentRepository.findById(id).orElse(null);
        if (foundStudent == null) {
            return new ResponseEntity<>("Failed: student not found", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(foundStudent, HttpStatus.OK);
    }
    public ResponseEntity<?> delete (Long id) {
        Student foundStudent = studentRepository.findById(id).orElse(null);
        if (foundStudent == null) {
            return new ResponseEntity<>("Failed: student not found", HttpStatus.BAD_REQUEST);
        }
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime estimatedHardDelete = now.plusDays(30);
        foundStudent.setDeleted(true);
        foundStudent.setEstimatedHardDelete(estimatedHardDelete);
        studentRepository.save(foundStudent);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<?> makeRequest (RequestDto requestDto) {
        Student student = studentRepository.findById(requestDto.getStudentId()).orElse(null);
        Template template = templateRepository.findById(requestDto.getTemplateId()).orElse(null);

        if (student == null || template == null) {
            return new ResponseEntity<>("Failed: student or template not found", HttpStatus.BAD_REQUEST);
        }

        Request request = new Request();
        request.setStudent(student);
        request.setTemplate(template);
        request.setCompleted(false);

        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }
}
