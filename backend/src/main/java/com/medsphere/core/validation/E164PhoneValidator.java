package com.medsphere.core.validation;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class E164PhoneValidator implements ConstraintValidator<ValidE164Phone, String> {

    private boolean optional;

    @Override
    public void initialize(ValidE164Phone constraintAnnotation) {
        this.optional = constraintAnnotation.optional();
    }

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || phone.isBlank()) {
            return optional; // nếu optional=true thì rỗng là hợp lệ, ngược lại không
        }

        try {
            PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
            // Số đã ở dạng E.164 (bắt đầu bằng "+"), không cần region hint
            Phonenumber.PhoneNumber parsed = phoneUtil.parse(phone, null);
            return phoneUtil.isValidNumber(parsed);
        } catch (NumberParseException ex) {
            return false;
        }
    }
}