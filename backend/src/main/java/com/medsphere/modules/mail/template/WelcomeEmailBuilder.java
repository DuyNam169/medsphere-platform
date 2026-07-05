package com.medsphere.modules.mail.template;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class WelcomeEmailBuilder {

    private final MessageSource mailMessageSource;

    public record Built(String subject, String html) {}

    public Built build(String fullName, String language) {
        Locale locale = Locale.forLanguageTag(language);

        String subject  = t("welcome.subject", locale);
        String title    = t("welcome.title", locale, fullName);
        String greeting = t("welcome.greeting", locale);
        String body1    = t("welcome.body", locale);

        String body = """
            <h2 style="margin:0 0 12px;color:#050505;font-size:20px;">%s</h2>
            <p style="margin:0 0 16px;color:#65676B;font-size:14px;line-height:1.6;">%s</p>
            <p style="margin:0;color:#65676B;font-size:14px;line-height:1.6;">%s</p>
            """.formatted(title, greeting, body1);

        return new Built(subject, EmailLayout.wrap(body));
    }

    private String t(String key, Locale locale, Object... args) {
        return mailMessageSource.getMessage(key, args, locale);
    }
}