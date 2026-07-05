package com.medsphere.modules.mail.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;

@Slf4j
@Service
public class MailServiceImpl implements MailService {

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.mail.sendgrid-api-key}")
    private String sendgridApiKey;

    @Override
    @Async
    public void sendHtml(String toEmail, String subject, String htmlBody) {
        log.info("Attempting to send email to {} — subject: {}", toEmail, subject);

        if (!StringUtils.hasText(sendgridApiKey)) {
            log.warn("SendGrid API key is empty. Skipping email send to {}. Configure app.mail.sendgrid-api-key.", toEmail);
            return;
        }

        if (!StringUtils.hasText(fromAddress)) {
            log.warn("Mail sender address is empty. Skipping email send to {}.", toEmail);
            return;
        }

        Email from = new Email(fromAddress, fromName);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email sent to {} via SendGrid — subject: {}", toEmail, subject);
            } else {
                log.error("SendGrid returned status {} for {}: {}",
                        response.getStatusCode(), toEmail, response.getBody());
            }
        } catch (IOException ex) {
            log.error("Failed to send email via SendGrid to {}: {}", toEmail, ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error sending email to {}: {}", toEmail, ex.getMessage(), ex);
        }
    }
}