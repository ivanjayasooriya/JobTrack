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
} from '@/src/db/schema.ts';
import { updateApplicationSchema } from '@/src/schemas/application.schema.ts';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const appId = parseInt(id, 10);
    if (isNaN(appId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    // Query application with strict userId check (IDOR defense)
    const [app] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, appId), eq(applications.userId, authUser.uid)))
      .limit(1);

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Fetch related company
    let company = null;
    if (app.companyId) {
      const [comp] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, app.companyId))
        .limit(1);
      company = comp || null;
    }

    // Fetch timeline events
    const events = await db
      .select()
      .from(applicationEvents)
      .where(eq(applicationEvents.applicationId, appId))
      .orderBy(desc(applicationEvents.eventDate));

    // Fetch scheduled interviews
    const appInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, appId))
      .orderBy(desc(interviews.scheduledAt));

    // Fetch tasks
    const appTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.applicationId, appId))
      .orderBy(tasks.isCompleted, tasks.dueDate);

    // Fetch prep notes
    const [prep] = await db
      .select()
      .from(prepNotes)
      .where(eq(prepNotes.applicationId, appId))
      .limit(1);

    return NextResponse.json({
      application: app,
      company,
      events,
      interviews: appInterviews,
      tasks: appTasks,
      prepNotes: prep || null,
    });
  } catch (error) {
    console.error('GET /api/applications/[id] error:', error);
    return NextResponse.json({ error: 'Failed to retrieve application details' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const appId = parseInt(id, 10);
    if (isNaN(appId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Get current record
    const [current] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, appId), eq(applications.userId, authUser.uid)))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updateData = parsed.data;

    // Check if status changed
    const statusChanged = updateData.status && updateData.status !== current.status;

    const [updated] = await db
      .update(applications)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(applications.id, appId), eq(applications.userId, authUser.uid)))
      .returning();

    // If status changed, record timeline event
    if (statusChanged && updateData.status) {
      await db.insert(applicationEvents).values({
        applicationId: appId,
        userId: authUser.uid,
        eventType: 'STATUS_CHANGE',
        title: `Status changed to ${updateData.status}`,
        description: body.eventNote || `Pipeline moved from ${current.status} to ${updateData.status}`,
        previousStatus: current.status,
        newStatus: updateData.status,
      });
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error('PATCH /api/applications/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const appId = parseInt(id, 10);
    if (isNaN(appId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(applications)
      .where(and(eq(applications.id, appId), eq(applications.userId, authUser.uid)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/applications/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
