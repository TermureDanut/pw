package pw.project.pwProject.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private boolean completed;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Template template;
}
