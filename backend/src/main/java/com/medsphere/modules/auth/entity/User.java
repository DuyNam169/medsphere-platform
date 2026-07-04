package com.medsphere.modules.auth.entity;

import com.medsphere.core.entity.BaseEntity;
import com.medsphere.modules.auth.enums.AuthProvider;
import com.medsphere.modules.auth.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email",     columnNames = "email"),
                @UniqueConstraint(name = "uk_users_google_id", columnNames = "google_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false, length = 255)
    private String email;

    // Nullable — null when provider = GOOGLE
    @Column(length = 60)
    private String passwordHash;

    @Column(length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(length = 512)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "google_id", length = 128)
    private String googleId;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean accountNonLocked = true;

    // ── UserDetails ───────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String  getPassword()               { return passwordHash; }
    @Override public String  getUsername()               { return email; }
    @Override public boolean isAccountNonExpired()       { return true; }
    @Override public boolean isAccountNonLocked()        { return accountNonLocked; }
    @Override public boolean isCredentialsNonExpired()   { return true; }
    @Override public boolean isEnabled()                 { return enabled; }
}