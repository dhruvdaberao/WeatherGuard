import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  async sendApprovalEmail(userEmail: string, userName?: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL') || 'dumbotteroffical@gmail.com';

    if (!apiKey) {
      this.logger.warn(`BREVO_API_KEY is not configured in environment. Skipping approval email to ${userEmail}`);
      return false;
    }

    const loginUrl = 'https://weather-guard-two.vercel.app/login';
    const recipientName = userName || 'WeatherGuard User';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved - WeatherGuard</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      border: 1px solid #334155;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 35px 30px;
    }
    .content h2 {
      color: #38bdf8;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      line-height: 1.6;
      color: #cbd5e1;
      font-size: 15px;
    }
    .badge {
      display: inline-block;
      background-color: #065f46;
      color: #34d399;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
    }
    .steps {
      background: #0f172a;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #38bdf8;
      margin: 25px 0;
    }
    .steps ol {
      margin: 0;
      padding-left: 20px;
      color: #94a3b8;
    }
    .steps li {
      margin-bottom: 10px;
    }
    .footer {
      background: #0f172a;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #334155;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌤️ WeatherGuard Intelligence</h1>
    </div>
    <div class="content">
      <div class="badge">✅ Access Approved</div>
      <h2>Welcome aboard, ${recipientName}!</h2>
      <p>Great news! Your registration request has been reviewed and officially approved by the WeatherGuard Administrator.</p>
      <p>You now have full access to our high-precision meteorological telemetry and automated 24/7 weather dispatches.</p>
      
      <div class="steps">
        <strong style="color: #f8fafc; display: block; margin-bottom: 10px;">⚡ Next Steps to Activate Alerts:</strong>
        <ol>
          <li>Click the login button below to enter your dashboard.</li>
          <li>Go to your <strong>Preferences</strong> and click <strong>Connect Telegram</strong>.</li>
          <li>Start the bot to activate your automated 1x–6x daily meteorological dispatches!</li>
        </ol>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Login to WeatherGuard Dashboard →</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${loginUrl}" style="color: #38bdf8;">${loginUrl}</a></p>
    </div>
    <div class="footer">
      &copy; 2026 WeatherGuard Intelligence Systems. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'WeatherGuard Intelligence', email: senderEmail },
          to: [{ email: userEmail, name: recipientName }],
          subject: '🎉 Your WeatherGuard Account Has Been Approved!',
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Brevo API error (${response.status}): ${errorText}`);
        return false;
      }

      this.logger.log(`Approval email successfully sent to ${userEmail} via Brevo`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send approval email to ${userEmail}: ${error.message}`);
      return false;
    }
  }
}
