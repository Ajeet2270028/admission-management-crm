package com.edumerge.admission_crm.controller;


import com.edumerge.admission_crm.Entity.User;
import com.edumerge.admission_crm.dto.LoginRequest;
import com.edumerge.admission_crm.repository.UserRepository;
import com.edumerge.admission_crm.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        String token = jwtUtils.generateToken(auth);
        User user = userRepository.findByUsername(req.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "role", user.getRole().name()
        ));
    }
}
