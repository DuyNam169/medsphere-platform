package com.medsphere.modules.mail.template;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class OtpResetPasswordEmailBuilder {

    private final MessageSource mailMessageSource;

    public record Built(String subject, String html) {}

    public Built build(String otp, String language) {
        Locale locale = Locale.forLanguageTag(language);

        String subject = t("otp.subject", locale);
        String title    = t("otp.title", locale);
        String greeting = t("otp.greeting", locale);
        String codeLabel = t("otp.code_label", locale);
        String expiry   = t("otp.expiry", locale);
        String ignore   = t("otp.ignore", locale);

        String otpBoxes = buildOtpBoxesHtml(otp);

        String body = """
            <h2 style="margin:0 0 12px;color:#050505;font-size:20px;">%s</h2>
            <p style="margin:0 0 24px;color:#65676B;font-size:14px;line-height:1.6;">%s</p>
            <p style="margin:0 0 12px;color:#050505;font-size:13px;font-weight:600;">%s</p>
            <table cellpadding="0" cellspacing="0" align="center"><tr>%s</tr></table>
            <p style="margin:20px 0 8px;color:#9ca3af;font-size:12px;">%s</p>
            <p style="margin:0;color:#9ca3af;font-size:12px;">%s</p>
            """.formatted(title, greeting, codeLabel, otpBoxes, expiry, ignore);

        return new Built(subject, EmailLayout.wrap(body));
    }

    private String t(String key, Locale locale) {
        return mailMessageSource.getMessage(key, null, locale);
    }

    private String buildOtpBoxesHtml(String otp) {
        StringBuilder sb = new StringBuilder();
        for (char c : otp.toCharArray()) {
            sb.append("""
                <td style="width:44px;height:52px;background:#F7F8FA;border:2px solid #E4E6EB;
                    border-radius:8px;text-align:center;vertical-align:middle;
                    font-size:24px;font-weight:700;color:#1E3A5F;font-family:Arial,sans-serif;">
                    %s
                </td>
                <td style="width:8px;"></td>
                """.formatted(c));
        }
        return sb.toString();
    }
}