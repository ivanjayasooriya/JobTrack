import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import {
  applications,
  companies,
  applicationEvents,
  interviews,
  tasks,
  prepNotes,
  documents,
} from '@/src/db/schema.ts';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has applications
    const existing = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.userId, authUser.uid))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        message: 'Account already contains data. Seed skipped.',
      });
    }

    // Seed Resumes
    const [cv1] = await db
      .insert(documents)
      .values({
        userId: authUser.uid,
        type: 'RESUME',
        title: 'Fullstack_Software_Engineer_v3.pdf',
        version: 'v3.0',
        notes: 'Tailored for distributed systems, React, and PostgreSQL roles.',
      })
      .returning();

    await db.insert(documents).values({
      userId: authUser.uid,
      type: 'COVER_LETTER',
      title: 'Summer_Internship_Cover_Letter_2026.pdf',
      version: 'v1.2',
      notes: 'General SWE internship cover letter focusing on open source contributions.',
    });

    // Seed Companies
    const [stripe] = await db
      .insert(companies)
      .values({
        userId: authUser.uid,
        name: 'Stripe',
        website: 'https://stripe.com',
        industry: 'Fintech & Developer Tools',
        location: 'San Francisco, CA / Remote',
        size: 'Enterprise (7,000+)',
        description: 'Financial infrastructure platform for the internet.',
        notes: 'Values API design precision, clear writing, and systems engineering.',
      })
      .returning();

    const [datadog] = await db
      .insert(companies)
      .values({
        userId: authUser.uid,
        name: 'Datadog',
        website: 'https://datadoghq.com',
        industry: 'Cloud Monitoring & Observability',
        location: 'New York, NY / Remote',
        size: 'Enterprise (5,000+)',
        description: 'Monitoring and security platform for cloud applications.',
      })
      .returning();

    const [figma] = await db
      .insert(companies)
      .values({
        userId: authUser.uid,
        name: 'Figma',
        website: 'https://figma.com',
        industry: 'Collaborative Design Tools',
        location: 'San Francisco, CA',
        size: 'Mid-Market (1,500+)',
        description: 'Collaborative browser-based interface design tool.',
      })
      .returning();

    const [google] = await db
      .insert(companies)
      .values({
        userId: authUser.uid,
        name: 'Google',
        website: 'https://google.com',
        industry: 'Technology & Cloud',
        location: 'Mountain View, CA',
        size: 'Enterprise (100,000+)',
      })
      .returning();

    // Seed Applications
    // 1. Stripe - Technical Interview
    const [app1] = await db
      .insert(applications)
      .values({
        userId: authUser.uid,
        companyId: stripe.id,
        companyName: 'Stripe',
        position: 'Software Engineering Intern - Infrastructure',
        jobType: 'Internship',
        workMode: 'Remote',
        location: 'Remote, US',
        status: 'Technical Interview',
        priority: 'Urgent',
        salary: '$58/hour + Housing Stipend',
        jobUrl: 'https://stripe.com/jobs',
        applicationDate: '2026-09-18',
        deadline: '2026-10-25',
        recruiterName: 'Elena Rostova',
        recruiterEmail: 'erostova@stripe.com',
        notes: 'Passed the HackerRank OA (100% test cases passed). Next round is 1-hour live coding.',
        resumeVersion: 'v3.0',
      })
      .returning();

    // 2. Datadog - Assessment
    const [app2] = await db
      .insert(applications)
      .values({
        userId: authUser.uid,
        companyId: datadog.id,
        companyName: 'Datadog',
        position: 'Backend Engineering Intern',
        jobType: 'Internship',
        workMode: 'Hybrid',
        location: 'New York, NY',
        status: 'Assessment',
        priority: 'High',
        salary: '$54/hour',
        jobUrl: 'https://datadoghq.com/careers',
        applicationDate: '2026-09-28',
        deadline: '2026-10-18',
        notes: '70-minute Codesignal technical screening due by this Sunday.',
        resumeVersion: 'v3.0',
      })
      .returning();

    // 3. Figma - Applied
    const [app3] = await db
      .insert(applications)
      .values({
        userId: authUser.uid,
        companyId: figma.id,
        companyName: 'Figma',
        position: 'Web Platform Intern',
        jobType: 'Internship',
        workMode: 'Hybrid',
        location: 'San Francisco, CA',
        status: 'Applied',
        priority: 'High',
        salary: '$56/hour',
        jobUrl: 'https://figma.com/careers',
        applicationDate: '2026-10-02',
        notes: 'Submitted tailored cover letter highlighting WebAssembly and Canvas experience.',
        resumeVersion: 'v3.0',
      })
      .returning();

    // 4. Google - Final Interview
    const [app4] = await db
      .insert(applications)
      .values({
        userId: authUser.uid,
        companyId: google.id,
        companyName: 'Google',
        position: 'STEP / Software Engineering Intern',
        jobType: 'Internship',
        workMode: 'On-site',
        location: 'Mountain View, CA',
        status: 'Final Interview',
        priority: 'Urgent',
        salary: '$52/hour + Housing',
        jobUrl: 'https://careers.google.com',
        applicationDate: '2026-09-05',
        deadline: '2026-10-30',
        recruiterName: 'Marcus Vance',
        recruiterEmail: 'mvance@google.com',
        notes: 'Two back-to-back 45-minute technical interviews scheduled.',
        resumeVersion: 'v3.0',
      })
      .returning();

    // Seed Timeline Events
    await db.insert(applicationEvents).values([
      {
        applicationId: app1.id,
        userId: authUser.uid,
        eventType: 'CREATED',
        title: 'Application Created',
        description: 'Saved Stripe SWE Intern posting.',
        newStatus: 'Applied',
      },
      {
        applicationId: app1.id,
        userId: authUser.uid,
        eventType: 'ASSESSMENT_COMPLETED',
        title: 'HackerRank OA Completed',
        description: 'All test cases passed for graph and string manipulation problems.',
        previousStatus: 'Assessment',
        newStatus: 'Interview',
      },
      {
        applicationId: app1.id,
        userId: authUser.uid,
        eventType: 'STATUS_CHANGE',
        title: 'Invited to Technical Interview',
        description: 'Recruiter Elena confirmed technical round.',
        previousStatus: 'Interview',
        newStatus: 'Technical Interview',
      },
      {
        applicationId: app4.id,
        userId: authUser.uid,
        eventType: 'STATUS_CHANGE',
        title: 'Passed First Round Screening',
        description: 'Advanced to final round committee review.',
        previousStatus: 'Interview',
        newStatus: 'Final Interview',
      },
    ]);

    // Seed Interviews
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(14, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);
    nextWeek.setHours(10, 30, 0, 0);

    await db.insert(interviews).values([
      {
        applicationId: app1.id,
        userId: authUser.uid,
        round: 'Technical',
        title: 'Stripe API & Systems Live Coding Round',
        scheduledAt: tomorrow,
        durationMinutes: 60,
        interviewers: 'Alex Chen (Staff Infrastructure Engineer)',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        notes: 'Focus on idempotency, rate limiting, and concurrent worker patterns.',
        result: 'Pending',
      },
      {
        applicationId: app4.id,
        userId: authUser.uid,
        round: 'Final',
        title: 'Google Final Round: Data Structures & Algorithms',
        scheduledAt: nextWeek,
        durationMinutes: 90,
        interviewers: 'Dr. Sarah Lin, Senior Research Engineer',
        meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
        notes: 'Trees, dynamic programming, and space complexity trade-offs.',
        result: 'Pending',
      },
    ]);

    // Seed Tasks
    await db.insert(tasks).values([
      {
        userId: authUser.uid,
        applicationId: app1.id,
        title: 'Review Stripe API idempotency key architecture',
        description: 'Re-read the Stripe engineering blog post on Designing Robust APIs.',
        dueDate: '2026-10-17',
        priority: 'High',
        isCompleted: false,
      },
      {
        userId: authUser.uid,
        applicationId: app2.id,
        title: 'Complete Datadog CodeSignal OA',
        description: '70 minutes, 4 tasks. Do practice questions beforehand.',
        dueDate: '2026-10-18',
        priority: 'High',
        isCompleted: false,
      },
      {
        userId: authUser.uid,
        applicationId: app4.id,
        title: 'Prepare STAR stories on overcoming team project roadblocks',
        description: 'Focus on distributed systems class project and database optimization.',
        dueDate: '2026-10-20',
        priority: 'Medium',
        isCompleted: false,
      },
    ]);

    // Seed Prep Notes for Stripe
    await db.insert(prepNotes).values({
      applicationId: app1.id,
      userId: authUser.uid,
      companyResearch:
        'Stripe powers internet commerce. Founded by Patrick and John Collison. Core products: Payments, Billing, Connect, Radar, Issuing. Built heavily on Ruby, Go, Java, and Sorbet for type safety.',
      technicalTopics:
        'HTTP status codes, idempotency keys, webhook delivery retry mechanisms, eventual consistency, database indexing on transaction IDs.',
      starStories:
        'Situation: In my operating systems project, we faced race conditions in the buffer cache. Task: Guarantee atomic thread-safe access without locking the entire cache. Action: Implemented fine-grained bucket locks with reader-writer synchronization. Result: Reduced lock contention by 65% and passed all concurrency stress tests.',
      questionsToAsk:
        'How does the infrastructure team balance velocity with 99.999% uptime guarantees? What does a typical mentorship relationship look like during the internship?',
      areasToImprove:
        'Be more vocal about time complexity trade-offs before starting to write code.',
    });

    return NextResponse.json({ success: true, message: 'Sample internship tracker seeded!' });
  } catch (error) {
    console.error('POST /api/seed error:', error);
    return NextResponse.json({ error: 'Failed to seed sample data' }, { status: 500 });
  }
}
