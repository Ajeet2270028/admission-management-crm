package com.edumerge.admission_crm.repository;


import com.edumerge.admission_crm.Entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    List<Institution> findByActiveTrue();
}