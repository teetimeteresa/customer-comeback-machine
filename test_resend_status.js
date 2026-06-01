
const RESEND_API_KEY = 'process.env.RESEND_API_KEY';
const EMAIL_FROM = 'Customer Comeback Team <onboarding@resend.dev>';
const TO_EMAIL = 'teetimeteresa@gmail.com';

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
        if (data.id) {
            console.log(`Email sent successfully: ${data.id}`);
            return true;
        } else {
            console.error(`Failed to send email:`, data);
            return false;
        }
    } catch (error) {
        console.error(`Error sending email:`, error);
        return false;
    }
}

sendEmail({
    to: TO_EMAIL,
    subject: "Test Outreach Engine Status",
    html: "<h1>Outreach Engine Test</h1><p>Testing if the Resend API is still in restricted mode or if we can send emails now.</p>"
});
