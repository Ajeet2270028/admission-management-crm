package com.edumerge.admission_crm.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_years")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AcademicYear {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String year; // e.g. "2025-26"

    private boolean current = false;
    private boolean active = true;
}

