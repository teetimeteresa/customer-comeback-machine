/**
 * Happiness Pulse API — GET /api/email/happiness-pulse?key=CRON_API_KEY
 * 
 * Runs daily via cron job.
 * Finds businesses that:
 *   - Have an active subscription that's 30+ days old
 *   - Haven't received the happiness pulse yet
 * Sends a personalized 30-day check-in email and marks them as sent.
 */

import { NextRequest, NextResponse } from 'next/server';
import { teamDb, generateId, timestamp } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { wrapPremiumTemplate } from '@/lib/email-templates';
import { auth } from '@/lib/auth';

const HAPPINESS_PULSE_SUBJECT = "30 days of comebacks! How are you feeling? ❤️";

function generateHappinessPulseHtml(
    ownerName: string,
    businessName: string,
    totalCustomers: number,
    newThisMonth: number,
    unsubscribeUrl: string
): string {
    const content = `
        <h2 style="color: #1e293b; margin-top: 0;">Hi ${ownerName},</h2>
        <p>It's been 30 days since you joined the Customer Comeback Machine family. I wanted to personally check in and see how you're feeling.</p>
        <p>I took a peek at your dashboard — and WOW. You've already re-connected with <strong>${totalCustomers} neighbors</strong> since you started! That's <strong>${newThisMonth} more people</strong> who walked into your shop and felt remembered, appreciated, and invited back.</p>
        <p>That's not just metrics. That's the heartbeat of your business growing stronger.</p>
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">Quick questions for you:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #78350f;">
                <li>How's your QR code working? Are customers scanning it?</li>
                <li>Have you noticed any difference in repeat visits?</li>
                <li>Is there anything we can improve or add?</li>
            </ol>
        </div>
        <p>Just hit reply — I read every message personally. No bots, no templates, just me.</p>
        <h3 style="color: #1e293b;">One thing to try this week:</h3>
        <p>If you haven't already, move your QR code to a spot where customers naturally wait (checkout counter, seating area, or front door). We've seen businesses double their opt-in rate just by moving the sign 3 feet.</p>
        <p>Thank you for trusting us with your community. We don't take that lightly.</p>
        <p>With warmth,</p>
        <p><strong>Your Customer Success Team</strong><br/>
        Customer Comeback Machine</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                🎉 <strong>P.S. — When you hit 50 customers captured, I have a little surprise for you. Keep going!</strong>
            </p>
        </div>
    `;

    return wrapPremiumTemplate(content, HAPPINESS_PULSE_SUBJECT).replace(/{unsubscribe_url}/g, unsubscribeUrl);
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const apiKey = searchParams.get('key');

        // Simple API key authentication for cron
        if (apiKey !== (process.env.CRON_API_KEY || 'dev-key')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Find active subscriptions that are 30+ days old and haven't received happiness pulse
        const subscriptions = await teamDb(`
            SELECT 
                s.id as sub_id,
                s.business_id,
                s.plan,
                s.status,
                s.created_at as sub_created_at,
                b.id as business_id,
                b.name as business_name,
                b.owner_id,
                b.mailing_address,
                u.name as owner_name,
                u.email as owner_email
            FROM subscriptions s
            JOIN businesses b ON b.id = s.business_id
            JOIN users u ON u.id = b.owner_id
            WHERE s.status = 'active'
            AND s.happiness_pulse_sent = 0
            AND s.created_at <= ?
        `, [thirtyDaysAgo.toISOString()]);

        console.log(`[Happiness Pulse] Found ${subscriptions?.length || 0} eligible businesses`);

        let processed = 0;
        let sent = 0;
        let errors = 0;

        for (const sub of (subscriptions || [])) {
            try {
                // Count total customers for this business
                const customerCountResult = await teamDb({
                    sql: 'SELECT COUNT(*) as total, SUM(CASE WHEN created_at > ? THEN 1 ELSE 0 END) as new_this_month FROM customers WHERE business_id = ?',
                    args: [thirtyDaysAgo.toISOString(), sub.business_id]
                });

                const totalCustomers = customerCountResult?.[0]?.total || 0;
                const newThisMonth = customerCountResult?.[0]?.new_this_month || 0;

                // Generate unsubscribe URL (using owner's email for the business owner email)
                const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?token=${Buffer.from(`${sub.owner_email}:${sub.business_id}`).toString('base64')}`;

                // Generate email HTML
                const emailHtml = generateHappinessPulseHtml(
                    sub.owner_name || 'there',
                    sub.business_name || 'your business',
                    totalCustomers,
                    newThisMonth,
                    unsubscribeUrl
                );

                // Send the email
                const emailResult = await sendEmail({
                    to: sub.owner_email,
                    subject: HAPPINESS_PULSE_SUBJECT,
                    html: emailHtml,
                });

                // Log the email in the emails table
                const emailId = generateId();
                const nowTs = timestamp();
                await teamDb({
                    sql: `INSERT INTO emails (id, business_id, customer_id, type, subject, body, status, sent_at, created_at)
                          VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?)`,
                    args: [emailId, sub.business_id, 'OWNER', 'happiness_pulse', HAPPINESS_PULSE_SUBJECT, emailHtml, nowTs, nowTs]
                });

                // Mark happiness pulse as sent
                await teamDb({
                    sql: `UPDATE subscriptions SET happiness_pulse_sent = 1, happiness_pulse_date = ? WHERE id = ?`,
                    args: [nowTs, sub.sub_id]
                });

                console.log(`[Happiness Pulse] ✅ Sent to ${sub.business_name} (${sub.owner_email}) — ${totalCustomers} customers`);
                sent++;
            } catch (err) {
                console.error(`[Happiness Pulse] ❌ Error for ${sub.business_name}:`, err);
                errors++;
            }
            processed++;
        }

        return NextResponse.json({
            success: true,
            processed,
            sent,
            errors,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error('[Happiness Pulse] Fatal error:', error);
        return NextResponse.json({ error: 'Failed to process happiness pulse' }, { status: 500 });
    }
}
