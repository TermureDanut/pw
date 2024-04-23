package pw.project.pwProject.services;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFFieldRun;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pw.project.pwProject.entities.Request;
import pw.project.pwProject.entities.Student;
import pw.project.pwProject.entities.Template;
import pw.project.pwProject.entities.TemplateKey;
import pw.project.pwProject.repositories.RequestRepository;
import pw.project.pwProject.repositories.TemplateKeyRepository;

import java.io.*;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class GenerationService {
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private TemplateKeyRepository templateKeyRepository;

    public ResponseEntity<?> generate(Long id) {
        Request request = requestRepository.findById(id).orElse(null);
        if (request == null) {
            return new ResponseEntity<>("Failed: request not found", HttpStatus.BAD_REQUEST);
        }
        Template template = request.getTemplate();
        Student student = request.getStudent();
        List<TemplateKey> templateKeys = templateKeyRepository.findAllByTemplateId(template.getId());
        if (templateKeys.isEmpty()) {
            return new ResponseEntity<>("Failed: template has no associated template keys", HttpStatus.BAD_REQUEST);
        }

        try {
            XWPFDocument completed = new XWPFDocument(new ByteArrayInputStream(template.getContent()));

            for (XWPFParagraph paragraph : completed.getParagraphs()) {
                for (XWPFRun run : paragraph.getRuns()) {
                    String text = run.getText(0);
                    if (text != null) {
                        for (TemplateKey templateKey : templateKeys) {
                            String placeholder = "${" + templateKey.getKey() + "}";
                            if (text.contains(placeholder)) {
                                text = text.replace(placeholder, getStudentPropertyValue(student, templateKey.getKey()));
                                run.setText(text, 0);
                            }
                        }
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            completed.write(outputStream);
            byte[] modifiedContent = outputStream.toByteArray();

            String filename = String.format("%s_%s_%s", student.getFirstName(), student.getLastName(), template.getName());

            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"").body(modifiedContent);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed: Error occurred during document generation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getStudentPropertyValue(Student student, String key) {
        return switch (key) {
            case "firstName" -> student.getFirstName();
            case "lastName" -> student.getLastName();
            case "email" -> student.getEmail();
            case "faculty" -> student.getFaculty();
            case "studiesProgram" -> student.getStudiesProgram();
            case "studiesType" -> student.getStudiesType();
            case "specialization" -> student.getSpecialization();
            default -> "________________________________";
        };
    }
}
