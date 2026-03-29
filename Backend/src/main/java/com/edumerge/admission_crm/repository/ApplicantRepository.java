package com.edumerge.admission_crm.repository;

import com.edumerge.admission_crm.ENUM.DocumentStatus;
import com.edumerge.admission_crm.ENUM.*;
import com.edumerge.admission_crm.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    boolean existsByEmail(String email);
    Optional<Applicant> findByAdmissionNumber(String admissionNumber);
    List<Applicant> findByProgramId(Long programId);
    List<Applicant> findByDocumentStatus(DocumentStatus status);
    List<Applicant> findByFeeStatus(FeeStatus status);
    List<Applicant> findByAdmissionStatus(AdmissionStatus status);

    long countByProgramIdAndAdmissionStatus(Long programId, AdmissionStatus status);
    long countByProgramIdAndSeatQuotaQuotaType(Long programId, QuotaType quotaType);

    @Query("SELECT COUNT(a) FROM Applicant a WHERE a.documentStatus = 'PENDING' AND a.admissionStatus != 'CANCELLED'")
    long countPendingDocuments();

    @Query("SELECT COUNT(a) FROM Applicant a WHERE a.feeStatus = 'PENDING' AND a.admissionStatus = 'SEAT_LOCKED'")
    long countPendingFees();
}
