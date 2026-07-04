package com.medsphere.modules.auth.enums;

public enum AuthProvider {
    LOCAL,    // email + bcrypt password
    GOOGLE    // Google OAuth — no password stored
}