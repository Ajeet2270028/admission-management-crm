package com.edumerge.admission_crm.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campuses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Campus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    private boolean active = true;
}
