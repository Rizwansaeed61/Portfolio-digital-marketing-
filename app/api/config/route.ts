import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config-store.json');

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const fileData = await fs.promises.readFile(CONFIG_FILE_PATH, 'utf-8');
      const config = JSON.parse(fileData);
      return NextResponse.json({ success: true, config });
    }
    return NextResponse.json({ success: true, config: null });
  } catch (error) {
    console.error("Error reading config-store.json:", error);
    return NextResponse.json({ success: false, error: 'Failed to read configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid configuration data' }, { status: 400 });
    }

    // Save full or partial config payload
    await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing config-store.json:", error);
    return NextResponse.json({ success: false, error: 'Failed to save configuration' }, { status: 500 });
  }
}
