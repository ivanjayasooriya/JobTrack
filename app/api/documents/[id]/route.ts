import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/src/lib/server-auth.ts';
import { db } from '@/src/db/index.ts';
import { documents } from '@/src/db/schema.ts';
import { eq, and } from 'drizzle-orm';

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
    const docId = parseInt(id, 10);
    if (isNaN(docId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(documents)
      .where(and(eq(documents.id, docId), eq(documents.userId, authUser.uid)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error('DELETE /api/documents/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
