import { turso } from './turso';
import { InStatement } from '@libsql/client';

/**
 * Executes a SQL query against the team database using the Turso SDK.
 * Supports both string queries and parameterized statements.
 */
export async function teamDb<T = any>(statement: InStatement): Promise<T[]> {
  try {
    const result = await turso.execute(statement);
    
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
    // Don't swallow the error, let the caller handle it
    throw error;
  }
}
