-- Users table
CREATE TABLE public.users (
    id                  UUID PRIMARY KEY,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(60),
    full_name           VARCHAR(100),
    phone               VARCHAR(20),
    avatar_url          VARCHAR(512),
    role                VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','DOCTOR','PATIENT','BUSINESS','USER')),
    provider            VARCHAR(10) NOT NULL CHECK (provider IN ('LOCAL','GOOGLE')),
    google_id           VARCHAR(128),
    enabled             BOOLEAN NOT NULL,
    account_non_locked  BOOLEAN NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_google_id UNIQUE (google_id)
);

-- Patient profiles
CREATE TABLE public.patient_profiles (
    id               UUID PRIMARY KEY,
    created_at       TIMESTAMPTZ NOT NULL,
    updated_at       TIMESTAMPTZ NOT NULL,
    user_id          UUID NOT NULL,
    date_of_birth    DATE,
    gender           VARCHAR(10) CHECK (gender IN ('MALE','FEMALE','OTHER')),
    province         VARCHAR(100),
    address_detail   VARCHAR(255),
    blood_type       VARCHAR(10),
    medical_history  TEXT,
    CONSTRAINT uk_patient_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_patient_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Doctor profiles
CREATE TABLE public.doctor_profiles (
    id                   UUID PRIMARY KEY,
    created_at           TIMESTAMPTZ NOT NULL,
    updated_at           TIMESTAMPTZ NOT NULL,
    user_id              UUID NOT NULL,
    specialty            VARCHAR(100),
    workplace            VARCHAR(255),
    years_of_experience  INTEGER,
    bio                  TEXT,
    consultation_fee     NUMERIC(38,2),
    license_number       VARCHAR(50),
    license_image_url    VARCHAR(512),
    verification_status  VARCHAR(20) NOT NULL CHECK (verification_status IN ('PENDING','APPROVED','REJECTED')),
    rejection_reason     VARCHAR(500),
    CONSTRAINT uk_doctor_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_doctor_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Business profiles
CREATE TABLE public.business_profiles (
    id                      UUID PRIMARY KEY,
    created_at              TIMESTAMPTZ NOT NULL,
    updated_at              TIMESTAMPTZ NOT NULL,
    user_id                 UUID NOT NULL,
    business_name           VARCHAR(255),
    tax_code                VARCHAR(50),
    headquarters_address    VARCHAR(255),
    license_image_url       VARCHAR(512),
    verification_status     VARCHAR(20) NOT NULL CHECK (verification_status IN ('PENDING','APPROVED','REJECTED')),
    rejection_reason        VARCHAR(500),
    CONSTRAINT uk_business_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_business_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);