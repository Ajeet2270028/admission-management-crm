package com.edumerge.admission_crm.repository;


import com.edumerge.admission_crm.Entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampusRepository extends JpaRepository<Campus, Long> {
    List<Campus> findByInstitutionIdAndActiveTrue(Long institutionId);
    List<Campus> findByActiveTrue();
}
