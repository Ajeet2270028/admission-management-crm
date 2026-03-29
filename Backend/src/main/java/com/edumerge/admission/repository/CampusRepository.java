package com.edumerge.admission.repository;

import com.edumerge.admission.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampusRepository extends JpaRepository<Campus, Long> {
    List<Campus> findByInstitutionIdAndActiveTrue(Long institutionId);
    List<Campus> findByActiveTrue();
}
