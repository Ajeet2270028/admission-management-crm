package com.edumerge.admission_crm.repository;


import com.edumerge.admission_crm.Entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByDepartmentIdAndActiveTrue(Long departmentId);
    List<Program> findByActiveTrue();

    @Query("SELECT p FROM Program p JOIN FETCH p.department d JOIN FETCH d.campus c " +
            "JOIN FETCH c.institution WHERE p.active = true")
    List<Program> findAllActiveWithDetails();
}
