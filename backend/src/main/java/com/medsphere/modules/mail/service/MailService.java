package com.medsphere.modules.mail.service;

/** Generic mail sending — không phụ thuộc vào loại nội dung cụ thể. */
public interface MailService {
    void sendHtml(String toEmail, String subject, String htmlBody);
}