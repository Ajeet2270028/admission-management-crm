package com.edumerge.admission_crm.repository;


import com.edumerge.admission_crm.ENUM.QuotaType;
import com.edumerge.admission_crm.Entity.SeatQuota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface SeatQuotaRepository extends JpaRepository<SeatQuota, Long> {
    List<SeatQuota> findByProgramId(Long programId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<SeatQuota> findByProgramIdAndQuotaType(Long programId, QuotaType quotaType);
}

