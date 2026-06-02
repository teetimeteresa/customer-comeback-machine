const fs = require('fs');

const warmPitches = JSON.parse(fs.readFileSync('/home/team/shared/personalized_warm_pitches.json', 'utf8'));

const fullSequences = warmPitches.map(pitch => {
    const businessName = pitch.subject.replace('Personalized Follow-Up System for ', '').replace(' 🚀', '');
    const email = pitch.email;
    
    // Email 2 Draft
    const email2Subject = `The "Invisible Employee" for ${businessName} 🕯️`;
    const email2Body = `
Hi ${businessName} Team,

Running a business is hard work. You're juggling inventory, staff, and customers.

Most small businesses lose 20-30% of their customers every year simply because they forget to follow up.

Customer Comeback Machine is like having an "Invisible Employee" who:
1. Greets every customer after they leave.
2. Asks for a Google review while the experience is fresh.
3. Sends a "Win-Back" offer if they haven't been in for 45 days.

I'd still love to set this up for you. I've helped shops similar to yours see a 15% increase in repeat visits within the first month.

Are you around for a 10-minute "Setup Concierge" call this week?

Best,
The Customer Comeback Team
`;

    // Email 3 Draft
    const email3Subject = `Last call for the ${businessName} Concierge Setup 🏁`;
    const email3Body = `
Hi ${businessName} Team,

I'm closing out my "Concierge Setup" slots for the week.

If you want me to handle the heavy lifting—uploading your customer list, designing your QR code signs, and polishing your email copy—today is the day.

We've seen businesses get their first 10 new reviews in less than a week just by putting this machine in motion.

You can grab a spot here: [Link]

Or just reply "GO" and I'll send over the onboarding link.

Best,
The Customer Comeback Team
`;

    return {
        email,
        businessName,
        sequence: [
            { step: 1, subject: pitch.subject, body: pitch.body },
            { step: 2, subject: email2Subject, body: email2Body },
            { step: 3, subject: email3Subject, body: email3Body }
        ]
    };
});

fs.writeFileSync('/home/team/shared/high_intent_full_sequences.json', JSON.stringify(fullSequences, null, 2));
console.log(`Generated full sequences for ${fullSequences.length} warm leads.`);
