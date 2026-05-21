import { execSync } from 'child_process';

/**
 * Executes a SQL query against the team database using the team-db CLI.
 */
export async function teamDb<T = any>(query: string): Promise<T[]> {
  try {
    const output = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return JSON.parse(output);
  } catch (error) {
    console.error('team-db error:', error);
    throw error;
  }
}
