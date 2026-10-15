import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table keyed by uid (Firebase UID or unique auth identifier)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  location: text('location'),
  university: text('university'),
  graduationYear: integer('graduation_year'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  portfolioUrl: text('portfolio_url'),
  skills: text('skills'), // Stored as comma-separated or JSON string
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Companies scoped per user
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  website: text('website'),
  industry: text('industry'),
  location: text('location'),
  size: text('size'),
  description: text('description'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Core Applications
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  position: text('position').notNull(),
  jobType: text('job_type').default('Internship').notNull(),
  workMode: text('work_mode').default('Remote').notNull(),
  location: text('location'),
  status: text('status').default('Wishlist').notNull(),
  priority: text('priority').default('Medium').notNull(),
  salary: text('salary'),
  jobUrl: text('job_url'),
  portalUrl: text('portal_url'),
  applicationDate: text('application_date'),
  deadline: text('deadline'),
  recruiterName: text('recruiter_name'),
  recruiterEmail: text('recruiter_email'),
  recruiterPhone: text('recruiter_phone'),
  notes: text('notes'),
  resumeVersion: text('resume_version'),
  coverLetterVersion: text('cover_letter_version'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Application Timeline Events
export const applicationEvents = pgTable('application_events', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  eventType: text('event_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  previousStatus: text('previous_status'),
  newStatus: text('new_status'),
  eventDate: timestamp('event_date').defaultNow(),
});

// Interviews
export const interviews = pgTable('interviews', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  round: text('round').notNull(),
  title: text('title').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').default(45).notNull(),
  interviewers: text('interviewers'),
  meetingUrl: text('meeting_url'),
  location: text('location'),
  notes: text('notes'),
  feedback: text('feedback'),
  result: text('result').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tasks & Reminders
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  applicationId: integer('application_id').references(() => applications.id, {
    onDelete: 'cascade',
  }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: text('due_date'),
  priority: text('priority').default('Medium').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Interview Preparation Notes per Application (1:1)
export const prepNotes = pgTable('prep_notes', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .unique()
    .references(() => applications.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  companyResearch: text('company_research'),
  technicalTopics: text('technical_topics'),
  starStories: text('star_stories'),
  questionsToAsk: text('questions_to_ask'),
  areasToImprove: text('areas_to_improve'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Document registry (Resumes & Cover Letters)
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(), // 'RESUME' | 'COVER_LETTER'
  title: text('title').notNull(),
  version: text('version').default('v1').notNull(),
  filePath: text('file_path'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  applications: many(applications),
  tasks: many(tasks),
  documents: many(documents),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  events: many(applicationEvents),
  interviews: many(interviews),
  tasks: many(tasks),
  prepNotes: one(prepNotes, {
    fields: [applications.id],
    references: [prepNotes.applicationId],
  }),
}));

export const applicationEventsRelations = relations(applicationEvents, ({ one }) => ({
  application: one(applications, {
    fields: [applicationEvents.applicationId],
    references: [applications.id],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  application: one(applications, {
    fields: [tasks.applicationId],
    references: [applications.id],
  }),
}));
