import { pgTable, serial, varchar, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core'

export interface SocialLink {
  platform: string
  url: string
}

export const professional = pgTable('professional', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  websiteUrl: text('website_url'),
  socialLinks: jsonb('social_links').$type<SocialLink[]>(),
  isFounder: boolean('is_founder').notNull().default(false),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
