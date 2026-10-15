import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { applications, companies, applicationEvents } from '@/src/db/schema.ts';
import { createApplicationSchema } from '@/src/schemas/application.schema.ts';
import { eq, and, desc, asc, ilike, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const jobType = searchParams.get('jobType')?.trim() || '';
    const priority = searchParams.get('priority')?.trim() || '';
    const sort = searchParams.get('sort')?.trim() || 'newest';

    const conditions = [eq(applications.userId, authUser.uid)];

    if (status) {
      conditions.push(eq(applications.status, status));
    }
    if (jobType) {
      conditions.push(eq(applications.jobType, jobType));
    }
    if (priority) {
      conditions.push(eq(applications.priority, priority));
    }
    if (search) {
      conditions.push(
        or(
          ilike(applications.companyName, `%${search}%`),
          ilike(applications.position, `%${search}%`),
          ilike(applications.location, `%${search}%`)
        )!
      );
    }

    let orderByClause = desc(applications.createdAt);
    if (sort === 'oldest') {
      orderByClause = asc(applications.createdAt);
    } else if (sort === 'deadline') {
      orderByClause = asc(applications.deadline);
    } else if (sort === 'company') {
      orderByClause = asc(applications.companyName);
    }

    const items = await db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(orderByClause);

    return NextResponse.json({ applications: items });
  } catch (error) {
    console.error('GET /api/applications error:', error);
    return NextResponse.json({ error: 'Failed to retrieve applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check or create associated company
    let targetCompanyId = data.companyId;
    if (!targetCompanyId) {
      const existingCompany = await db
        .select()
        .from(companies)
        .where(
          and(eq(companies.userId, authUser.uid), eq(companies.name, data.companyName.trim()))
        )
        .limit(1);

      if (existingCompany.length > 0) {
        targetCompanyId = existingCompany[0].id;
      } else {
        const [newCompany] = await db
          .insert(companies)
          .values({
            userId: authUser.uid,
            name: data.companyName.trim(),
            location: data.location || null,
          })
          .returning();
        targetCompanyId = newCompany.id;
      }
    }

    // Insert Application
    const [newApp] = await db
      .insert(applications)
      .values({
        userId: authUser.uid,
        companyId: targetCompanyId,
        companyName: data.companyName.trim(),
        position: data.position.trim(),
        jobType: data.jobType,
        workMode: data.workMode,
        location: data.location || null,
        status: data.status,
        priority: data.priority,
        salary: data.salary || null,
        jobUrl: data.jobUrl || null,
        portalUrl: data.portalUrl || null,
        applicationDate: data.applicationDate || null,
        deadline: data.deadline || null,
        recruiterName: data.recruiterName || null,
        recruiterEmail: data.recruiterEmail || null,
        recruiterPhone: data.recruiterPhone || null,
        notes: data.notes || null,
        resumeVersion: data.resumeVersion || null,
        coverLetterVersion: data.coverLetterVersion || null,
      })
      .returning();

    // Log initial timeline event
    await db.insert(applicationEvents).values({
      applicationId: newApp.id,
      userId: authUser.uid,
      eventType: 'CREATED',
      title: 'Application Created',
      description: `Tracked application for ${newApp.position} at ${newApp.companyName} (${newApp.status}).`,
      newStatus: newApp.status,
    });

    return NextResponse.json({ application: newApp }, { status: 201 });
  } catch (error) {
    console.error('POST /api/applications error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
