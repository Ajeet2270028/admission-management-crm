package com.edumerge.admission_crm.security;


import com.edumerge.admission_crm.ENUM.*;
import com.edumerge.admission_crm.Entity.*;
import com.edumerge.admission_crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final InstitutionRepository institutionRepo;
    private final CampusRepository campusRepo;
    private final DepartmentRepository departmentRepo;
    private final AcademicYearRepository academicYearRepo;
    private final ProgramRepository programRepo;
    private final SeatQuotaRepository seatQuotaRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedMasterData();
    }

    private void seedUsers() {
        if (userRepo.count() > 0) return;
        userRepo.save(User.builder().username("admin").password(passwordEncoder.encode("admin123"))
                .fullName("System Admin").role(Role.ADMIN).build());
        userRepo.save(User.builder().username("officer").password(passwordEncoder.encode("officer123"))
                .fullName("Admission Officer").role(Role.ADMISSION_OFFICER).build());
        userRepo.save(User.builder().username("management").password(passwordEncoder.encode("mgmt123"))
                .fullName("Management User").role(Role.MANAGEMENT).build());
    }

    private void seedMasterData() {
        if (institutionRepo.count() > 0) return;

        Institution inst = institutionRepo.save(Institution.builder()
                .name("Edumerge Institute of Technology").code("EIT").address("Bangalore, Karnataka").build());

        Campus campus = campusRepo.save(Campus.builder()
                .name("Main Campus").location("Bangalore").institution(inst).build());

        Department cse = departmentRepo.save(Department.builder()
                .name("Computer Science & Engineering").code("CSE").campus(campus).build());
        Department ece = departmentRepo.save(Department.builder()
                .name("Electronics & Communication").code("ECE").campus(campus).build());

        AcademicYear ay = academicYearRepo.save(AcademicYear.builder()
                .year("2025-26").current(true).build());

        // CSE UG Program with 60 seats
        Program cseUG = programRepo.save(Program.builder()
                .name("B.E. Computer Science").code("CSE").courseType(CourseType.UG)
                .entryType(EntryType.REGULAR).totalIntake(60).department(cse).academicYear(ay).build());

        seatQuotaRepo.save(SeatQuota.builder().program(cseUG).quotaType(QuotaType.KCET).totalSeats(30).allocatedSeats(0).build());
        seatQuotaRepo.save(SeatQuota.builder().program(cseUG).quotaType(QuotaType.COMEDK).totalSeats(20).allocatedSeats(0).build());
        seatQuotaRepo.save(SeatQuota.builder().program(cseUG).quotaType(QuotaType.MANAGEMENT).totalSeats(10).allocatedSeats(0).build());

        // ECE UG Program with 60 seats
        Program eceUG = programRepo.save(Program.builder()
                .name("B.E. Electronics & Communication").code("ECE").courseType(CourseType.UG)
                .entryType(EntryType.REGULAR).totalIntake(60).department(ece).academicYear(ay).build());

        seatQuotaRepo.save(SeatQuota.builder().program(eceUG).quotaType(QuotaType.KCET).totalSeats(30).allocatedSeats(0).build());
        seatQuotaRepo.save(SeatQuota.builder().program(eceUG).quotaType(QuotaType.COMEDK).totalSeats(20).allocatedSeats(0).build());
        seatQuotaRepo.save(SeatQuota.builder().program(eceUG).quotaType(QuotaType.MANAGEMENT).totalSeats(10).allocatedSeats(0).build());
    }
}
