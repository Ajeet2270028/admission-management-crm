package com.edumerge.admission.entity;

import com.edumerge.admission.enums.QuotaType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat_quotas")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SeatQuota {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Program program;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuotaType quotaType;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Integer allocatedSeats = 0;

    public Integer getAvailableSeats() {
        return totalSeats - allocatedSeats;
    }

    public boolean isFull() {
        return allocatedSeats >= totalSeats;
    }
}
