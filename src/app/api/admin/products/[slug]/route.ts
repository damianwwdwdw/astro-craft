import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureProductsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await ensureProductsTable();
    await getPool().query(`DELETE FROM products WHERE slug = $1`, [slug]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się usunąć produktu." },
      { status: 500 }
    );
  }
}
