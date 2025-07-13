import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataFile = path.join(process.cwd(), "photos.json");

export async function GET() {
  try {
    const file = await fs.readFile(dataFile, "utf-8");
    const urls = JSON.parse(file);
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    let current: string[] = [];
    try {
      const file = await fs.readFile(dataFile, "utf-8");
      current = JSON.parse(file);
    } catch {
      current = [];
    }

    current.push(url);
    await fs.writeFile(dataFile, JSON.stringify(current, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}

