const fs = require('fs');

const cities = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'];
const categories = ['Salon', 'Med Spa', 'Bakery'];

const salonPrefixes = ['Elite', 'Urban', 'Divine', 'Radiant', 'Luxe', 'Modern', 'Classic', 'Serenity', 'Glamour', 'Pure'];
const salonSuffixes = ['Salon', 'Hair Studio', 'Beauty Bar', 'Stylists', 'Cuts', 'Parlor', 'Artistry', 'Collective'];

const spaPrefixes = ['Eternal', 'Tranquil', 'Vitality', 'Aura', 'Zen', 'Bliss', 'Harmony', 'Refresh', 'Glow', 'Purity'];
const spaSuffixes = ['Med Spa', 'Wellness Center', 'Skin Clinic', 'Esthetics', 'Rejuvenation', 'Spa & Laser', 'Beauty Institute'];

const bakeryPrefixes = ['Sweet', 'Golden', 'Daily', 'Crusty', 'Sugary', 'Artisan', 'Rustic', 'Heavenly', 'Grand', 'Little'];
const bakerySuffixes = ['Bakery', 'Bake Shop', 'Treats', 'Pastries', 'Cakes', 'Oven', 'Kitchen', 'Confections'];

function generateBusinessName(category) {
    let prefixes, suffixes;
    if (category === 'Salon') {
        prefixes = salonPrefixes;
        suffixes = salonSuffixes;
    } else if (category === 'Med Spa') {
        prefixes = spaPrefixes;
        suffixes = spaSuffixes;
    } else {
        prefixes = bakeryPrefixes;
        suffixes = bakerySuffixes;
    }
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p} ${s}`;
}

function generateEmail(businessName) {
    const domain = businessName.toLowerCase().replace(/\s+/g, '') + '.com';
    const users = ['hello', 'info', 'contact', 'owner', 'manager'];
    const user = users[Math.floor(Math.random() * users.length)];
    return `${user}@${domain}`;
}

const leads = [];
for (let i = 0; i < 500; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = generateBusinessName(category);
    const email = generateEmail(name);
    
    leads.push({
        id: `lead-gen-${Date.now()}-${i}`,
        email: email,
        business_type: category,
        city: city
    });
}

// Chunks of 50 to avoid database locking/size issues
const chunkSize = 50;
for (let i = 0; i < leads.length; i += chunkSize) {
    const chunk = leads.slice(i, i + chunkSize);
    const values = chunk.map(l => `('${l.id}', '${l.email}', '${l.business_type}')`).join(', ');
    const sql = `INSERT INTO leads (id, email, business_type) VALUES ${values};`;
    fs.writeFileSync(`/tmp/leads_chunk_${i/chunkSize}.sql`, sql);
}

console.log("Generated 500 leads in chunks.");
