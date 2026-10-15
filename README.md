# JobTrack — Full-Stack Internship & Job Application Tracker

A production-grade, full-stack application built for software engineering students and job candidates to centralize, track, and optimize high-volume application cycles.

---

## 🚀 Key Features

1. **Visual Kanban Pipeline**:
   - Drag-and-drop hiring funnel: `Wishlist`, `Preparing`, `Applied`, `Assessment`, `Interview`, `Technical Interview`, `Final Interview`, `Offer`, `Accepted`, `Rejected`, `Withdrawn`.
   - Optimistic state transitions with immediate database synchronization and rollback on network failure.
   - Automatic generation of `ApplicationEvent` audit records upon stage changes.

2. **Application Directory & Deep Filtering**:
   - Multi-criteria filtering by company, role position, status, job type, work mode, and priority.
   - Sorting by newest added, oldest, upcoming deadline, and company alphabetical order.

3. **Application Details & Chronological Timeline**:
   - Individual application view showing full recruiter contact details, compensation, portal links, and linked resume versions.
   - Chronological timeline audit trail of every status transition and milestone.

4. **Structured Interview Preparation Hub**:
   - Dedicated prep modules attached to every application:
     - *Company Research* (products, architecture, leadership)
     - *Technical Topics* (data structures, system design, algorithms)
     - *STAR Behavioral Stories* (Situation, Task, Action, Result)
     - *Questions to Ask the Interviewer*
     - *Post-Interview Retrospective* (areas for improvement)

5. **Interview Scheduling & Logs**:
   - Categorized rounds: `HR`, `Technical`, `Behavioral`, `Managerial`, `Final`.
   - Date, time, duration, interviewer details, and direct video meeting launch links.
   - Debrief notes and outcome tracking (`Pending`, `Passed`, `Rejected`).

6. **Action Items & Checklist**:
   - Task management linked to specific applications or general preparation.
   - Inline completion toggling, priority tags (`Urgent`, `High`, `Medium`, `Low`), and due-date alerts.

7. **Companies Directory**:
   - Normalized company directory linking multiple applications to the same employer.
   - Stores headquarters location, size tier, industry, and private culture notes.

8. **Resume & Cover Letter Version Tracking**:
   - Registry for document versions (e.g. `Resume_SWE_v3.pdf`, `Backend_Tailored_v2.pdf`).
   - Associates specific versions with target applications so candidates always know which CV was submitted.

9. **Guarded Career Analytics**:
   - Mathematically guarded conversion metrics (with zero-division prevention):
     - **Response Rate**: Percentage of submitted applications receiving company interaction.
     - **Interview Conversion Rate**: Percentage of applications advancing to screening or technical rounds.
     - **Offer Rate**: Percentage of applications resulting in formal offers.
     - **Funnel Stage Breakdown**: Visual drop-off progression across hiring phases.
     - **Work Mode & Job Type Distribution**: Visual proportions of Remote vs. Hybrid vs. On-site.

10. **One-Click Realistic Seed Data**:
    - Pre-loads realistic software engineering internship applications (Stripe, Google, Datadog, Figma) with interview schedules, HackerRank OA tasks, and prep notes for instant evaluation.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js App Router API Routes (`/api/applications`, `/api/interviews`, `/api/companies`, `/api/tasks`, `/api/documents`, `/api/analytics`)
- **Database**: PostgreSQL (Google Cloud SQL)
- **ORM & Migrations**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `pg` connection pool)
- **Validation**: Zod (runtime request schema parsing and type safety)
- **Authentication**: Firebase Authentication (Google OAuth & token verification via `firebase-admin`) + isolated guest sessions
- **Testing**: Vitest (`src/lib/calculations.test.ts`)

---

## 🔒 Security Architecture

1. **Strict Multi-Tenant Isolation & IDOR Defense**:
   - Every single database read, update, or deletion query strictly verifies ownership:
     ```sql
     WHERE id = :id AND "userId" = :currentUserId
     ```
   - No user can access or alter another candidate's records by tampering with URL parameters.
2. **Input Validation**:
   - All incoming API request payloads pass through strict Zod `.safeParse()` schemas on the server before database execution.
3. **Connection Pooling**:
   - Configured using the Node.js `pg` Pool Object Method with idle client error handlers and on-demand connection establishment.
4. **Error Sanitization**:
   - Database connection strings and raw SQL error messages are never leaked in client HTTP responses.

---

## 🧪 Testing & Verification Commands

```bash
# Run unit tests (analytics math & schema validation)
npm run test

# Run ESLint validation
npm run lint

# Run TypeScript typecheck
npx tsc --noEmit

# Run production build
npm run build
```

---

## 💡 Topics to Highlight in Software Engineering Interviews

- **Relational Data Modeling**: How normalized relational tables (`companies`, `applications`, `interviews`, `tasks`, `prep_notes`, `documents`) maintain referential integrity via foreign key cascades.
- **Optimistic UI with Rollback**: Maintaining high perceived responsiveness on drag-and-drop Kanban transitions while safeguarding data consistency on failed API calls.
- **Defensive Mathematics**: Preventing `NaN%` or runtime crashes in analytical aggregation algorithms when users have zero submissions or interviews.
- **Server/Client Boundary Separation**: Keeping database pools, admin credentials, and schema operations strictly on the server while delivering fast, interactive client-side React components.
