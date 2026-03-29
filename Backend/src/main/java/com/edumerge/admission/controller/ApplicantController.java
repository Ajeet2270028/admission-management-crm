package com.edumerge.admission.controller;

import com.edumerge.admission.entity.Applicant;
import com.edumerge.admission.enums.*;
import com.edumerge.admission.repository.ApplicantRepository;
import com.edumerge.admission.service.ApplicantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;
    private final ApplicantRepository applicantRepo;

    @GetMapping
    public List<Applicant> getAll(
            @RequestParam(required = false) Long programId,
            @RequestParam(required = false) String status) {
        if (programId != null) return applicantRepo.findByProgramId(programId);
        if (status != null) return applicantRepo.findByAdmissionStatus(AdmissionStatus.valueOf(status));
        return applicantRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Applicant> getById(@PathVariable Long id) {
        return applicantRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Applicant applicant = applicantService.createApplicant(body);
            return ResponseEntity.ok(applicant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/allocate-seat")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> allocateSeat(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(applicantService.allocateSeat(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> confirmAdmission(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(applicantService.confirmAdmission(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/document-status")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> updateDocStatus(@PathVariable Long id,
                                             @RequestBody Map<String, String> body) {
        try {
            DocumentStatus status = DocumentStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(applicantService.updateDocumentStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/fee-status")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> updateFeeStatus(@PathVariable Long id,
                                             @RequestBody Map<String, String> body) {
        try {
            FeeStatus status = FeeStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(applicantService.updateFeeStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER')")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(applicantService.cancelAdmission(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
