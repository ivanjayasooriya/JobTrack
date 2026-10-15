import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { tasks, applications } from '@/src/db/schema.ts';
import { taskSchema } from '@/src/schemas/task.schema.ts';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('applicationId');
    const completed = searchParams.get('completed');

    const conditions = [eq(tasks.userId, authUser.uid)];

    if (appId) {
      const parsedId = parseInt(appId, 10);
      if (!isNaN(parsedId)) {
        conditions.push(eq(tasks.applicationId, parsedId));
      }
    }

    if (completed !== null && completed !== undefined && completed !== '') {
      conditions.push(eq(tasks.isCompleted, completed === 'true'));
    }

    const results = await db
      .select({
        id: tasks.id,
        applicationId: tasks.applicationId,
        title: tasks.title,
        description: tasks.description,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        isCompleted: tasks.isCompleted,
        completedAt: tasks.completedAt,
        createdAt: tasks.createdAt,
        companyName: applications.companyName,
        position: applications.position,
      })
      .from(tasks)
      .leftJoin(applications, eq(tasks.applicationId, applications.id))
      .where(and(...conditions))
      .orderBy(asc(tasks.isCompleted), asc(tasks.dueDate), desc(tasks.createdAt));

    return NextResponse.json({ tasks: results });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to retrieve tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // If linked to an application, verify user ownership
    if (data.applicationId) {
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
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: authUser.uid,
        applicationId: data.applicationId || null,
        title: data.title.trim(),
        description: data.description || null,
        dueDate: data.dueDate || null,
        priority: data.priority,
        isCompleted: data.isCompleted || false,
      })
      .returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
