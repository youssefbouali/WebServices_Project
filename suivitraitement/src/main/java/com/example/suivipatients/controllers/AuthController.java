package com.example.suivipatients.controllers;

import com.example.suivipatients.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> token(@RequestBody AuthRequest body) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.getUsername(), body.getPassword()));
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        String jwt = jwtUtil.generateToken(auth.getName(), claims);
        return ResponseEntity.ok(Map.of("token", jwt));
    }

    public static class AuthRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}

