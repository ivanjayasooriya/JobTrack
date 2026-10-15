import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { applications, prepNotes } from '@/src/db/schema.ts';
import { prepNoteSchema } from '@/src/schemas/task.schema.ts';
import { eq, and } from 'drizzle-orm';

export async function PUT(
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

    // Verify application ownership
    const [app] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, appId), eq(applications.userId, authUser.uid)))
      .limit(1);

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = prepNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Upsert prep notes
    const [saved] = await db
      .insert(prepNotes)
      .values({
        applicationId: appId,
        userId: authUser.uid,
        companyResearch: data.companyResearch || null,
        technicalTopics: data.technicalTopics || null,
        starStories: data.starStories || null,
        questionsToAsk: data.questionsToAsk || null,
        areasToImprove: data.areasToImprove || null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: prepNotes.applicationId,
        set: {
          companyResearch: data.companyResearch || null,
          technicalTopics: data.technicalTopics || null,
          starStories: data.starStories || null,
          questionsToAsk: data.questionsToAsk || null,
          areasToImprove: data.areasToImprove || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ prepNotes: saved });
  } catch (error) {
    console.error('PUT /api/applications/[id]/prep error:', error);
    return NextResponse.json({ error: 'Failed to save preparation notes' }, { status: 500 });
  }
}
