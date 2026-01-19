import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
 * Generate Invoice PDF using HTML to preserve Bengali fonts
 */
export async function generateInvoice(invoice: InvoiceInfo): Promise<void> {
  // Create a temporary HTML element for the invoice
  const invoiceDiv = document.createElement('div');
  invoiceDiv.style.position = 'absolute';
  invoiceDiv.style.left = '-9999px';
  invoiceDiv.style.width = '210mm'; // A4 width
  invoiceDiv.style.padding = '20mm';
  invoiceDiv.style.backgroundColor = 'white';
  invoiceDiv.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Bengali", "Mukti", sans-serif';
  invoiceDiv.style.fontSize = '14px';
  invoiceDiv.style.color = '#000';
  invoiceDiv.style.lineHeight = '1.6';

  const issueDateStr = new Date(invoice.issueDate).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  invoiceDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #E81E64 0%, #FF6B9D 100%); padding: 30px 20px; margin: -20mm -20mm 20px -20mm; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার</h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">ইনভয়েস</p>
    </div>

    <div style="background: white; padding: 15px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; font-size: 16px; font-weight: bold;">ইনভয়েস নম্বর: ${invoice.invoiceNumber}</p>
        <p style="margin: 0; font-size: 12px;">তারিখ: ${issueDateStr}</p>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #111;">শিক্ষার্থীর তথ্য:</h2>
      <p style="margin: 5px 0;"><strong>নাম:</strong> ${invoice.name}</p>
      <p style="margin: 5px 0;"><strong>স্টুডেন্ট আইডি:</strong> ${invoice.studentId}</p>
      <p style="margin: 5px 0;"><strong>ফোন:</strong> ${invoice.phone}</p>
      ${invoice.email ? `<p style="margin: 5px 0;"><strong>ইমেইল:</strong> ${invoice.email}</p>` : ''}
      ${invoice.address ? `<p style="margin: 5px 0;"><strong>ঠিকানা:</strong> ${invoice.address}</p>` : ''}
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #111;">ফি বিবরণ:</h2>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>মোট ফি:</span>
        <span style="font-weight: bold;">৳${invoice.fee.toLocaleString('bn-BD')}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>মোট প্রদত্ত:</span>
        <span style="font-weight: bold;">৳${invoice.totalPaid.toLocaleString('bn-BD')}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0; padding-top: 10px; border-top: 2px solid #e5e7eb;">
        <span style="font-weight: bold;">বাকি:</span>
        <span style="font-weight: bold; color: ${invoice.due > 0 ? '#E81E64' : '#10b981'};">
          ৳${invoice.due.toLocaleString('bn-BD')}
        </span>
      </div>
    </div>

    ${invoice.payments && invoice.payments.length > 0 ? `
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #111;">পেমেন্ট ইতিহাস:</h2>
        ${invoice.payments.map((payment, index) => {
          const paymentDate = new Date(payment.date).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const methodText = payment.method === 'cash' ? 'নগদ' : payment.method === 'bank' ? 'ব্যাংক' : 'অন্যান্য';
          return `
            <div style="margin: 10px 0; padding-left: 15px;">
              <p style="margin: 5px 0;">
                ${index + 1}. ৳${payment.amount.toLocaleString('bn-BD')} - ${methodText} - ${paymentDate}
              </p>
              ${payment.notes ? `<p style="margin: 5px 0; color: #666; font-size: 12px;">   নোট: ${payment.notes}</p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}

    <div style="margin-top: 40px; text-align: center; color: #666; font-size: 10px; font-style: italic;">
      <p style="margin: 0;">এই ইনভয়েসটি প্রশিক্ষণ কেন্দ্র থেকে জারি করা হয়েছে</p>
    </div>
  `;

  document.body.appendChild(invoiceDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(invoiceDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove temporary element
    document.body.removeChild(invoiceDiv);

    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    // Remove temporary element in case of error
    if (document.body.contains(invoiceDiv)) {
      document.body.removeChild(invoiceDiv);
    }
    throw error;
  }
}
