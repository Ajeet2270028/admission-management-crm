package com.edumerge.admission_crm.Entity;


import com.edumerge.admission_crm.ENUM.CourseType;
import com.edumerge.admission_crm.ENUM.EntryType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Program {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code; // e.g. "CSE"

    @Enumerated(EnumType.STRING)
    private CourseType courseType;

    @Enumerated(EnumType.STRING)
    private EntryType entryType;

    private Integer totalIntake;

    private Integer supernumerarySeats = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    private boolean active = true;
}
