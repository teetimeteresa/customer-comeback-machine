
const RESEND_API_KEY = 'process.env.RESEND_API_KEY';

async function checkDomains() {
    console.log(`Checking Resend domains...`);
    try {
        const response = await fetch('https://api.resend.com/domains', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`
            }
        });
        const data = await response.json();
        console.log('Resend Domains:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error checking domains:`, error);
    }
}

checkDomains();
