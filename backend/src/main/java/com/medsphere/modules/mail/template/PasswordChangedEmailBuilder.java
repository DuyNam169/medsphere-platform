package com.medsphere.modules.mail.template;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class PasswordChangedEmailBuilder {

    private static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm 'UTC'").withZone(ZoneOffset.UTC);

    private final MessageSource mailMessageSource;

    public record Built(String subject, String html) {}

    public Built build(String fullName, String ip, Instant changeTime,
                        String notMeUrl, String language) {
        Locale locale = Locale.forLanguageTag(language);

        String subject   = t("password_changed.subject", locale);
        String title     = t("password_changed.title", locale);
        String greeting  = t("password_changed.greeting", locale, fullName);
        String timeLabel = t("password_changed.time_label", locale);
        String ipLabel   = t("password_changed.ip_label", locale);
        String notMePrompt = t("password_changed.not_me_prompt", locale);
        String notMeButton = t("password_changed.not_me_button", locale);
        String ignore    = t("password_changed.ignore", locale);

        String body = """
            <h2 style="margin:0 0 12px;color:#050505;font-size:20px;">%s</h2>
            <p style="margin:0 0 20px;color:#65676B;font-size:14px;line-height:1.6;">%s</p>
            <table cellpadding="0" cellspacing="0" width="100%%"
                   style="background:#F7F8FA;border-radius:8px;margin-bottom:20px;">
              <tr><td style="padding:12px 16px;font-size:13px;color:#050505;">
                <b>%s:</b> %s<br/>
                <b>%s:</b> %s
              </td></tr>
            </table>
            <p style="margin:0 0 4px;color:#050505;font-size:14px;font-weight:600;">%s</p>
            %s
            <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;">%s</p>
            """.formatted(
                title, greeting,
                timeLabel, TIME_FORMAT.format(changeTime),
                ipLabel, ip,
                notMePrompt,
                EmailLayout.button(notMeUrl, notMeButton, "#dc2626"),
                ignore
            );

        return new Built(subject, EmailLayout.wrap(body));
    }

    private String t(String key, Locale locale, Object... args) {
        return mailMessageSource.getMessage(key, args, locale);
    }
}