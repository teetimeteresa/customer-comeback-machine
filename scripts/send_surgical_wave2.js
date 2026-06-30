const { Resend } = require('resend');
const fs = require('fs');

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_7P1PZ7oA_L9Q7Xv7P1PZ7oA_L9Q7Xv7P'; // Fallback if not in env

async function sendEmail({ to, subject, html }) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const response = await resend.emails.send({
            from: 'CCM <noreply@customercomebackmachine.com>',
            to: [to],
            subject: subject,
            html: html
        });
        return { success: true, id: response.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function wrapPremiumTemplate(content, title) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title || 'Customer Comeback Machine'}</title></head><body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc; color: #1e293b;"><div style="padding: 40px; max-width: 600px; margin: auto;">${content}</div><div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8;">&copy; 2026 Customer Comeback Machine. <a href="https://customercomebackmachine.com/unsubscribe" style="color: #94a3b8;">Unsubscribe</a></div></body></html>`;
}

const leads = [
    {
        name: "Maid in Miami",
        email: "contact@maidinmiami.com",
        city: "Miami",
        content: `Hey Maid in Miami Team! 👋 I was looking at cleaning services in Miami and your place caught my eye — you guys clearly put heart into making homes sparkle.<br><br>But I noticed something: even with great work, customers drift. They book once, love it, and then life gets loud. We call it the "Connection Gap."<br><br>We help local businesses like yours automate warm check-ins that bring those one-time customers back home. Think of it as a "Warm Hug" for your cleaning clients — gentle nudges that make them feel remembered.<br><br>We're looking for 10 Founding Members — $497 setup waived, $49/mo locked forever. Want me to send a quick walkthrough?`
    },
    {
        name: "Dade Auto Repair",
        email: "contact@dadeautorepair.com",
        city: "Miami",
        content: `Hey Dade Auto Repair Team! 👋 I was checking out auto shops in Dade and I love the work you guys do. Real craftsmanship.<br><br>Here's the thing I see with auto shops: you do amazing work on a car, the customer drives away happy, and then they forget to come back for that 3,000-mile check-in. They end up somewhere else — not because they didn't love you, but because nobody reminded them.<br><br>We built something called the "Connection Guard" that sends warm, automated check-ins to your customers. It keeps your shop top-of-mind so they always come back home.<br><br>Founding Member spots open — $497 waived, $49/mo lifetime. Want a quick look?`
    },
    {
        name: "Broward Auto Care",
        email: "contact@browardautocare.com",
        city: "Fort Lauderdale",
        content: `Hey Broward Auto Care Team! 👋 Your shop in Broward caught my eye — real quality work.<br><br>I noticed something I see in a lot of great auto shops: customers come in, you fix them up, they're thrilled... and then they drift. Not because they didn't love your work, but because nobody gently reminded them it's time for their next service.<br><br>We call that the "Connection Gap." We help shops like yours close it with automated, warm follow-ups that bring customers back when they need you most. No extra work for your team.<br><br>We're launching our Founding Member program — $497 setup waived, $49/mo locked. Want to see it?`
    },
    {
        name: "South Lamar Cleaners",
        email: "contact@southlamarcleaners.com",
        city: "Austin",
        content: `Hey South Lamar Cleaners Team! 👋 I was looking at cleaners in Austin and your spot on South Lamar stood out.<br><br>Here's something I think about a lot: a customer brings in their favorite jacket, you make it look brand new, they're thrilled... and then 3 months later they're taking their dry cleaning somewhere else because it's closer. Not because they didn't love you — just because life got loud.<br><br>We help local cleaners close that "Connection Gap" with automated nudges that keep customers coming back. It takes 10 minutes to set up.<br><br>Founding Member: $497 waived, $49/mo forever. 14-day free trial. Want to try it?`
    },
    {
        name: "Ultimate Fade Studio",
        email: "contact@ultimatefadestudio.com",
        city: "Miami",
        content: `Hey Ultimate Fade Studio Team! 👋 Your fade work is fire 🔥 I was checking out barbershops and your studio clearly has serious skill.<br><br>But here's the thing: even the best barber loses customers to the drift. A guy gets a perfect fade, loves it, but then 4 weeks later he's in a rush and goes somewhere closer. Not because he didn't love your work — just because nobody reminded him it's time.<br><br>We help shops like yours automate warm check-ins that bring clients back when they're due for a cut. "The Connection Guard" keeps your chair full.<br><br>Founding Member: $497 waived, $49/mo locked. Want a quick 2-min walkthrough?`
    }
];

async function run() {
    for (const lead of leads) {
        const subject = `Giving your favorite regulars at ${lead.name} a reason to come home`;
        const html = wrapPremiumTemplate(lead.content, subject);
        console.log(`Sending to ${lead.name} (${lead.email})...`);
        const result = await sendEmail({ to: lead.email, subject, html });
        if (result.success) {
            console.log(`✅ Sent! ID: ${result.id}`);
        } else {
            console.error(`❌ Failed: ${result.error}`);
        }
    }
}

run();
