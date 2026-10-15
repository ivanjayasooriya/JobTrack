import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { companies, applications } from '@/src/db/schema.ts';
import { companySchema } from '@/src/schemas/company.schema.ts';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCompanies = await db
      .select({
        id: companies.id,
        userId: companies.userId,
        name: companies.name,
        website: companies.website,
        industry: companies.industry,
        location: companies.location,
        size: companies.size,
        description: companies.description,
        notes: companies.notes,
        createdAt: companies.createdAt,
        applicationCount: sql<number>`count(${applications.id})::int`,
      })
      .from(companies)
      .leftJoin(applications, eq(applications.companyId, companies.id))
      .where(eq(companies.userId, authUser.uid))
      .groupBy(companies.id)
      .orderBy(desc(companies.createdAt));

    return NextResponse.json({ companies: userCompanies });
  } catch (error) {
    console.error('GET /api/companies error:', error);
    return NextResponse.json({ error: 'Failed to retrieve companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const [newComp] = await db
      .insert(companies)
      .values({
        userId: authUser.uid,
        name: data.name.trim(),
        website: data.website || null,
        industry: data.industry || null,
        location: data.location || null,
        size: data.size || null,
        description: data.description || null,
        notes: data.notes || null,
      })
      .returning();

    return NextResponse.json({ company: newComp }, { status: 201 });
  } catch (error) {
    console.error('POST /api/companies error:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
