package com.edumerge.admission_crm.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "institutions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Institution {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String code;
    private String address;
    private boolean active = true;
}
