import { NextResponse } from "next/server";
import { getProperty, saveProperty, type SiteProperty } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const property = getProperty(params.id);
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const existing = getProperty(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json() as Partial<SiteProperty>;
  const updated = { ...existing, ...body, id: params.id };
  saveProperty(updated);
  return NextResponse.json({ success: true, property: updated });
}
