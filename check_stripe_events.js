const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkEvents() {
  try {
    const events = await stripe.events.list({
      type: 'checkout.session.completed',
      limit: 5
    });
    console.log('--- STRIPE EVENTS (checkout.session.completed) ---');
    events.data.forEach(e => {
      console.log(`ID: ${e.id} | Created: ${new Date(e.created * 1000).toISOString()}`);
    });
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('Error listing events:', err.message);
  }
}

checkEvents();
