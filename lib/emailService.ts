import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP not configured. Email not sent:', { to, subject });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendPasswordEmail(
  email: string,
  name: string,
  password: string
): Promise<void> {
  const subject = 'আপনার অ্যাকাউন্ট পাসওয়ার্ড - থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #E91E63;">থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার</h2>
      <p>প্রিয় ${name},</p>
      <p>আপনার অ্যাকাউন্ট তৈরি করা হয়েছে। আপনার লগইন পাসওয়ার্ড নিচে দেওয়া হলো:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 18px; font-weight: bold; color: #E91E63; margin: 0;">${password}</p>
      </div>
      <p>অনুগ্রহ করে এই পাসওয়ার্ড দিয়ে লগইন করুন এবং নিরাপত্তার জন্য প্রথম লগইনের পর পাসওয়ার্ড পরিবর্তন করুন।</p>
      <p>ধন্যবাদ,<br>থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার</p>
    </div>
  `;
  const text = `প্রিয় ${name},\n\nআপনার অ্যাকাউন্ট তৈরি করা হয়েছে। আপনার লগইন পাসওয়ার্ড: ${password}\n\nঅনুগ্রহ করে এই পাসওয়ার্ড দিয়ে লগইন করুন।`;

  await sendEmail(email, subject, html, text);
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  studentId: string
): Promise<void> {
  const subject = 'আপনার অ্যাকাউন্ট তৈরি হয়েছে - থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #E91E63;">থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার</h2>
      <p>প্রিয় ${name},</p>
      <p>আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে।</p>
      <p>আপনার স্টুডেন্ট আইডি: <strong>${studentId}</strong></p>
      <p>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
      <p>ধন্যবাদ,<br>থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার</p>
    </div>
  `;

  await sendEmail(email, subject, html);
}
