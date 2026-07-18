import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { config } from 'dotenv'
import * as schema from '../db/schema'

// `nuxt dev` carica solo `.env`, non `.env.local` (convenzione già usata da
// drizzle.config.ts e scripts/seed.ts). In produzione le variabili sono già
// nell'ambiente: dotenv non sovrascrive quelle esistenti.
config({ path: '.env.local' })

// Su Vercel l'integrazione Neon inietta la variabile con un prefisso
// (`choosewiselydb_DATABASE_URL`), non rinominabile dal progetto: fallback
// necessario perché in locale/CI resta invece il nome piano `DATABASE_URL`.
const sql = neon(process.env.DATABASE_URL ?? process.env.choosewiselydb_DATABASE_URL!)

export const db = drizzle(sql, { schema })
