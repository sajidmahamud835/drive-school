import { NextRequest, NextResponse } from 'next/server';
import { generateRandomPassword } from '@/lib/passwordGenerator';
import { sendPasswordEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Generate random password
    const password = generateRandomPassword(12);

    // Send password via email
    try {
      await sendPasswordEmail(email, name, password);
    } catch (emailError) {
      console.error('Error sending password email:', emailError);
      // Continue even if email fails - password is still generated
    }

    return NextResponse.json({
      success: true,
      password, // Return password so frontend can use it for signup
      message: 'Password generated and sent to email',
    });
  } catch (error: any) {
    console.error('Password generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate password' },
      { status: 500 }
    );
  }
}
