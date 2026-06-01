
const RESEND_API_KEY = 'process.env.RESEND_API_KEY';
const EMAIL_FROM = 'Customer Comeback Team <onboarding@resend.dev>';
const TO_EMAIL = 'test@example.com';

async function sendEmail({ to, subject, html }) {
    console.log(`Sending test email to ${to}: ${subject}`);
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to,
                subject,
                html
            })
        });
        const data = await response.json();
        console.log('Resend Response:', data);
    } catch (error) {
        console.error(`Error sending email:`, error);
    }
}

sendEmail({
    to: TO_EMAIL,
    subject: "Test Outreach Restricted Mode",
    html: "<p>Testing if restriction is still in place.</p>"
});
