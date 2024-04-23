package pw.project.pwProject.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.project.pwProject.entities.Request;
import pw.project.pwProject.entities.Student;
import pw.project.pwProject.entities.dtos.RequestDto;
import pw.project.pwProject.entities.dtos.StudentDto;
import pw.project.pwProject.services.StudentService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/students/")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Operation(summary = "Create a new student", description = "Create a new student with all the required fields added.<br/>Constraints:<br/>1.First name and last name must have letters only.<br/>2.Email must be valid and unique.", tags = "Students")
    @ApiResponse(responseCode = "201", description = "Student created successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PostMapping
    @Deprecated
    public ResponseEntity<?> post (@RequestBody StudentDto studentDto) {
        return studentService.post(studentDto);
    }

    @Operation(summary = "Get all students", description = "If any students are available, returns a list of students.<br/>If no students are available then returns nothing.", tags = "Students")
    @ApiResponse(responseCode = "200", description = "Got all students", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Student.class))) })
    @ApiResponse(responseCode = "204", description = "No students found", content = @Content(mediaType = "text/plain"))
    @GetMapping
    public ResponseEntity<?> getAll () {
        return studentService.getAll();
    }

    @Operation(summary = "Update student fields", description = "Update student fields by filling only the needed fields.<br/>Constraints:<br/>1.First name and last name must have letters only.<br/>2.Email must be valid and unique.", tags = "Students")
    @ApiResponse(responseCode = "200", description = "Student updated successfully", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PatchMapping("{id}")
    public ResponseEntity<?> patch(@Parameter(description = "ID of the student to be updated") @PathVariable("id") Long id, StudentDto studentDto) {
        return studentService.patch(id, studentDto);
    }

    @Operation(summary = "Get a student by id.", description = "Find the student by its id", tags = "Students")
    @ApiResponse(responseCode = "200", description = "Found the student by id.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Student.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @GetMapping("{id}")
    public ResponseEntity<?> getById(@Parameter(description = "ID of the student to get") @PathVariable("id") Long id) {
        return studentService.getById(id);
    }

    @Operation(summary = "Delete a student", description = "Mark a student for deletion.<br/>Deletion in 30 days from the day of the request.<br/>The student can be recovered.", tags = "Students")
    @ApiResponse(responseCode = "200", description = "Successfully marked for deletion")
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete (@Parameter(description = "ID of the student to be marked for deletion") @PathVariable("id") Long id) {
        return studentService.delete(id);
    }

    @Operation(summary = "Request a document completion", description = "Request a document to be completed and generated", tags = "Students")
    @ApiResponse(responseCode = "200", description = "Successfully made the request", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Request.class)) })
    @ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "text/plain"))
    @PostMapping("request")
    public ResponseEntity<?> makeRequest (@RequestBody RequestDto requestDto) {
        return studentService.makeRequest(requestDto);
    }
}
