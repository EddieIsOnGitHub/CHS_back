// routes/email.js
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');

router.post('/send-lead-email', async (req, res) => {
  const {
    type = "staffing", // Default to staffing if not provided
    firstName,
    lastName,
    email,
    organization,
    phone,
    industry,
    position,
    time,
    message // Used for EMR submissions
  } = req.body;

  const fullName = `${firstName} ${lastName}`;

  // Validation
  if (!email || !fullName || !organization || !phone || !time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Message formatting
  let formattedMessage = "";
  let subjectPrefix = "";

  if (type === "emr") {

    // EMR submission
    formattedMessage = message || "No message provided.";
    subjectPrefix = "EMR Submission";
    console.log("Received EMR submission:", { fullName, email, organization });
  } else {

    // Staffing submission
    formattedMessage = `
Staffing Submission

Organization: ${organization}
Name:         ${fullName}
Email:        ${email}
Phone:        ${phone}

Industry:     ${industry}
Position:     ${position}
Best Time:    ${time}
    `.trim();
    subjectPrefix = "Staffing Lead";
    console.log("Received staffing submission:", {
      organization,
      fullName,
      email,
      phone,
      industry,
      position,
      time
    });
  }

  // Send email
  try {
    await transporter.sendMail({
      from: `"Lead Bot" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `${subjectPrefix} from ${fullName}`,
      text: formattedMessage
    });

    return res.status(200).json({ success: true, message: 'Email sent.' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
});
module.exports = router;
