package com.edumerge.admission.repository;

import com.edumerge.admission.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    List<AcademicYear> findByActiveTrue();
    Optional<AcademicYear> findByCurrentTrue();
}
