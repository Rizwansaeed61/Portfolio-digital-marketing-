import { NextRequest, NextResponse } from 'next/server';

// Global in-memory storage on the server
let serverInbox = [
  {
    id: 'INBOX-827104',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: 'Sarah Jenkins',
    email: 'sarah@luxoretails.com',
    company: 'Luxo Retails Dubai',
    projectType: 'shopify-development',
    budget: '15k-30k',
    requirements: 'Need a custom headless Shopify store with ultra-low mobile load speed and direct checkout conversions API setup. Currently using a heavy PageFly layout.',
    read: false
  },
  {
    id: 'INBOX-194820',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: 'Ahmed Al-Mansoori',
    email: 'ahmed@mideastventures.ae',
    company: 'Mideast Organic Care',
    projectType: 'google-meta-ads',
    budget: '5k-15k',
    requirements: 'Looking for Google and Meta Ads manager to scale our monthly revenue. We are based in Dubai Marina and need setup of correct server-side CAPI tracking.',
    read: true
  }
];

export async function GET() {
  return NextResponse.json({ submissions: serverInbox });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Validate required fields
    if (!data.name || !data.email || !data.requirements) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    // Prepend the new submission
    serverInbox = [data, ...serverInbox];
    return NextResponse.json({ success: true, submissions: serverInbox });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { action, id, read } = await req.json();
    if (action === 'mark_read') {
      serverInbox = serverInbox.map(item => item.id === id ? { ...item, read } : item);
    } else if (action === 'delete') {
      serverInbox = serverInbox.filter(item => item.id !== id);
    } else if (action === 'mark_all_read') {
      serverInbox = serverInbox.map(item => ({ ...item, read: true }));
    }
    return NextResponse.json({ success: true, submissions: serverInbox });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  }
}
