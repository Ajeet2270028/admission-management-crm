package com.edumerge.admission_crm.service;


import com.edumerge.admission_crm.ENUM.*;
import com.edumerge.admission_crm.Entity.*;
import com.edumerge.admission_crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicantService {

    private final ApplicantRepository applicantRepo;
    private final ProgramRepository programRepo;
    private final SeatQuotaRepository seatQuotaRepo;

    @Transactional
    public Applicant createApplicant(Map<String, Object> body) {
        if (applicantRepo.existsByEmail(body.get("email").toString())) {
            throw new RuntimeException("Applicant with this email already exists");
        }

        Applicant applicant = Applicant.builder()
                .firstName(body.get("firstName").toString())
                .lastName(body.get("lastName").toString())
                .email(body.get("email").toString())
                .phone(body.get("phone").toString())
                .gender(body.getOrDefault("gender", "").toString())
                .nationality(body.getOrDefault("nationality", "Indian").toString())
                .state(body.getOrDefault("state", "").toString())
                .category(Category.valueOf(body.getOrDefault("category", "GM").toString()))
                .qualifyingExam(body.getOrDefault("qualifyingExam", "").toString())
                .qualifyingBoard(body.getOrDefault("qualifyingBoard", "").toString())
                .qualifyingMarks(body.get("qualifyingMarks") != null
                        ? Double.parseDouble(body.get("qualifyingMarks").toString()) : null)
                .qualifyingPercentage(body.get("qualifyingPercentage") != null
                        ? Double.parseDouble(body.get("qualifyingPercentage").toString()) : null)
                .entryType(EntryType.valueOf(body.getOrDefault("entryType", "REGULAR").toString()))
                .quotaType(QuotaType.valueOf(body.getOrDefault("quotaType", "MANAGEMENT").toString()))
                .admissionMode(AdmissionMode.valueOf(body.getOrDefault("admissionMode", "MANAGEMENT").toString()))
                .allotmentNumber(body.getOrDefault("allotmentNumber", "").toString())
                .admissionStatus(AdmissionStatus.APPLIED)
                .documentStatus(DocumentStatus.PENDING)
                .feeStatus(FeeStatus.PENDING)
                .build();

        if (body.get("programId") != null) {
            Program program = programRepo.findById(Long.valueOf(body.get("programId").toString()))
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            applicant.setProgram(program);
        }

        return applicantRepo.save(applicant);
    }

    @Transactional
    public Applicant allocateSeat(Long applicantId) {
        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        if (applicant.getProgram() == null) {
            throw new RuntimeException("No program assigned to applicant");
        }
        if (applicant.getAdmissionStatus() != AdmissionStatus.APPLIED) {
            throw new RuntimeException("Seat already allocated or admission is not in APPLIED state");
        }

        // Pessimistic lock on quota row to prevent race conditions
        SeatQuota quota = seatQuotaRepo
                .findByProgramIdAndQuotaType(applicant.getProgram().getId(), applicant.getQuotaType())
                .orElseThrow(() -> new RuntimeException("Quota not configured for this program"));

        if (quota.isFull()) {
            throw new RuntimeException("No seats available in " + applicant.getQuotaType() + " quota. All seats are filled.");
        }

        // Lock the seat
        quota.setAllocatedSeats(quota.getAllocatedSeats() + 1);
        seatQuotaRepo.save(quota);

        applicant.setSeatQuota(quota);
        applicant.setAdmissionStatus(AdmissionStatus.SEAT_LOCKED);
        return applicantRepo.save(applicant);
    }

    @Transactional
    public Applicant confirmAdmission(Long applicantId) {
        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        if (applicant.getAdmissionStatus() != AdmissionStatus.SEAT_LOCKED) {
            throw new RuntimeException("Seat must be locked before confirming admission");
        }
        if (applicant.getFeeStatus() != FeeStatus.PAID) {
            throw new RuntimeException("Admission can only be confirmed after fee is paid");
        }
        if (applicant.getAdmissionNumber() != null) {
            throw new RuntimeException("Admission number already generated");
        }

        String admissionNumber = generateAdmissionNumber(applicant);
        applicant.setAdmissionNumber(admissionNumber);
        applicant.setAdmissionStatus(AdmissionStatus.CONFIRMED);
        return applicantRepo.save(applicant);
    }

    @Transactional
    public Applicant updateDocumentStatus(Long applicantId, DocumentStatus status) {
        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));
        applicant.setDocumentStatus(status);
        return applicantRepo.save(applicant);
    }

    @Transactional
    public Applicant updateFeeStatus(Long applicantId, FeeStatus status) {
        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));
        applicant.setFeeStatus(status);
        return applicantRepo.save(applicant);
    }

    @Transactional
    public Applicant cancelAdmission(Long applicantId) {
        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        // Release seat if locked
        if (applicant.getAdmissionStatus() == AdmissionStatus.SEAT_LOCKED && applicant.getSeatQuota() != null) {
            SeatQuota quota = applicant.getSeatQuota();
            quota.setAllocatedSeats(Math.max(0, quota.getAllocatedSeats() - 1));
            seatQuotaRepo.save(quota);
        }

        applicant.setAdmissionStatus(AdmissionStatus.CANCELLED);
        return applicantRepo.save(applicant);
    }

    private String generateAdmissionNumber(Applicant applicant) {
        Program program = applicant.getProgram();
        // Get institution code
        String instCode = program.getDepartment().getCampus().getInstitution().getCode();
        String year = program.getAcademicYear().getYear().split("-")[0]; // "2025"
        String courseType = program.getCourseType().name(); // "UG"
        String programCode = program.getCode(); // "CSE"
        String quotaType = applicant.getQuotaType().name(); // "KCET"

        // Count confirmed admissions for this program+quota to get serial
        long count = applicantRepo.countByProgramIdAndSeatQuotaQuotaType(
                program.getId(), applicant.getQuotaType());

        String serial = String.format("%04d", count);
        return String.format("%s/%s/%s/%s/%s/%s", instCode, year, courseType, programCode, quotaType, serial);
    }
}
