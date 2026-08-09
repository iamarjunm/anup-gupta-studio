import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to');

  if (!to) {
    return NextResponse.json({ error: 'Please provide a ?to=email@example.com parameter' }, { status: 400 });
  }

  try {
    const result = await sendEmail({
      to,
      subject: 'Test Email from Anup Gupta Studio',
      html: '<h1>This is a test email!</h1><p>If you received this, Resend is working correctly.</p>'
    });

    return NextResponse.json({
      message: 'Test completed',
      resendResponse: result,
      envKeyPresent: !!process.env.RESEND_API_KEY
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
