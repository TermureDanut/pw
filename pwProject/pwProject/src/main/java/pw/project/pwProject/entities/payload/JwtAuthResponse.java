package pw.project.pwProject.entities.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private final String tokenType = "Bearer";
    private boolean isSecretary;
    private boolean isStudent;
    private Object user;
}