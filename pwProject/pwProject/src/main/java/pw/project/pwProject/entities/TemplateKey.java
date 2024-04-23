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
public class TemplateKey {
    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 50, nullable = false)
    private String key;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Template template;
}
