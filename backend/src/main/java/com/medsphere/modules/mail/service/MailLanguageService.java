package com.medsphere.modules.mail.service;

/** Xác định ngôn ngữ email dựa trên IP người nhận request — tái dùng logic geo chung. */
public interface MailLanguageService {
    String resolveLanguageFromIp(String clientIp);
}