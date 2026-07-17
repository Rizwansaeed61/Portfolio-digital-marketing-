import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const OTP_FILE_PATH = path.join(process.cwd(), 'otp-store.json');
const EMAILS_FILE_PATH = path.join(process.cwd(), 'sent-emails.json');

interface OTPRecord {
  code: string;
  expiresAt: number;
  type: string;
  newValue: string;
}

async function readOTPStore(): Promise<Record<string, OTPRecord>> {
  try {
    if (fs.existsSync(OTP_FILE_PATH)) {
      const data = await fs.promises.readFile(OTP_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Failed to read OTP store, returning empty:", e);
  }
  return {};
}

async function writeOTPStore(data: Record<string, OTPRecord>) {
  try {
    await fs.promises.writeFile(OTP_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write OTP store:", e);
  }
}

async function addSentEmail(email: any) {
  try {
    let emails = [];
    if (fs.existsSync(EMAILS_FILE_PATH)) {
      const data = await fs.promises.readFile(EMAILS_FILE_PATH, 'utf-8');
      emails = JSON.parse(data);
    }
    emails.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ...email
    });
    // Keep last 30 emails
    emails = emails.slice(0, 30);
    await fs.promises.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2), 'utf-8');
  } catch (e) {
    console.warn("Failed to write to sent emails file:", e);
  }
}

export async function GET() {
  try {
    let emails = [];
    if (fs.existsSync(EMAILS_FILE_PATH)) {
      const data = await fs.promises.readFile(EMAILS_FILE_PATH, 'utf-8');
      emails = JSON.parse(data);
    }
    return NextResponse.json({ success: true, emails });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, type, newValue, otp, email } = await req.json();

    if (action === 'send') {
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
      }
      if (!newValue) {
        return NextResponse.json({ success: false, error: 'New value is required' }, { status: 400 });
      }

      // Generate a 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      const store = await readOTPStore();
      store[type] = {
        code,
        expiresAt,
        type,
        newValue
      };
      await writeOTPStore(store);

      const subject = `[SECURITY BLOCKCHAIN] Dubai Growth Platform OTP: Change ${type === 'username' ? 'Username' : 'Passkey'}`;
      const emailContent = `
================================================================================
SECURITY GATEWAY SECURED BY DUBAI CLOUD HUB
================================================================================
Alert Type: Request to Update Admin Credentials
Modified Attribute: ${type.toUpperCase()}
New Suggested Value: ${newValue}
Recipient Address: ${email}
Timestamp: ${new Date().toLocaleString()}

Your single-use secure Verification Code is:
------------------------------------------------------------
                       [ ${code} ]
------------------------------------------------------------
This OTP code will expire in exactly 5 minutes (at ${new Date(expiresAt).toLocaleTimeString()}).
If you did not initiate this request, please contact Security Protocols immediately.

================================================================================
SYSTEM LOG: SECURITY_GATEWAY_SUCCESS // END OF FILE
================================================================================
      `;

      // Log in server console for deep tracing
      console.log(`\n\n\x1b[36m========================================================================\x1b[0m`);
      console.log(`\x1b[32m[SECURITY GATEWAY] DISPATCHING SECURE OTP TO RIZWAN GMAIL\x1b[0m`);
      console.log(`\x1b[34mTo:\x1b[0m \x1b[37m${email}\x1b[0m`);
      console.log(`\x1b[34mSubject:\x1b[0m \x1b[33m${subject}\x1b[0m`);
      console.log(`\x1b[34mAction:\x1b[0m \x1b[31mChange Admin ${type.toUpperCase()} to "${newValue}"\x1b[0m`);
      console.log(`\x1b[34mOTP Verification Code:\x1b[0m \x1b[32m[ ${code} ]\x1b[0m`);
      console.log(`\x1b[36m========================================================================\n\n\x1b[0m`);

      // Add to sent emails database for in-app sandboxed mail visualizer
      await addSentEmail({
        to: email,
        subject,
        body: emailContent,
        code,
        type,
        newValue
      });

      return NextResponse.json({ 
        success: true, 
        message: `OTP successfully dispatched to ${email}.`,
        simulated: true,
        code // Send in response for the developer client preview comfort
      });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ success: false, error: 'OTP is required' }, { status: 400 });
      }
      if (!type) {
        return NextResponse.json({ success: false, error: 'Credential type is required' }, { status: 400 });
      }

      const store = await readOTPStore();
      const record = store[type];

      if (!record) {
        return NextResponse.json({ success: false, error: 'No active OTP verification session found for this parameter' }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }

      if (record.code !== otp.trim()) {
        return NextResponse.json({ success: false, error: 'ACCESS DENIED: INVALID OTP CODE' }, { status: 401 });
      }

      // Successful verification! Clean up this type's OTP
      delete store[type];
      await writeOTPStore(store);

      return NextResponse.json({ 
        success: true, 
        newValue: record.newValue,
        message: 'OTP Code verified successfully. Authorization granted.'
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
