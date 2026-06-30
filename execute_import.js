const fs = require('fs');
const { execSync } = require('child_process');

const sqlFile = '/home/team/shared/import_outreach.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Split by semicolon, but be careful with semicolons inside strings
// For this specific file, splitting by ');' followed by newline or EOF is safer for inserts
// But let's try a simpler split and see
const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => {
        // Remove comments for the check
        const clean = s.replace(/--.*$/gm, '').trim();
        return clean.length > 0;
    });

console.log(`Executing ${statements.length} statements...`);

for (const statement of statements) {
    try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const result = execSync(`team-db "${statement.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
        console.log(`Result: ${result.trim()}`);
    } catch (error) {
        console.error(`Error executing statement: ${error.message}`);
    }
}
