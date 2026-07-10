import { NextResponse } from "next/server";
import { getProperties, saveProperty, type SiteProperty } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getProperties());
}

export async function POST(request: Request) {
  const body = await request.json() as SiteProperty;
  if (!body.id || !body.name || !body.slug) {
    return NextResponse.json({ error: "id, name, slug required" }, { status: 400 });
  }
  saveProperty(body);
  return NextResponse.json({ success: true, property: body });
}
