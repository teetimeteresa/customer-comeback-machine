const { execSync } = require('child_process');

/**
 * Executes multiple SQL queries in a single transaction/session to reduce sync overhead.
 * @param {string[]} queries - Array of SQL queries to execute.
 */
function batchDb(queries) {
    if (queries.length === 0) return;
    
    // Combine into a single transaction
    const transaction = [
        'BEGIN TRANSACTION;',
        ...queries.map(q => q.endsWith(';') ? q : q + ';'),
        'COMMIT;'
    ].join('\n');
    
    let attempts = 0;
    while (attempts < 5) {
        try {
            // We use team-db on the full transaction block
            // Note: team-db executes a single statement normally, but it can handle multiple if separated by ;
            // and wrapped correctly for the shell.
            const output = execSync(`team-db "${transaction.replace(/"/g, '\\"')}"`, { stdio: ['inherit', 'pipe', 'pipe'] }).toString();
            try {
                return JSON.parse(output);
            } catch (e) {
                return output;
            }
        } catch (err) {
            attempts++;
            if (err.stderr && (err.stderr.toString().includes("Locking error") || err.stderr.toString().includes("GenericFailure"))) {
                console.log(`Database busy/locked, retrying batch attempt ${attempts}...`);
                execSync(`sleep ${attempts * 2}`); // Exponential backoff
                continue;
            }
            console.error("Batch DB Error:", err.stderr ? err.stderr.toString() : err.message);
            throw err;
        }
    }
}

module.exports = { batchDb };
