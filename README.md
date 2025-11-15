# Chat App & Educational Management System

A comprehensive Node.js Express application for managing educational institutions with integrated real-time chat functionality, teacher management, scheduling, and payment systems.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Email Setup](#email-setup)
- [Troubleshooting](#troubleshooting)
- [Dependencies](#dependencies)
- [Author](#author)

## ✨ Features

- **User Authentication & Authorization**

  - Secure login and signup with bcrypt password hashing
  - Email verification system using Nodemailer
  - Role-based access control (gestionnaire, enseignant)
  - Session-based authentication with secure cookies

- **Real-Time Chat**

  - Socket.io integration for real-time messaging
  - Friend messaging
  - Group chat functionality
  - Home chat interface

- **Educational Management**

  - Teacher (Enseignant) profiles and management
  - Student grouping and promotion management
  - Absence tracking and reporting
  - Class schedule (Emploi de Temps) management
  - Session scheduling
  - Classroom (Salle) management
  - Course module management

- **Payment System**

  - Teacher payment processing and records
  - Payment slip generation and viewing
  - Supplementary hours (heures supplémentaires) tracking
  - Teaching load calculation and management

- **Admin Dashboard**
  - Comprehensive dashboard for administrators
  - User management interface
  - System overview and data management

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js v4.21.2
- **Database**: MongoDB with Mongoose ODM v8.19.4
- **Frontend**: EJS templating engine
- **Real-Time**: Socket.io for real-time communication
- **Authentication**: bcrypt v5.1.1 for password hashing, express-session v1.18.2
- **Validation**: express-validator v7.3.0 and Joi v17.13.3
- **Email**: Nodemailer v7.0.10 (Gmail with App Password)
- **File Upload**: Multer v1.4.5-lts.2
- **Utilities**: Moment.js v2.30.1, UUID v9.0.1
- **Environment**: Dotenv v16.6.1

## 🚀 Quick Start

```bash
# 1. Clone/download the project
cd "d:\amine things\course\hs"

# 2. Install dependencies
npm install

# 3. Configure environment variables (see Configuration section)
# Create/update .env file

# 4. Start MongoDB
mongod

# 5. Run the application
node app.js

# Application available at http://localhost:3000
```

## 📦 Installation

### Prerequisites

- Node.js v14 or higher
- MongoDB (running on localhost:27017)
- npm
- Gmail account (for email verification)

### Steps

1. **Clone or download the project**

   ```bash
   cd "d:\amine things\course\hs"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (see Configuration section)

4. **Ensure MongoDB is running**

   ```bash
   mongod --dbpath your_db_path
   ```

5. **Start the application**
   ```bash
   node app.js
   ```
   The application will be available at `http://localhost:3000`

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
# Database
DB_URL=mongodb://localhost:27017/hs

# Session Configuration
SESSION_SECRET=your-secure-session-secret-here

# Gmail Configuration (for email verification)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password

# Server
PORT=3000
NODE_ENV=development
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Visit https://myaccount.google.com/apppasswords
3. Generate an app password for Mail
4. Copy the 16-character password to `EMAIL_PASS` in `.env`

See `EMAIL_SETUP_GUIDE.md` for detailed instructions.

## 📁 Project Structure

```
hs/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies and metadata
├── .env                            # Environment variables (create this)
├── .gitignore                      # Git ignore file
├── README.md                       # This file
├── EMAIL_SETUP_GUIDE.md           # Email configuration guide
├── REDIRECT_LOOP_FIX.md           # Authentication troubleshooting
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── main.css
│   └── js/
│       ├── bootstrap.min.js
│       ├── jquery.min.js
│       ├── popper.min.js
│       └── sockets/
│           ├── chat.js
│           ├── friend.js
│           ├── group.js
│           ├── home.js
│           └── init.js
├── controllers/
│   ├── auth.controller.js
│   └── chargeEnseignement.controller.js
├── middleware/
│   └── flash.js                    # Custom flash messages (replaces deprecated package)
├── models/
│   ├── user.model.js
│   ├── auth.model.js
│   ├── absence.model.js
│   ├── emploiTemps.model.js
│   ├── enseignant.model.js
│   ├── groupe.model.js
│   ├── heuresSupplementaires.model.js
│   ├── module.model.js
│   ├── payment.model.js
│   ├── promotion.model.js
│   ├── salle.model.js
│   ├── session.model.js
│   ├── userVerification.js
│   └── emailExamples.js            # Email sending examples
├── routes/
│   ├── auth.route.js
│   ├── dashboard.route.js
│   ├── emploiTempsRouter.route.js
│   ├── absence.route.js
│   ├── payment.route.js
│   └── guards/
│       ├── auth.guard.js           # Authentication middleware (enhanced)
│       └── role.guard.js
├── views/
│   ├── login.ejs
│   ├── signUp.ejs
│   ├── dashboard.ejs
│   ├── verificationEmailSent.ejs
│   ├── verified.ejs
│   ├── absenceForm.ejs
│   ├── emploiTemps.ejs
│   ├── gestion-emploi-temps.ejs
│   ├── saisie_emploi_temps_enseignant.ejs
│   ├── enseignants.ejs
│   ├── charge.ejs
│   ├── teacherPaymentSlip.ejs
│   ├── error.ejs
│   ├── not-found.ejs
│   └── parts/
│       ├── header.ejs
│       ├── navbar.ejs
│       ├── scripts.ejs
│       └── sideBar.html
└── images/                         # Image assets directory
```

## 🚀 Usage

### Authentication Flow

1. User visits `/signUp` to create account
2. Receives verification email at provided address
3. Clicks verification link to verify email
4. Logs in with credentials at `/login`
5. Session created and stored in MongoDB
6. Redirected to dashboard based on role

### User Roles

| Role             | Access                                                |
| ---------------- | ----------------------------------------------------- |
| **Gestionnaire** | Full system access, manage schedules, payments, users |
| **Enseignant**   | View own schedule, report absence, view payment info  |
| **Admin**        | System configuration and user management              |

### Common Routes

| Route                   | Description                              |
| ----------------------- | ---------------------------------------- |
| `/login`                | User login page                          |
| `/signUp`               | User registration page                   |
| `/dashboard`            | Main dashboard (requires authentication) |
| `/gestion-emploi-temps` | Schedule management (gestionnaire only)  |
| `/teacher-absence`      | Absence reporting                        |
| `/payment`              | Payment information                      |
| `/logout`               | User logout                              |

## 📧 Email Setup

The application sends verification emails using Nodemailer with Gmail.

**Quick Setup:**

1. Follow Gmail App Password setup in Configuration section
2. Add credentials to `.env`
3. Test by signing up for an account

**Full Details:** See `EMAIL_SETUP_GUIDE.md`

### Sending Custom Emails

See `models/emailExamples.js` for 5 complete examples:

- Simple email
- Multiple recipients with CC/BCC
- Email with attachments
- Bulk emails
- Styled HTML emails

## 🔍 Troubleshooting

### Redirect Loop / Authentication Issues

- Clear browser cookies
- Ensure MongoDB is running
- Check `.env` configuration
- See `REDIRECT_LOOP_FIX.md` for detailed debugging

### Email Not Sending

- Verify Gmail credentials in `.env`
- Ensure you're using App Password, not regular password
- Check that 2FA is enabled on Gmail
- See `EMAIL_SETUP_GUIDE.md`

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check `DB_URL` in `.env` is correct
- Verify MongoDB is accessible on localhost:27017

### Port Already in Use

```bash
# Kill process using port 3000 (Windows PowerShell)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Then restart
node app.js
```

## 📚 Dependencies

All dependencies are up-to-date and audited for security:

```json
{
  "express": "^4.21.2",
  "mongoose": "^8.19.4",
  "bcrypt": "^5.1.1",
  "nodemailer": "^7.0.10",
  "express-session": "^1.18.2",
  "ejs": "^3.1.10",
  "joi": "^17.13.3",
  "multer": "^1.4.5-lts.2",
  "moment": "^2.30.1",
  "dotenv": "^16.6.1",
  "express-validator": "^7.3.0",
  "mongodb": "^6.21.0",
  "uuid": "^9.0.1",
  "body-parser": "^1.20.3",
  "connect-mongodb-session": "^3.1.1"
}
```

**Security Status:** ✅ 0 vulnerabilities

## 📝 Important Notes

- **No Deprecated APIs:** Custom flash middleware replaces deprecated `connect-flash`
- **Secure Sessions:** Cookies are HttpOnly and have proper expiration
- **Email Verification:** Required for account activation
- **Role-Based Access:** Separate views and routes for different user types
- **Database:** MongoDB with Mongoose ODM for data persistence

## ✨ Recent Improvements

✅ Fixed redirect loop in authentication flow
✅ Replaced deprecated flash middleware with custom implementation
✅ Updated all dependencies to latest versions (0 vulnerabilities)
✅ Enhanced session configuration with secure cookies
✅ Gmail integration with App Password support
✅ Added comprehensive error handling

## 👤 Author

**Mohamed Lamine OULAD SAID**

Email: m.ouladsaid@esi-sba.dz

## 📄 License

ISC

---

**Last Updated:** November 15, 2025

For support or questions, please contact the project author.
