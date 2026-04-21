package com.tlcn.fashion_api.security;

import io.jsonwebtoken.Claims;

import java.util.Set;

public interface JwtService {
    
    String generateAccessToken(Long userId, String email, Set<String> roles);
    
    String generateRefreshToken(Long userId);
    
    boolean validateToken(String token);
    
    Long getUserIdFromToken(String token);
    
    String getEmailFromToken(String token);
    
    Set<String> getRolesFromToken(String token);
    
    Claims getClaimsFromToken(String token);
}

