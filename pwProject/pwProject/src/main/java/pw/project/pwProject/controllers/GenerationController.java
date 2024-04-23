package pw.project.pwProject.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.project.pwProject.services.GenerationService;

@RestController
@RequestMapping("/generate/")
public class GenerationController {
    @Autowired
    private GenerationService generationService;

    @Operation(summary = "Generate a completed document", description = "Generate a document based of a student's request.<br/>Student request consists of:<br/>- Student ID<br/>- Template ID<br/>The resulting document is a .docx from the template filled with the student's data.", tags = "Generation")
    @ApiResponse(responseCode = "200", description = "Successfully generated the requested document", content = @Content(mediaType = "multipart/form-data"))
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PostMapping("{id}")
    public ResponseEntity<?> generate (@Parameter(description = "ID of the request to be solved") @PathVariable("id") Long id) {
        return generationService.generate(id);
    }
}
