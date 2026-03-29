package com.edumerge.admission.entity;

import com.edumerge.admission.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "applicants")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Applicant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Details (15 fields max)
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String nationality = "Indian";

    private String state;

    // Academic Details
    private String qualifyingExam;   // e.g. "12th Board"
    private String qualifyingBoard;
    private Double qualifyingMarks;
    private Double qualifyingPercentage;

    // Admission Details
    @Enumerated(EnumType.STRING)
    private EntryType entryType;

    @Enumerated(EnumType.STRING)
    private QuotaType quotaType;

    @Enumerated(EnumType.STRING)
    private AdmissionMode admissionMode;

    private String allotmentNumber; // for KCET/COMEDK

    // Status
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AdmissionStatus admissionStatus = AdmissionStatus.APPLIED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DocumentStatus documentStatus = DocumentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeeStatus feeStatus = FeeStatus.PENDING;

    // Admission Number (generated once, immutable)
    @Column(unique = true)
    private String admissionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_quota_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SeatQuota seatQuota;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
