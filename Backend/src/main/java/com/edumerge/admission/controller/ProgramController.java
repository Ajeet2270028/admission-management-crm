package com.edumerge.admission.controller;

import com.edumerge.admission.entity.*;
import com.edumerge.admission.enums.*;
import com.edumerge.admission.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramRepository programRepo;
    private final DepartmentRepository departmentRepo;
    private final AcademicYearRepository academicYearRepo;
    private final SeatQuotaRepository seatQuotaRepo;

    @GetMapping
    public List<Program> getAllPrograms() {
        return programRepo.findAllActiveWithDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Program> getProgram(@PathVariable Long id) {
        return programRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProgram(@RequestBody Map<String, Object> body) {
        Long deptId = Long.valueOf(body.get("departmentId").toString());
        Long ayId = Long.valueOf(body.get("academicYearId").toString());
        Department dept = departmentRepo.findById(deptId).orElseThrow();
        AcademicYear ay = academicYearRepo.findById(ayId).orElseThrow();

        int totalIntake = Integer.parseInt(body.get("totalIntake").toString());

        // Validate quota sum
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> quotas = (List<Map<String, Object>>) body.get("quotas");
        int quotaSum = quotas.stream().mapToInt(q -> Integer.parseInt(q.get("seats").toString())).sum();
        if (quotaSum != totalIntake) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Sum of quota seats (" + quotaSum + ") must equal total intake (" + totalIntake + ")"));
        }

        Program program = Program.builder()
                .name(body.get("name").toString())
                .code(body.get("code").toString())
                .courseType(CourseType.valueOf(body.get("courseType").toString()))
                .entryType(EntryType.valueOf(body.get("entryType").toString()))
                .totalIntake(totalIntake)
                .supernumerarySeats(Integer.parseInt(body.getOrDefault("supernumerarySeats", "0").toString()))
                .department(dept)
                .academicYear(ay)
                .active(true)
                .build();
        program = programRepo.save(program);

        for (Map<String, Object> q : quotas) {
            SeatQuota quota = SeatQuota.builder()
                    .program(program)
                    .quotaType(QuotaType.valueOf(q.get("quotaType").toString()))
                    .totalSeats(Integer.parseInt(q.get("seats").toString()))
                    .allocatedSeats(0)
                    .build();
            seatQuotaRepo.save(quota);
        }

        return ResponseEntity.ok(programRepo.findById(program.getId()).orElseThrow());
    }

    @GetMapping("/{id}/quotas")
    public ResponseEntity<List<Map<String, Object>>> getProgramQuotas(@PathVariable Long id) {
        List<SeatQuota> quotas = seatQuotaRepo.findByProgramId(id);
        List<Map<String, Object>> result = new ArrayList<>();
        for (SeatQuota q : quotas) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", q.getId());
            m.put("quotaType", q.getQuotaType());
            m.put("totalSeats", q.getTotalSeats());
            m.put("allocatedSeats", q.getAllocatedSeats());
            m.put("availableSeats", q.getAvailableSeats());
            m.put("full", q.isFull());
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }
}
