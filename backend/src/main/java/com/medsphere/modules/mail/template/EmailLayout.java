package com.medsphere.modules.mail.template;

public final class EmailLayout {

    private EmailLayout() {}

    public static String wrap(String bodyContentHtml) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#F7F8FA;font-family:Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
                <tr><td align="center">
                  <table width="480" cellpadding="0" cellspacing="0"
                    style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                    <tr>
                      <td style="background:#1E3A5F;padding:26px 32px;text-align:center;">
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            <td style="padding-right:12px;vertical-align:middle;line-height:0;">
                              <table cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;">
                                <tr>
                                  <td style="padding:4px;line-height:0;">
                                    <img src="https://res.cloudinary.com/ghjksd3c/image/upload/f_auto,q_auto,c_thumb,g_auto,w_200,h_200/logo_enp7q0"
                                         alt="Medsphere" width="26" height="26"
                                         style="display:block;border:0;outline:none;" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td style="vertical-align:middle;line-height:1;">
                              <span style="color:#fff;font-size:21px;font-weight:800;letter-spacing:-0.02em;">Medsphere</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px;">
                        %s
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#F7F8FA;padding:16px 32px;text-align:center;">
                        <p style="margin:0;color:#9ca3af;font-size:11px;">© 2026 Medsphere. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(bodyContentHtml);
    }

    public static String button(String url, String label, String bgColor) {
        return """
            <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
              <tr>
                <td style="background:%s;border-radius:8px;">
                  <a href="%s" target="_blank"
                     style="display:inline-block;padding:12px 28px;color:#fff;text-decoration:none;
                            font-size:14px;font-weight:700;font-family:Arial,sans-serif;">
                    %s
                  </a>
                </td>
              </tr>
            </table>
            """.formatted(bgColor, url, label);
    }
}