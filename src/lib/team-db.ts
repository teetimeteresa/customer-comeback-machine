import { turso } from './turso';

/**
 * Executes a SQL query against the team database using the Turso SDK.
 */
export async function teamDb<T = any>(query: string): Promise<T[]> {
  try {
    const result = await turso.execute(query);
    // Convert Rows to plain objects
    return result.rows.map(row => {
      const obj: any = {};
      result.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj as T;
    });
  } catch (error) {
    console.error('team-db error:', error);
    throw error;
  }
}
