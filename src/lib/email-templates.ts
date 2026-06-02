/**
 * Premium Amber/Slate themed email template wrapper
 */
export function wrapPremiumTemplate(content: string, title?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'Customer Comeback Machine'}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1e293b; padding: 30px; text-align: center;">
                  <h1 style="color: #f59e0b; margin: 0; font-size: 24px; letter-spacing: -0.025em; font-weight: 800;">
                    CUSTOMER COMEBACK MACHINE
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px; line-height: 1.6; font-size: 16px;">
                  ${content}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0;">
                    &copy; ${new Date().getFullYear()} Customer Comeback Machine. All rights reserved.
                  </p>
                  <p style="margin: 0;">
                    Building loyalty, one follow-up at a time.
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="{unsubscribe_url}" style="color: #1e293b; text-decoration: underline;">Unsubscribe</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
