import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getContent());
}

export async function PUT(request: Request) {
  const body = await request.json();
  saveContent(body);
  return NextResponse.json({ success: true, content: getContent() });
}
