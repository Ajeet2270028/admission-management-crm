package com.edumerge.admission_crm.repository;


import com.edumerge.admission_crm.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByCampusIdAndActiveTrue(Long campusId);
    List<Department> findByActiveTrue();
}
