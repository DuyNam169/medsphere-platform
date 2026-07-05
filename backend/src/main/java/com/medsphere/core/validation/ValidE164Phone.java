package com.medsphere.core.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = E164PhoneValidator.class)
public @interface ValidE164Phone {
    String message() default "Invalid phone number";
    boolean optional() default false; // true = cho phép rỗng/null
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}