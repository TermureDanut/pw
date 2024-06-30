package pw.project.pwProject.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pw.project.pwProject.entities.Template;
import pw.project.pwProject.repositories.TemplateRepository;
import pw.project.pwProject.services.TemplateService;

@RestController
@RequestMapping("/templates/")
public class TemplateController {
    @Autowired
    private TemplateService templateService;

    @Autowired
    private TemplateRepository templateRepository;

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Upload a template", description = "Upload a correctly formated template.<br/>Constraints:<br/>1.Unique<br/>2.Template must be .docx<br/>3.For the documents to be filled, they need to have formated text that will be replaced (format: ${text})", tags = "Templates")
    @ApiResponse(responseCode = "201", description = "Template uploaded successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Template.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    public ResponseEntity<?> post(@RequestParam("file") MultipartFile file, @RequestParam("description") String description) {
        return templateService.post(file, description);
    }

    @Operation(summary = "Get a template by id", description = "Find the template by its id", tags = "Templates")
    @ApiResponse(responseCode = "200", description = "Found the template by id.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Template.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @GetMapping("{id}")
    public ResponseEntity<?> getById(@Parameter(description = "ID of the template to get") @PathVariable Long id) {
        return templateService.getById(id);
    }

    @Operation(summary = "Get all templates", description = "Get all available templates", tags = "Templates")
    @ApiResponse(responseCode = "200", description = "Found all available templates", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Template.class))) })
    @ApiResponse(responseCode = "204", description = "No templates found", content = @Content(mediaType = "text/plain"))
    @GetMapping
    public ResponseEntity<?> getAll () {
        return templateService.getAll();
    }


    @Operation(summary = "Get all deleted", description = "Get all deleted templates", tags = "Templates")
    @GetMapping("deleted")
    public ResponseEntity<?> getAllDeleted () {
        return templateService.getAllDeleted();
    }

    @Operation(summary = "Recover a deleted template", description = "Recover a deleted template", tags = "Templates")
    @PostMapping("recover/{id}")
    public ResponseEntity<?> recover(@PathVariable Long id) {
        return templateService.recover(id);
    }

    @Operation(summary = "Update a template", description = "Upload a template<br/>Constraints:<br/>1.Unique<br/>2.Template must be .docx<br/>3.For the documents to be filled, they need to have formated text that will be replaced (format: ${text})", tags = "Templates")
    @ApiResponse(responseCode = "200", description = "Template updated successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Template.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PatchMapping(value = "{id}", consumes = "multipart/form-data")
    public ResponseEntity<?>  patch (@Parameter(description = "ID of the template to be updated") @PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return templateService.patch(id, file);
    }

    @Operation(summary = "Delete a template", description = "Mark a template for deletion.<br/>Deletion in 30 days from the day of the request.<br/>The template can be recovered.", tags = "Templates")
    @ApiResponse(responseCode = "200", description = "Successfully marked for deletion")
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete (@Parameter(description = "ID of the template to be marked for deletion") @PathVariable Long id) {
        return templateService.delete(id);
    }

    @Operation(summary = "Download a template", description = "Download a template with a specific id", tags = "Templates")
    @ApiResponse(responseCode = "200", description = "Successfully downloaded the template")
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadTemplate(@PathVariable Long id) {
        Template template = templateRepository.findById(id).orElse(null);
        if (template != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + template.getName() + "\"")
                    .body(template.getContent());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
