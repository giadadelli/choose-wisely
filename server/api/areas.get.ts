import { asc } from 'drizzle-orm'
import { area } from '../db/schema'
import { db } from '../utils/db'

/**
 * Endpoint condiviso homepage (SCRUM-20/21/22): un solo giro DB per macro-aree
 * e sotto-aree, così la homepage non deve fare più fetch separati.
 */
export default defineEventHandler(async () => {
  const rows = await db
    .select({
      id: area.id,
      parentId: area.parentId,
      slug: area.slug,
      name: area.name,
      shortDescription: area.shortDescription,
      keywords: area.keywords,
    })
    .from(area)
    .orderBy(asc(area.id))

  const macroAreas = rows
    .filter(row => row.parentId === null)
    .map(({ id, slug, name, shortDescription }) => ({ id, slug, name, shortDescription }))

  const subAreas = rows
    .filter(row => row.parentId !== null)
    .map(({ id, slug, name, keywords }) => ({ id, slug, name, keywords: keywords ?? [] }))

  return { macroAreas, subAreas }
})
