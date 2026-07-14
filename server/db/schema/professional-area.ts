import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { professional } from './professional'
import { area } from './area'

/**
 * Relazione molti-a-molti Professionista <-> Area (specializzazioni).
 * Nessun vincolo DB che area_id sia per forza una sotto-area (non macro):
 * enforcement lasciato a disciplina in fase di inserimento, coerente con A2/A3.
 */
export const professionalArea = pgTable('professional_area', {
  professionalId: integer('professional_id').notNull().references(() => professional.id),
  areaId: integer('area_id').notNull().references(() => area.id),
}, table => ({
  pk: primaryKey({ columns: [table.professionalId, table.areaId] }),
}))

export const professionalAreaRelations = relations(professionalArea, ({ one }) => ({
  professional: one(professional, {
    fields: [professionalArea.professionalId],
    references: [professional.id],
  }),
  area: one(area, {
    fields: [professionalArea.areaId],
    references: [area.id],
  }),
}))
