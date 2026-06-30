# Personality-Driven Automation Framework: "From System to Soul"

## The Philosophy
Automation often feels cold and robotic. Our goal is to transform "System Alerts" into "Neighborly Check-ins." We don't want customers to feel like they are being processed; we want them to feel like they are being remembered.

---

## The Three Pillars of Human-to-Human (H2H) Automation

### 1. The Face Factor (Trust)
Whenever possible, the automation should be tied to a human face—the owner or a lead manager. 
- **Action:** Encourage owners to upload a friendly headshot.
- **Implementation:** Include the headshot in the email signature of all automated messages.

### 2. The Voice Factor (Neighborly Language)
We use "I/Me" language instead of "We/Us" or "The Team." 
- **System Voice:** "Your appointment is confirmed."
- **Soul Voice:** "I've got you down for Tuesday! Can't wait to see you."

### 3. The Story Factor (Connection)
We weave the owner's "Why" into the messages. 
- **Action:** Use the answers from "The Storyteller Approach" (in onboarding) to populate the first welcome email.

---

## The Two Automation Modes

### Option A: The Human Voice (Personal & Warm)
*Best for: Boutiques, Salons, Solopreneurs.*
- Uses the owner's name and "I" statements.
- Focuses on personal connection and "thought of you" moments.
- **Signature:** "Warmly, {Owner Name}"

### Option B: The Brand Voice (Professional & Team)
*Best for: Larger practices, Dental offices, Med Spas with multiple providers.*
- Uses "We" and "Our Team."
- Focuses on "The {Business Name} Family."
- **Signature:** "The {Business Name} Team"

---

## The H2H Template Standards

| Stage | Tone Goal | Key Phrase |
|-------|-----------|------------|
| Post-Visit | Gratitude | "It made my day to see you..." |
| Review Request | Personal Favor | "Would you mind doing me a small favor?" |
| Win-Back | Thought of You | "I was just thinking about you today..." |
| Birthday | Celebration | "We're so glad you were born!" |
| Referral | Community | "Friends of yours are friends of ours." |

---

## Implementation Checklist
- [ ] Add `voice_mode` to `businesses` table.
- [ ] Add Voice Selection toggle to Onboarding Step 3.
- [ ] Update email templates to use conditional logic based on `voice_mode`.
- [ ] Ensure "The Storyteller Approach" answers are saved and injected into the Welcome sequence.
