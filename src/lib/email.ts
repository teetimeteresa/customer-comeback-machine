import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Customer Comeback Machine <noreply@example.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export function generateUnsubscribeUrl(email: string, businessId: string): string {
  const encoded = Buffer.from(`${email}:${businessId}`).toString('base64');
  return `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${encoded}`;
}

export function generateEmailFooter(businessName: string, mailingAddress: string): string {
  return `
    <p style="font-size: 12px; color: #666; margin-top: 20px;">
      You are receiving this email because you opted in to receive communications from ${businessName}.
      <br/>
      ${businessName} | ${mailingAddress}
      <br/><br/>
      <a href="{unsubscribe_url}" style="color: #666;">Unsubscribe</a> | 
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #666;">View in browser</a>
    </p>
  `;
}