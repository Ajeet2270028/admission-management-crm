package com.edumerge.admission_crm.controller;

import com.edumerge.admission_crm.Entity.*;
import com.edumerge.admission_crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
public class MasterController {

    private final InstitutionRepository institutionRepo;
    private final CampusRepository campusRepo;
    private final DepartmentRepository departmentRepo;
    private final AcademicYearRepository academicYearRepo;

    // ---- INSTITUTION ----
    @GetMapping("/institutions")
    public List<Institution> getAllInstitutions() {
        return institutionRepo.findByActiveTrue();
    }

    @PostMapping("/institutions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Institution> createInstitution(@RequestBody Institution institution) {
        institution.setActive(true);
        return ResponseEntity.ok(institutionRepo.save(institution));
    }

    @PutMapping("/institutions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Institution> updateInstitution(@PathVariable Long id, @RequestBody Institution body) {
        return institutionRepo.findById(id).map(inst -> {
            inst.setName(body.getName());
            inst.setCode(body.getCode());
            inst.setAddress(body.getAddress());
            return ResponseEntity.ok(institutionRepo.save(inst));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---- CAMPUS ----
    @GetMapping("/campuses")
    public List<Campus> getAllCampuses() {
        return campusRepo.findByActiveTrue();
    }

    @GetMapping("/campuses/by-institution/{institutionId}")
    public List<Campus> getCampusesByInstitution(@PathVariable Long institutionId) {
        return campusRepo.findByInstitutionIdAndActiveTrue(institutionId);
    }

    @PostMapping("/campuses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campus> createCampus(@RequestBody java.util.Map<String, Object> body) {
        Long institutionId = Long.valueOf(body.get("institutionId").toString());
        Institution inst = institutionRepo.findById(institutionId).orElseThrow();
        Campus campus = Campus.builder()
                .name(body.get("name").toString())
                .location(body.getOrDefault("location", "").toString())
                .institution(inst).active(true).build();
        return ResponseEntity.ok(campusRepo.save(campus));
    }

    // ---- DEPARTMENT ----
    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return departmentRepo.findByActiveTrue();
    }

    @GetMapping("/departments/by-campus/{campusId}")
    public List<Department> getDeptByCampus(@PathVariable Long campusId) {
        return departmentRepo.findByCampusIdAndActiveTrue(campusId);
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Department> createDepartment(@RequestBody java.util.Map<String, Object> body) {
        Long campusId = Long.valueOf(body.get("campusId").toString());
        Campus campus = campusRepo.findById(campusId).orElseThrow();
        Department dept = Department.builder()
                .name(body.get("name").toString())
                .code(body.getOrDefault("code", "").toString())
                .campus(campus).active(true).build();
        return ResponseEntity.ok(departmentRepo.save(dept));
    }

    // ---- ACADEMIC YEAR ----
    @GetMapping("/academic-years")
    public List<AcademicYear> getAcademicYears() {
        return academicYearRepo.findByActiveTrue();
    }

    @PostMapping("/academic-years")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicYear> createAcademicYear(@RequestBody AcademicYear ay) {
        ay.setActive(true);
        return ResponseEntity.ok(academicYearRepo.save(ay));
    }
}
