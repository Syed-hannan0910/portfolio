const nodemailer  = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const connectDB   = require('../config/db');
const Message     = require('../models/Message');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

exports.sendMessage = async (req, res) => {
  try {
    await connectDB();

    const { name, email, subject, message } = req.body;
    const safeName    = sanitizeHtml(name,    { allowedTags: [] });
    const safeSubject = sanitizeHtml(subject || 'Portfolio Contact', { allowedTags: [] });
    const safeMessage = sanitizeHtml(message, { allowedTags: [] });

    // Save to MongoDB
    const doc = await Message.create({
      name:    safeName,
      email:   email.toLowerCase().trim(),
      subject: safeSubject,
      message: safeMessage,
      ip:      req.headers['x-forwarded-for'] || req.ip || 'unknown'
    });

    // Send emails (non-blocking — don't fail the response if email fails)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();

        await transporter.sendMail({
          from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `[Portfolio] ${safeSubject}`,
          html: `
            <div style="font-family:sans-serif;max-width:580px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <div style="background:#2a1a09;padding:22px 28px;">
                <h2 style="color:#c8973a;margin:0;font-size:1.2rem;">New Portfolio Message</h2>
              </div>
              <div style="padding:24px 28px;background:#fff;">
                <p><strong>From:</strong> ${safeName} &lt;${email}&gt;</p>
                <p><strong>Subject:</strong> ${safeSubject}</p>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
                <p style="white-space:pre-wrap;color:#374151;">${safeMessage}</p>
              </div>
              <div style="background:#f8fafc;padding:10px 28px;color:#94a3b8;font-size:0.75rem;">
                Message ID: ${doc._id}
              </div>
            </div>
          `
        });

        await transporter.sendMail({
          from:    `"Syed Hannan Sarmadi" <${process.env.EMAIL_USER}>`,
          to:      email,
          subject: `Got your message, ${safeName.split(' ')[0]}! ☕`,
          html: `
            <div style="font-family:sans-serif;max-width:580px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <div style="background:#2a1a09;padding:22px 28px;">
                <h2 style="color:#c8973a;margin:0;">Thanks for reaching out!</h2>
              </div>
              <div style="padding:24px 28px;background:#fff;">
                <p>Hey ${safeName.split(' ')[0]},</p>
                <p>I've received your message and will get back to you within 24–48 hours.</p>
                <p>Feel free to explore my work on <a href="https://github.com/Syed-hannan0910" style="color:#c8973a;">GitHub</a> in the meantime.</p>
                <br><p>— Hannan</p>
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        // Email failure should not fail the API response
        console.error('[Email error]', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message received! I'll reply within 24–48 hours. ☕"
    });

  } catch (err) {
    console.error('[contactController]', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};
