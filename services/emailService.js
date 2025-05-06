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
    const { subject, message, category, email, name, attachment } = data;

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

    // Add attachment if it exists
    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.originalname,
          content: attachment.buffer,
        },
      ];
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send support ticket email");
    }
  }

  async sendVerificationEmail(email, name, otp) {
    try {
      const mailOptions = {
        from: `"Spend.ly" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verifikasi Email Anda",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #3b82f6;">Spend.ly</h2>
              <p style="color: #4b5563; font-size: 16px;">Aplikasi Pengelolaan Keuangan Pribadi</p>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #111827; margin-top: 0;">Halo, ${name}!</h3>
              <p style="color: #4b5563; font-size: 15px;">Terima kasih telah mendaftar di Spend.ly. Untuk menyelesaikan pendaftaran, masukkan kode verifikasi berikut:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 12px 24px; background-color: #f3f4f6; border-radius: 8px; letter-spacing: 4px; font-size: 24px; font-weight: bold; color: #1f2937; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #4b5563; font-size: 14px;">Kode ini akan kedaluwarsa dalam 15 menit.</p>
              <p style="color: #4b5563; font-size: 14px;">Jika Anda tidak mendaftar di Spend.ly, abaikan email ini.</p>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 13px;">
              <p>&copy; 2024 Spend.ly. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`Error sending verification email to ${email}:`, error);
      throw error;
    }
  }
}

module.exports = new EmailService();
