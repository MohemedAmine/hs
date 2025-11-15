# Email Setup Guide - Gmail with Nodemailer

## Overview

Your application has been updated to use Gmail with Nodemailer for sending verification emails and other notifications. This guide will help you set it up.

## Prerequisites

- Gmail account
- Node.js with Nodemailer installed (already done)
- `.env` file created (already done)

---

## Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", enable **2-Step Verification**
4. Follow the prompts to set it up

### Step 2: Create an App Password

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Scroll down to **App passwords** (only visible if 2FA is enabled)
4. Select **Mail** and **Windows PC** (or your OS)
5. Google will generate a 16-character password
6. **Copy this password** (you won't see it again)

### Step 3: Update .env File

Open the `.env` file in your project root and update:

```env
EMAIL_USER=your-gmail-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

Replace:

- `your-gmail-email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the 16-character app password (remove spaces if any)

### Step 4: Restart Your Application

```bash
node app.js
```

You should see: ✅ Transporter ready for messages

---

## Features Available

### 1. Send Simple Email

```javascript
const authModel = require('./models/auth.model');

await authModel.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello!</h1>',
});
```

### 2. Send to Multiple Recipients

```javascript
await authModel.sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  cc: 'manager@example.com',
  bcc: 'archive@example.com',
  subject: 'Team Message',
  html: '<p>Message content</p>',
});
```

### 3. Send with Attachments

```javascript
await authModel.sendEmail({
  to: 'user@example.com',
  subject: 'Documents',
  html: '<p>See attached</p>',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/file.pdf',
    },
  ],
});
```

### 4. Plain Text and HTML

```javascript
await authModel.sendEmail({
  to: 'user@example.com',
  subject: 'Update',
  text: 'Plain text version',
  html: '<h1>HTML version</h1>',
});
```

---

## Troubleshooting

### Error: "Invalid login credentials"

- ✓ Verify your EMAIL_USER and EMAIL_PASS are correct in `.env`
- ✓ Ensure you're using the App Password, not your regular Gmail password
- ✓ Check that 2FA is enabled on your Gmail account

### Error: "Authentication required"

- ✓ Make sure the App Password is correct
- ✓ The App Password should be 16 characters (can include spaces, which are ignored)
- ✓ Verify EMAIL_USER is your complete Gmail address

### Emails not being sent

- ✓ Check the console logs for error messages
- ✓ Verify both EMAIL_USER and EMAIL_PASS are set in `.env`
- ✓ Make sure your `.env` file has no quotes around values unless intentional

### "Less secure app access" errors

- ✓ This shouldn't occur with Gmail App Passwords
- ✓ If you see this, you're using the wrong password (use App Password, not Gmail password)

---

## Email Sending Examples

See `models/emailExamples.js` for 5 complete working examples:

1. Simple email
2. Multiple recipients with CC/BCC
3. Attachments
4. Bulk emails
5. Styled HTML emails

---

## Security Notes

⚠️ **Important:**

- Never commit your `.env` file to version control
- Add `.env` to `.gitignore`
- The App Password is equivalent to a password - keep it secret
- Consider rotating the App Password periodically

---

## File Changes Summary

✅ **Updated Files:**

- `models/auth.model.js` - Added Gmail transporter and generic sendEmail function
- `.env` - Updated with Gmail credentials template

✅ **New Files:**

- `models/emailExamples.js` - 5 working examples

---

## Next Steps

1. Set up your Gmail App Password (follow Step 1-2 above)
2. Update your `.env` file with credentials
3. Restart the application
4. Test by signing up for an account - you should receive a verification email

Good luck! 🚀
