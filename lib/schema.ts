import { mysqlTable, varchar, timestamp, text, serial, bigint } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

//테이블 정의
export const rollingPaper = mysqlTable('rolling_paper', {
  rollingPaperId: serial('rolling_paper_id').primaryKey(),
  title: varchar('title', { length: 20 }),
  password: varchar('password', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const letter = mysqlTable('letter', {
  letterId: serial('letter_id').primaryKey(),
  rollingPaperId: bigint('rolling_paper_id', { mode: 'number' }).notNull(),
  nickname: varchar('nickname', { length: 20 }),
  content: text('content'),
  color: varchar('color', { length: 20 }),
  imgUrl: varchar('img_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const banner = mysqlTable('banner', {
  rollingPaperId: bigint('rolling_paper_id', { mode: 'number' }).primaryKey(),
  imageUrl: varchar('image_url', { length: 500 }),
  comment: varchar('comment', { length: 500 }),
});

//연관관계 정의
export const rollingPaperRelations = relations(rollingPaper, ({ many, one }) => ({
  letter: many(letter),
  banner: one(banner, {
    fields: [rollingPaper.rollingPaperId],
    references: [banner.rollingPaperId],
  }),
}));

export const letterRelations = relations(letter, ({ one }) => ({
  rollingPaper: one(rollingPaper, {
    fields: [letter.rollingPaperId],
    references: [rollingPaper.rollingPaperId],
  }),
}));

export const bannerRelations = relations(banner, ({ one }) => ({
  rollingPaper: one(rollingPaper, {
    fields: [banner.rollingPaperId],
    references: [rollingPaper.rollingPaperId],
  }),
}));