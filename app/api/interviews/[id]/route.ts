import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { interviews } from '@/src/db/schema.ts';
import { updateInterviewSchema } from '@/src/schemas/interview.schema.ts';
import { eq, and } from 'drizzle-orm';

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
    const interviewId = parseInt(id, 10);
    if (isNaN(interviewId)) {
      return NextResponse.json({ error: 'Invalid interview ID' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updatePayload: Record<string, any> = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.scheduledAt) {
      updatePayload.scheduledAt = new Date(data.scheduledAt);
    }

    const [updated] = await db
      .update(interviews)
      .set(updatePayload)
      .where(and(eq(interviews.id, interviewId), eq(interviews.userId, authUser.uid)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ interview: updated });
  } catch (error) {
    console.error('PATCH /api/interviews/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
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
    const interviewId = parseInt(id, 10);
    if (isNaN(interviewId)) {
      return NextResponse.json({ error: 'Invalid interview ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(interviews)
      .where(and(eq(interviews.id, interviewId), eq(interviews.userId, authUser.uid)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    console.error('DELETE /api/interviews/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}
