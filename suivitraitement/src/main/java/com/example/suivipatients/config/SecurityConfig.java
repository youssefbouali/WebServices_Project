package com.example.suivipatients.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Arrays;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SecurityConfig {

    @Value("${APP_CORS_ALLOWED_ORIGINS:http://localhost:8080,http://localhost:5000,http://localhost:3000}")
    private String allowedOrigins;

    @Value("${APP_CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${APP_CORS_ALLOWED_HEADERS:*}")
    private String allowedHeaders;

    @Value("${APP_CORS_ALLOW_CREDENTIALS:true}")
    private boolean allowCredentials;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Autoriser toutes les requêtes OPTIONS (préflight CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Autoriser l'accès public aux endpoints de traitements
                        .requestMatchers("/api/treatments/**").permitAll()
                        // Autoriser l'accès public aux endpoints de santé
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        // Toutes les autres requêtes sont autorisées (vous pouvez ajuster selon vos besoins)
                        .anyRequest().permitAll());

        return http.build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Utiliser les valeurs du .env avec des noms de variables cohérents
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();
        
        List<String> methods = Arrays.stream(allowedMethods.split(","))
                .map(String::trim)
                .filter(method -> !method.isEmpty())
                .toList();
        
        List<String> headers = Arrays.stream(allowedHeaders.split(","))
                .map(String::trim)
                .filter(header -> !header.isEmpty())
                .toList();
        
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(methods);
        configuration.setAllowedHeaders(headers);
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(3600L); // Cache des préflight requests pendant 1 heure

        System.out.println("🔧 CORS Configuration chargée:");
        System.out.println("   - Origines autorisées: " + origins);
        System.out.println("   - Méthodes autorisées: " + methods);
        System.out.println("   - Headers autorisés: " + headers);
        System.out.println("   - Credentials: " + allowCredentials);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Appliquer à toutes les routes
        return source;
    }
}
