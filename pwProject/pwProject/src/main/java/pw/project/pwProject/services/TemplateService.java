package pw.project.pwProject.services;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pw.project.pwProject.entities.Template;
import pw.project.pwProject.entities.TemplateKey;
import pw.project.pwProject.repositories.TemplateKeyRepository;
import pw.project.pwProject.repositories.TemplateRepository;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class TemplateService {
    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private TemplateKeyRepository templateKeyRepository;

    public ResponseEntity<?> post(MultipartFile file) {
        if (templateRepository.existsByName(file.getOriginalFilename())) {
            return new ResponseEntity<>("Failed: name already exists", HttpStatus.BAD_REQUEST);
        }
        if (file.isEmpty()) {
            return new ResponseEntity<>("Failed: empty file", HttpStatus.BAD_REQUEST);
        }
        try {
            Template template = new Template();
            template.setName(file.getOriginalFilename());
            template.setContent(file.getBytes());
            template.setDeleted(false);
            template.setEstimatedHardDelete(LocalDateTime.now());
            templateRepository.save(template);

            Set<String> extractedTexts = extractTextFromDocx(file.getInputStream());
            TemplateKey templateKey;
            for (String extractedText : extractedTexts) {
                templateKey = new TemplateKey();
                templateKey.setKey(extractedText);
                templateKey.setTemplate(template);
                templateKeyRepository.save(templateKey);
            }
            return new ResponseEntity<>(template, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed: could not upload file", HttpStatus.BAD_REQUEST);
        }
    }

    private Set<String> extractTextFromDocx(InputStream inputStream) throws IOException {
        Set<String> extractedTexts = new HashSet<>();
        XWPFDocument doc = new XWPFDocument(inputStream);
        XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
        String fileContent = extractor.getText();

        Pattern pattern = Pattern.compile("\\$\\{(.*?)}");
        Matcher matcher = pattern.matcher(fileContent);

        while (matcher.find()) {
            extractedTexts.add(matcher.group(1));
        }

        return extractedTexts;
    }

    public ResponseEntity<?> getById (Long id) {
        Template template = templateRepository.findById(id).orElse(null);
        if (template == null) {
            return new ResponseEntity<>("Failed: template not found", HttpStatus.BAD_REQUEST);
        } else {
            if (template.isDeleted()) {
                return new ResponseEntity<>("Failed: template was deleted", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(template, HttpStatus.OK);
    }

    public ResponseEntity<?> getAll () {
        List<Template> templates = templateRepository.findAllByDeleted(false);
        return templates.isEmpty() ? new ResponseEntity<>("No templates found", HttpStatus.NO_CONTENT) : new ResponseEntity<>(templates, HttpStatus.OK);
    }

    public ResponseEntity<?> patch (Long id, MultipartFile file) {
        if (templateRepository.existsByName(file.getOriginalFilename())) {
            return new ResponseEntity<>("Failed: name already exists", HttpStatus.BAD_REQUEST);
        }
        if (file.isEmpty()) {
            return new ResponseEntity<>("Failed: empty file", HttpStatus.BAD_REQUEST);
        }
        Template template = templateRepository.findById(id).orElse(null);
        if (template == null) {
            return new ResponseEntity<>("Failed: template not found", HttpStatus.BAD_REQUEST);
        } else {
            if (template.isDeleted()) {
                return new ResponseEntity<>("Failed: template was deleted", HttpStatus.BAD_REQUEST);
            }
        }

        try {
            template.setName(file.getOriginalFilename());
            template.setContent(file.getBytes());
            templateRepository.save(template);
            return new ResponseEntity<>(template, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed: could not update file", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<?> delete (Long id) {
        Template template = templateRepository.findById(id).orElse(null);
        if (template == null) {
            return new ResponseEntity<>("Failed: template not found", HttpStatus.BAD_REQUEST);
        }
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime estimatedHardDelete = now.plusDays(30);
        template.setDeleted(true);
        template.setEstimatedHardDelete(estimatedHardDelete);
        templateRepository.save(template);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
