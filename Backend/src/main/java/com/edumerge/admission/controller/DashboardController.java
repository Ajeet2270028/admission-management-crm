package com.edumerge.admission.controller;

import com.edumerge.admission.entity.*;
import com.edumerge.admission.enums.*;
import com.edumerge.admission.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProgramRepository programRepo;
    private final SeatQuotaRepository seatQuotaRepo;
    private final ApplicantRepository applicantRepo;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();

        long totalApplicants = applicantRepo.count();
        long confirmed = applicantRepo.findByAdmissionStatus(AdmissionStatus.CONFIRMED).size();
        long seatLocked = applicantRepo.findByAdmissionStatus(AdmissionStatus.SEAT_LOCKED).size();
        long pendingDocs = applicantRepo.countPendingDocuments();
        long pendingFees = applicantRepo.countPendingFees();

        summary.put("totalApplicants", totalApplicants);
        summary.put("confirmedAdmissions", confirmed);
        summary.put("seatLockedCount", seatLocked);
        summary.put("pendingDocuments", pendingDocs);
        summary.put("pendingFees", pendingFees);

        // Program-wise stats
        List<Map<String, Object>> programStats = new ArrayList<>();
        for (Program program : programRepo.findAllActiveWithDetails()) {
            Map<String, Object> stat = new LinkedHashMap<>();
            stat.put("programId", program.getId());
            stat.put("programName", program.getName());
            stat.put("programCode", program.getCode());
            stat.put("totalIntake", program.getTotalIntake());

            long admitted = applicantRepo.countByProgramIdAndAdmissionStatus(
                    program.getId(), AdmissionStatus.CONFIRMED);
            stat.put("admittedCount", admitted);
            stat.put("remainingSeats", program.getTotalIntake() - admitted);

            // Quota breakdown
            List<Map<String, Object>> quotaStats = new ArrayList<>();
            for (SeatQuota quota : seatQuotaRepo.findByProgramId(program.getId())) {
                Map<String, Object> q = new LinkedHashMap<>();
                q.put("quotaType", quota.getQuotaType());
                q.put("totalSeats", quota.getTotalSeats());
                q.put("allocatedSeats", quota.getAllocatedSeats());
                q.put("availableSeats", quota.getAvailableSeats());
                quotaStats.add(q);
            }
            stat.put("quotaBreakdown", quotaStats);
            programStats.add(stat);
        }

        summary.put("programStats", programStats);
        return summary;
    }

    @GetMapping("/pending-documents")
    public List<Applicant> getPendingDocuments() {
        return applicantRepo.findByDocumentStatus(DocumentStatus.PENDING);
    }

    @GetMapping("/pending-fees")
    public List<Applicant> getPendingFees() {
        return applicantRepo.findByFeeStatus(FeeStatus.PENDING);
    }
}
