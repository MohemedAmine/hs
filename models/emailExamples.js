/**
 * Email Utility Examples
 * This file demonstrates how to use the sendEmail function from auth.model.js
 */

const authModel = require('./auth.model');

// ============================================
// EXAMPLE 1: Send Simple Email
// ============================================
async function sendSimpleEmail() {
  try {
    await authModel.sendEmail({
      to: 'recipient@example.com',
      subject: 'Welcome!',
      text: 'Hello! This is a simple email.',
      html: '<h1>Welcome!</h1><p>This is a simple email.</p>',
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// ============================================
// EXAMPLE 2: Send Email to Multiple Recipients
// ============================================
async function sendToMultipleRecipients() {
  try {
    await authModel.sendEmail({
      to: ['user1@example.com', 'user2@example.com'],
      cc: 'manager@example.com',
      bcc: 'archive@example.com',
      subject: 'Team Announcement',
      html: '<h2>Important Announcement</h2><p>Please read this carefully.</p>',
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// ============================================
// EXAMPLE 3: Send Email with Attachments
// ============================================
async function sendEmailWithAttachments() {
  try {
    await authModel.sendEmail({
      to: 'recipient@example.com',
      subject: 'Your Documents',
      html: '<h2>Please find your documents attached.</h2>',
      attachments: [
        {
          filename: 'document.pdf',
          path: '/path/to/document.pdf', // File path
        },
        {
          filename: 'image.png',
          content: Buffer.from('...'), // Buffer content
        },
      ],
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// ============================================
// EXAMPLE 4: Send Bulk Emails
// ============================================
async function sendBulkEmails() {
  const recipients = [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' },
  ];

  for (const recipient of recipients) {
    try {
      await authModel.sendEmail({
        to: recipient.email,
        subject: `Hello ${recipient.name}!`,
        html: `<p>Hi ${recipient.name}, this is a personalized email.</p>`,
      });
      console.log(`✅ Email sent to ${recipient.email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${recipient.email}:`, error);
    }
  }
}

// ============================================
// EXAMPLE 5: Send HTML Email with Styling
// ============================================
async function sendStyledEmail() {
  try {
    await authModel.sendEmail({
      to: 'recipient@example.com',
      subject: 'Payment Confirmation',
      html: `
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; }
          .content { padding: 20px; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; }
        </style>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for your payment!</p>
            <p><strong>Amount:</strong> $99.99</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

module.exports = {
  sendSimpleEmail,
  sendToMultipleRecipients,
  sendEmailWithAttachments,
  sendBulkEmails,
  sendStyledEmail,
};
