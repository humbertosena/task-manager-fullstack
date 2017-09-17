package hss.desafio.domain;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@Entity
@Table(name = "task")
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable =  true)
    private String answer;

    @Embedded
    private User assigned;

    @Column(columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    private Date createDate;

    @Column(nullable = false)
    private Boolean completed;

    public Task() {
        this.completed = false;
    }

    public Task(String description) {
        this();
        this.description = description;
    }

    public Task(String description, User assigned) {
        this(description);
        this.assigned = assigned;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public User getAssigned() {
        return assigned;
    }

    public void setAssigned(User assigned) {
        this.assigned = assigned;
    }

    public Date getCreateDate() {
        return this.createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Boolean getCompleted() { return this.completed; }

    public void setCompleted(Boolean completed) { this.completed = completed; }

}
