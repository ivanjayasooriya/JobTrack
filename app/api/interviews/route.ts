import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { interviews, applications, applicationEvents } from '@/src/db/schema.ts';
import { interviewSchema } from '@/src/schemas/interview.schema.ts';
import { eq, and, asc, desc, gte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const appId = searchParams.get('applicationId');

    const conditions = [eq(interviews.userId, authUser.uid)];

    if (appId) {
      const parsedId = parseInt(appId, 10);
      if (!isNaN(parsedId)) {
        conditions.push(eq(interviews.applicationId, parsedId));
      }
    }

    if (upcoming) {
      // Filter for future or today
      conditions.push(gte(interviews.scheduledAt, new Date()));
    }

    const results = await db
      .select({
        id: interviews.id,
        applicationId: interviews.applicationId,
        userId: interviews.userId,
        round: interviews.round,
        title: interviews.title,
        scheduledAt: interviews.scheduledAt,
        durationMinutes: interviews.durationMinutes,
        interviewers: interviews.interviewers,
        meetingUrl: interviews.meetingUrl,
        location: interviews.location,
        notes: interviews.notes,
        feedback: interviews.feedback,
        result: interviews.result,
        companyName: applications.companyName,
        position: applications.position,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .where(and(...conditions))
      .orderBy(upcoming ? asc(interviews.scheduledAt) : desc(interviews.scheduledAt));

    return NextResponse.json({ interviews: results });
  } catch (error) {
    console.error('GET /api/interviews error:', error);
    return NextResponse.json({ error: 'Failed to retrieve interviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = interviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify application belongs to user
    const [app] = await db
      .select()
      .from(applications)
      .where(
        and(eq(applications.id, data.applicationId), eq(applications.userId, authUser.uid))
      )
      .limit(1);

    if (!app) {
      return NextResponse.json({ error: 'Associated application not found' }, { status: 404 });
    }

    const [newInterview] = await db
      .insert(interviews)
      .values({
        applicationId: data.applicationId,
        userId: authUser.uid,
        round: data.round,
        title: data.title.trim(),
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes,
        interviewers: data.interviewers || null,
        meetingUrl: data.meetingUrl || null,
        location: data.location || null,
        notes: data.notes || null,
        feedback: data.feedback || null,
        result: data.result,
      })
      .returning();

    // Log timeline event
    await db.insert(applicationEvents).values({
      applicationId: app.id,
      userId: authUser.uid,
      eventType: 'INTERVIEW_SCHEDULED',
      title: `${data.round} Interview Scheduled`,
      description: `${data.title} on ${new Date(data.scheduledAt).toLocaleString()}`,
    });

    return NextResponse.json({ interview: newInterview }, { status: 201 });
  } catch (error) {
    console.error('POST /api/interviews error:', error);
    return NextResponse.json({ error: 'Failed to schedule interview' }, { status: 500 });
  }
}
