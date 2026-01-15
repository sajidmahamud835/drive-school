import jsPDF from 'jspdf';
import { config } from './config';

interface StudentInfo {
  studentId: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address?: string;
  photo?: string; // Base64 image or URL
}

interface CertificateInfo {
  studentId: string;
  name: string;
  completionDate: Date;
  packageName: string;
  certificateId?: string;
}

interface InvoiceInfo {
  invoiceNumber: string;
  studentId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  fee: number;
  totalPaid: number;
  due: number;
  payments?: Array<{
    amount: number;
    date: Date;
    method: string;
    notes?: string;
  }>;
  issueDate: Date;
}

/**
 * Generate Student ID Card PDF
 */
export function generateStudentIDCard(student: StudentInfo): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98], // Standard ID card size
  });

  // Background color
  doc.setFillColor(232, 30, 99); // Tinder pink
  doc.rect(0, 0, 85.6, 53.98, 'F');

  // White content area
  doc.setFillColor(255, 255, 255);
  doc.rect(2, 2, 81.6, 49.98, 'F');

  // Header
  doc.setTextColor(232, 30, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার', 42.8, 8, { align: 'center' });

  // Student ID
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('স্টুডেন্ট আইডি:', 5, 15);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(student.studentId, 30, 15);

  // Name
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('নাম:', 5, 22);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(student.name, 15, 22);

  // Age & Gender
  if (student.age) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`বয়স: ${student.age} বছর`, 5, 28);
    const genderText = student.gender === 'male' ? 'পুরুষ' : student.gender === 'female' ? 'মহিলা' : 'অন্যান্য';
    doc.text(`লিঙ্গ: ${genderText}`, 35, 28);
  }

  // Phone
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('ফোন:', 5, 34);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(student.phone, 18, 34);

  // Email
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('ইমেইল:', 5, 40);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const emailText = doc.splitTextToSize(student.email, 50);
  doc.text(emailText, 20, 40);

  // Address (if provided)
  if (student.address) {
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('ঠিকানা:', 5, 46);
    doc.setTextColor(0, 0, 0);
    const addressText = doc.splitTextToSize(student.address, 50);
    doc.text(addressText, 20, 46);
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('এই কার্ডটি শুধুমাত্র প্রশিক্ষণ কেন্দ্রে ব্যবহারের জন্য', 42.8, 51, { align: 'center' });

  // Save PDF
  doc.save(`student-id-${student.studentId}.pdf`);
}

/**
 * Generate Completion Certificate PDF
 */
export function generateCompletionCertificate(info: CertificateInfo): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Background border
  doc.setDrawColor(232, 30, 99);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Inner border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 267, 180);

  // Header
  doc.setFillColor(232, 30, 99);
  doc.rect(15, 15, 267, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('সার্টিফিকেট অফ কমপ্লিশন', 148.5, 32, { align: 'center' });

  // Body
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('এই সার্টিফিকেট দ্বারা প্রমাণিত যে', 148.5, 60, { align: 'center' });

  // Student name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(info.name, 148.5, 80, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('স্টুডেন্ট আইডি:', 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.text(info.studentId, 140, 100);

  doc.setFont('helvetica', 'normal');
  doc.text('সফলভাবে সম্পন্ন করেছেন', 148.5, 120, { align: 'center' });

  // Package name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(info.packageName, 148.5, 140, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার থেকে', 148.5, 155, { align: 'center' });

  // Date
  const dateStr = new Date(info.completionDate).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`তারিখ: ${dateStr}`, 148.5, 170, { align: 'center' });

  // Footer signatures
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('___________________', 80, 185);
  doc.text('প্রশিক্ষক', 80, 192);

  doc.text('___________________', 217, 185);
  doc.text('পরিচালক', 217, 192);

  // Certificate ID (if provided)
  if (info.certificateId) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`সার্টিফিকেট আইডি: ${info.certificateId}`, 148.5, 180, { align: 'center' });
  }

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('এই সার্টিফিকেটটি অনলাইনে যাচাই করা যাবে', 148.5, 200, { align: 'center' });

  // Save PDF
  doc.save(`certificate-${info.studentId}-${Date.now()}.pdf`);
}

/**
 * Generate Invoice PDF
 */
export function generateInvoice(invoice: InvoiceInfo): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFillColor(232, 30, 99);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার', 105, 15, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('ইনভয়েস', 105, 28, { align: 'center' });

  // Invoice Number
  doc.setFillColor(255, 255, 255);
  doc.rect(10, 45, 190, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`ইনভয়েস নম্বর: ${invoice.invoiceNumber}`, 15, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const issueDateStr = new Date(invoice.issueDate).toLocaleDateString('bn-BD');
  doc.text(`তারিখ: ${issueDateStr}`, 150, 55);

  // Student Info
  let yPos = 70;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('শিক্ষার্থীর তথ্য:', 15, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`নাম: ${invoice.name}`, 15, yPos);
  yPos += 6;
  doc.text(`স্টুডেন্ট আইডি: ${invoice.studentId}`, 15, yPos);
  yPos += 6;
  doc.text(`ফোন: ${invoice.phone}`, 15, yPos);
  yPos += 6;
  if (invoice.email) {
    doc.text(`ইমেইল: ${invoice.email}`, 15, yPos);
    yPos += 6;
  }
  if (invoice.address) {
    const addressLines = doc.splitTextToSize(`ঠিকানা: ${invoice.address}`, 180);
    doc.text(addressLines, 15, yPos);
    yPos += addressLines.length * 6;
  }

  // Fee Details
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ফি বিবরণ:', 15, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('মোট ফি:', 15, yPos);
  doc.text(`৳${invoice.fee.toLocaleString('bn-BD')}`, 150, yPos, { align: 'right' });
  yPos += 8;

  doc.text('মোট প্রদত্ত:', 15, yPos);
  doc.text(`৳${invoice.totalPaid.toLocaleString('bn-BD')}`, 150, yPos, { align: 'right' });
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('বাকি:', 15, yPos);
  doc.setTextColor(invoice.due > 0 ? 232 : 0, invoice.due > 0 ? 30 : 150, invoice.due > 0 ? 99 : 0);
  doc.text(`৳${invoice.due.toLocaleString('bn-BD')}`, 150, yPos, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  yPos += 10;

  // Payment History
  if (invoice.payments && invoice.payments.length > 0) {
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 195, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('পেমেন্ট ইতিহাস:', 15, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    invoice.payments.forEach((payment, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      const paymentDate = new Date(payment.date).toLocaleDateString('bn-BD');
      const methodText = payment.method === 'cash' ? 'নগদ' : payment.method === 'bank' ? 'ব্যাংক' : 'অন্যান্য';
      doc.text(`${index + 1}. ৳${payment.amount.toLocaleString('bn-BD')} - ${methodText} - ${paymentDate}`, 20, yPos);
      if (payment.notes) {
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`   নোট: ${payment.notes}`, 20, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      yPos += 7;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('এই ইনভয়েসটি প্রশিক্ষণ কেন্দ্র থেকে জারি করা হয়েছে', 105, 280, { align: 'center' });

  // Save PDF
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
}
