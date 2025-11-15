const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user.model').User;
const userVerification = require('../models/userVerification');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const DB_URL = 'mongodb://localhost:27017/hs';
mongoose.connect(DB_URL);

// Gmail Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Transporter ready for messages');
  }
});

/**
 * Send a generic email with support for multiple recipients, CC, BCC, and attachments
 * @param {Object} mailOptions - Email options
 * @param {string|string[]} mailOptions.to - Recipient(s)
 * @param {string|string[]} [mailOptions.cc] - CC recipient(s)
 * @param {string|string[]} [mailOptions.bcc] - BCC recipient(s)
 * @param {string} mailOptions.subject - Email subject
 * @param {string} [mailOptions.text] - Plain text content
 * @param {string} [mailOptions.html] - HTML content
 * @param {Object[]} [mailOptions.attachments] - Array of attachments
 * @returns {Promise}
 */
exports.sendEmail = async (mailOptions) => {
  try {
    // Ensure from is set
    if (!mailOptions.from) {
      mailOptions.from = process.env.EMAIL_USER;
    }

    console.log(
      `📧 Sending email to: ${
        Array.isArray(mailOptions.to)
          ? mailOptions.to.join(', ')
          : mailOptions.to
      }`
    );

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};

/**
 * Send verification email
 * @param {Object} user - User object with _id and email
 * @param {Object} res - Express response object
 */
exports.sendVerificationEmail = async ({ _id, email }, res) => {
  const currentUrl = 'http://localhost:3000/';
  const uniqueString = uuidv4() + _id;
  const hashUniqueString = await bcrypt.hash(uniqueString, 10);

  try {
    const newVerification = new userVerification({
      userId: _id,
      uniqueString: hashUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000, // 6 hours
    });
    await newVerification.save();

    const verificationLink = `${currentUrl}verify/${_id}/${uniqueString}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email Address',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `
        <h2>Email Verification</h2>
        <p>Welcome! Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p>This link will expire in 6 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `,
    };

    await this.sendEmail(mailOptions);
    res.render('verificationEmailSent');
  } catch (error) {
    console.error('❌ Error in sendVerificationEmail:', error.message);
    res.status(500).json({
      status: 'FAILED',
      message: "Couldn't send verification email",
      error: error.message,
    });
  }
};

exports.createNewUser = (userName, email, password) => {
  //check if email exists
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        User.findOne({ email: email })
          .then((user) => {
            if (user) {
              reject('Email is used');
            } else {
              bcrypt
                .hash(password, 10)
                .then((hashedPassword) => {
                  let newUser = new User({
                    username: userName,
                    email: email,
                    password: hashedPassword,
                    verified: false,
                  });
                  newUser
                    .save()
                    .then((value) => {
                      resolve(value);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => reject(err));
  });
};

exports.login = (email, password) => {
  // check for email
  // no ===> error
  // yes ===> check for password
  // no ===> error
  //yes ===> set session

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              reject('There is no user matches this email');
            } else {
              if (!user.verified) {
                reject('Email is not verified');
              } else {
                bcrypt.compare(password, user.password).then((same) => {
                  if (!same) {
                    reject('Password is incorrect');
                  } else {
                    resolve(user);
                  }
                });
              }
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => reject(err));
  });
};

exports.getEmailByid = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        User.findOne({ _id: id })
          .then((user) => resolve(user.email))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};
