import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { pgTable, serial, integer, text, varchar, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Tabella auto-referenziata a 2 livelli: le macro-aree hanno parentId null,
 * le sotto-aree puntano alla loro macro-area tramite parentId.
 * hook/shortDescription sono valorizzati solo per le macro-aree;
 * code/keywords solo per le sotto-aree (vedi areas.json).
 */
export const area = pgTable('area', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').references((): AnyPgColumn => area.id),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  hook: text('hook'),
  shortDescription: text('short_description'),
  code: varchar('code', { length: 20 }).unique(),
  keywords: text('keywords').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const areaRelations = relations(area, ({ one, many }) => ({
  parent: one(area, {
    fields: [area.parentId],
    references: [area.id],
    relationName: 'area_parent',
  }),
  children: many(area, { relationName: 'area_parent' }),
}))
