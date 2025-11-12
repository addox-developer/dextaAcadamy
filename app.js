const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());



app.post("/api/send-application", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    education,
    location,
    planToJoin,
    careerGoal,
  } = req.body;

  try {
    // ✅ Create SMTP transporter (recommended way)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // must be App Password
      },
    });

    // ✅ Email content to admin
    const adminMailOptions = {
      from: `"DEXTA Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Application from ${fullName} - DEXTA Academy`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb; text-align: center;">New Student Application Received</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">

        <h3 style="color: #1e293b; margin-bottom: 16px;">Applicant Details:</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="background: #e2e8f0;">
            <td style="padding: 10px; font-weight: 600; width: 40%;">Full Name</td>
            <td style="padding: 10px;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600;">Email</td>
            <td style="padding: 10px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 10px; font-weight: 600;">Phone</td>
            <td style="padding: 10px;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600;">Education</td>
            <td style="padding: 10px;">${education}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 10px; font-weight: 600;">Location</td>
            <td style="padding: 10px;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600;">Plan to Join</td>
            <td style="padding: 10px;">${planToJoin}</td>
          </tr>
          <tr style="background: #e2e8f0;">
            <td style="padding: 10px; font-weight: 600;">Career Goal</td>
            <td style="padding: 10px;">${careerGoal}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600;">Submitted At</td>
            <td style="padding: 10px;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

      </div>
    </div>
  `,
      text: `
New Student Application - DEXTA Academy

Applicant Details:
Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Education: ${education}
Location: ${location}
Plan to Join: ${planToJoin}
Career Goal: ${careerGoal}
Submitted At: ${new Date().toLocaleString()}
  `,
    };

    // ✅ Send the email
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
});

module.exports = app;
