package pw.project.pwProject.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.project.pwProject.entities.Request;
import pw.project.pwProject.entities.Secretary;
import pw.project.pwProject.entities.dtos.SecretaryDto;
import pw.project.pwProject.services.SecretaryService;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/secretaries/")
public class SecretaryController {
    @Autowired
    private SecretaryService secretaryService;

    @PostMapping
    @Operation(summary = "Create a new secretary", description = "Create a new secretary with all the required fields added.<br/>Constraints:<br/>1.First name and last name must have letters only.<br/>2.Email must be valid and unique.", tags = "Secretaries")
    @ApiResponse(responseCode = "201", description = "Secretary created successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Secretary.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @Deprecated
    public ResponseEntity<?> post(@RequestBody SecretaryDto secretaryDto) {
        return secretaryService.post(secretaryDto);
    }

    @Operation(summary = "Get all uncompleted requests", description = "If any uncompleted requests are available, returns a list of uncompleted requests.<br/>If no uncompleted requests are available then returns nothing.", tags = "Secretaries")
    @ApiResponse(responseCode = "200", description = "Got all uncompleted requests", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Request.class))) })
    @ApiResponse(responseCode = "204", description = "No uncompleted requests found", content = @Content(mediaType = "text/plain"))
    @GetMapping("/requests/uncompleted")
    public ResponseEntity<?> getUncompleted() {
        return secretaryService.getUncompleted();
    }

    @Operation(summary = "Update secretary fields", description = "Update secretary fields by filling only the needed fields.<br/>Constraints:<br/>1.First name and last name must have letters only.<br/>2.Email must be valid and unique.", tags = "Secretaries")
    @ApiResponse(responseCode = "200", description = "Secretary updated successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Secretary.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PatchMapping("{id}")
    public ResponseEntity<?> patch(@Parameter(description = "ID of the secretary to be updated") @PathVariable("id") Long id, SecretaryDto secretaryDto) {
        return secretaryService.patch(id, secretaryDto);
    }

    @Operation(summary = "Get a secretary by id.", description = "Find the secretary by its id", tags = "Secretaries")
    @ApiResponse(responseCode = "200", description = "Found the secretary by id.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Secretary.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @GetMapping("{id}")
    public ResponseEntity<?> getById(@Parameter(description = "ID of the Secretary to get") @PathVariable("id") Long id) {
        return secretaryService.getById(id);
    }

    @Operation(summary = "Delete a secretary", description = "Mark a secretary for deletion.<br/>Deletion in 30 days from the day of the request.<br/>The secretary can be recovered.", tags = "Secretaries")
    @ApiResponse(responseCode = "200", description = "Successfully marked for deletion")
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete (@Parameter(description = "ID of the Secretary to be marked for deletion") @PathVariable("id") Long id) {
        return secretaryService.delete(id);
    }
}
