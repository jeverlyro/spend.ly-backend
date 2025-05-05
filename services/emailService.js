const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendSupportTicket(data) {
    const { subject, message, category, email, name } = data;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TARGET_EMAIL,
      subject: `Support Ticket [${category}]: ${subject}`,
      html: `
        <h2>Support Ticket from Spend.ly</h2>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>From:</strong> ${name || "User"} (${
        email || "No email provided"
      })</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send support ticket email");
    }
  }
}

module.exports = new EmailService();
