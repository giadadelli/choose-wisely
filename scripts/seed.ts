import { readFileSync } from 'node:fs'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import * as schema from '../server/db/schema'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

interface SottoArea {
  codice: string
  slug: string
  nome: string
  keywords: string[]
}

interface MacroArea {
  slug: string
  nome: string
  hook: string
  descrizione_breve: string
  sotto_aree: SottoArea[]
}

interface AreasFile {
  macro_aree: MacroArea[]
}

async function seedAreas() {
  const raw = readFileSync(new URL('../areas.json', import.meta.url), 'utf-8')
  const data: AreasFile = JSON.parse(raw)

  for (const macro of data.macro_aree) {
    const [macroRow] = await db
      .insert(schema.area)
      .values({
        slug: macro.slug,
        name: macro.nome,
        hook: macro.hook,
        shortDescription: macro.descrizione_breve,
      })
      .onConflictDoUpdate({
        target: schema.area.slug,
        set: {
          name: macro.nome,
          hook: macro.hook,
          shortDescription: macro.descrizione_breve,
        },
      })
      .returning({ id: schema.area.id })

    for (const sotto of macro.sotto_aree) {
      await db
        .insert(schema.area)
        .values({
          parentId: macroRow.id,
          slug: sotto.slug,
          name: sotto.nome,
          code: sotto.codice,
          keywords: sotto.keywords,
        })
        .onConflictDoUpdate({
          target: schema.area.slug,
          set: {
            parentId: macroRow.id,
            name: sotto.nome,
            code: sotto.codice,
            keywords: sotto.keywords,
          },
        })
    }
  }

  console.log('Aree popolate: 3 macro-aree, 28 sotto-aree.')
}

async function seedProfessionals() {
  const examples = [
    {
      slug: 'esempio-founder',
      name: 'Professionista di Esempio (Founder)',
      bio: 'Profilo di esempio inserito dallo script di seed, per verificare il rendering delle pagine prima del popolamento reale (SCRUM-57).',
      isFounder: true,
      published: true,
      areaSlugs: ['ciclo-doloroso-irregolare', 'stress-burnout'],
    },
    {
      slug: 'esempio-standard',
      name: 'Professionista di Esempio (Standard)',
      bio: 'Profilo di esempio inserito dallo script di seed.',
      isFounder: false,
      published: true,
      areaSlugs: ['carico-mentale-familiare'],
    },
  ]

  for (const example of examples) {
    const [professionalRow] = await db
      .insert(schema.professional)
      .values({
        slug: example.slug,
        name: example.name,
        bio: example.bio,
        isFounder: example.isFounder,
        published: example.published,
      })
      .onConflictDoUpdate({
        target: schema.professional.slug,
        set: {
          name: example.name,
          bio: example.bio,
          isFounder: example.isFounder,
          published: example.published,
        },
      })
      .returning({ id: schema.professional.id })

    for (const areaSlug of example.areaSlugs) {
      const [areaRow] = await db
        .select({ id: schema.area.id })
        .from(schema.area)
        .where(eq(schema.area.slug, areaSlug))

      if (!areaRow) continue

      await db
        .insert(schema.professionalArea)
        .values({ professionalId: professionalRow.id, areaId: areaRow.id })
        .onConflictDoNothing()
    }
  }

  console.log(`Professionisti di esempio popolati: ${examples.length}.`)
}

async function main() {
  await seedAreas()
  await seedProfessionals()
}

main()
  .then(() => {
    console.log('Seed completato.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Errore durante il seed:', error)
    process.exit(1)
  })
