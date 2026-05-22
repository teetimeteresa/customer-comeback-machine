import { createClient } from '@libsql/client';

function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    // Return a mock client for build time when credentials aren't available
    console.warn('TURSO_DATABASE_URL not defined - database operations will be disabled');
    return null;
  }

  return createClient({
    url: url,
    authToken: authToken,
  });
}

// Export a lazy accessor so we don't throw at module load time
let _turso: ReturnType<typeof createClient> | null = null;

export const turso = {
  get client() {
    if (!_turso) {
      _turso = getTursoClient();
    }
    return _turso;
  },
  async execute(sql: string) {
    if (!this.client) {
      console.warn('Database client not initialized - skipping query');
      return { rows: [], columns: [] };
    }
    return this.client.execute(sql);
  }
};