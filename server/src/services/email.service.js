const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;

    // Initialize transporter if SMTP credentials are provided
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.isConfigured = true;
      console.log("Email service configured successfully");
    } else {
      console.log(
        "Email service not configured - emails will be logged to console",
      );
    }
  }

  async sendEmail({ to, subject, html, text }) {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Task Manager"}" <${process.env.EMAIL_FROM || "noreply@taskmanager.com"}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    };

    // In development or if SMTP is not configured, log to console
    if (!this.isConfigured || process.env.NODE_ENV === "development") {
      console.log("=== EMAIL (DEV MODE) ===");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Body:", text || html);
      console.log("========================");

      // If not configured, just return success after logging
      if (!this.isConfigured) {
        return {
          success: true,
          message: "Email logged to console (SMTP not configured)",
        };
      }
    }

    // Send actual email if configured
    if (this.isConfigured) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
      }
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Task Manager!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.username}!</h2>
            <p>Thank you for registering with Task Manager. We're excited to have you on board!</p>
            <p>With Task Manager, you can:</p>
            <ul>
              <li>Create and organize your tasks</li>
              <li>Set due dates and track progress</li>
              <li>Mark tasks as complete</li>
              <li>Stay productive and organized</li>
            </ul>
            <p>Get started by logging in and creating your first task!</p>
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Welcome to Task Manager!",
      html,
    });
  }

  async sendTaskCompletedEmail(user, task) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #38ef7d; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Task Completed!</h1>
          </div>
          <div class="content">
            <h2>Great job, ${user.username}!</h2>
            <p>You've successfully completed a task:</p>
            <div class="task-card">
              <h3>${task.title}</h3>
              ${task.description ? `<p>${task.description}</p>` : ""}
              ${task.dueDate ? `<p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>` : ""}
            </div>
            <p>Keep up the great work! 💪</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Task Completed: ${task.title}`,
      html,
    });
  }
}

module.exports = new EmailService();
