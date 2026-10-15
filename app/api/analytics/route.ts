import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { applications, interviews, tasks, applicationEvents } from '@/src/db/schema.ts';
import { calculateFunnelMetrics } from '@/src/lib/calculations.ts';
import { eq, and, desc, gte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user applications
    const userApps = await db
      .select({
        id: applications.id,
        status: applications.status,
        jobType: applications.jobType,
        workMode: applications.workMode,
        companyName: applications.companyName,
        position: applications.position,
        applicationDate: applications.applicationDate,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(eq(applications.userId, authUser.uid));

    // Calculate mathematically guarded metrics
    const funnelMetrics = calculateFunnelMetrics(userApps);

    // Upcoming interviews
    const upcomingInterviews = await db
      .select({
        id: interviews.id,
        round: interviews.round,
        title: interviews.title,
        scheduledAt: interviews.scheduledAt,
        durationMinutes: interviews.durationMinutes,
        meetingUrl: interviews.meetingUrl,
      })
      .from(interviews)
      .where(and(eq(interviews.userId, authUser.uid), gte(interviews.scheduledAt, new Date())))
      .orderBy(interviews.scheduledAt)
      .limit(5);

    // Pending tasks
    const pendingTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
      })
      .from(tasks)
      .where(and(eq(tasks.userId, authUser.uid), eq(tasks.isCompleted, false)))
      .orderBy(tasks.dueDate)
      .limit(5);

    // Recent events / timeline
    const recentEvents = await db
      .select({
        id: applicationEvents.id,
        applicationId: applicationEvents.applicationId,
        eventType: applicationEvents.eventType,
        title: applicationEvents.title,
        description: applicationEvents.description,
        eventDate: applicationEvents.eventDate,
      })
      .from(applicationEvents)
      .where(eq(applicationEvents.userId, authUser.uid))
      .orderBy(desc(applicationEvents.eventDate))
      .limit(6);

    // Breakdown by Job Type
    const byJobType: Record<string, number> = {};
    const byWorkMode: Record<string, number> = {};
    for (const app of userApps) {
      byJobType[app.jobType] = (byJobType[app.jobType] || 0) + 1;
      byWorkMode[app.workMode] = (byWorkMode[app.workMode] || 0) + 1;
    }

    return NextResponse.json({
      metrics: funnelMetrics,
      upcomingInterviews,
      pendingTasks,
      recentEvents,
      byJobType,
      byWorkMode,
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Failed to calculate analytics' }, { status: 500 });
  }
}
