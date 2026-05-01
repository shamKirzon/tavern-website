import { transporter } from "../lib/transporter";

export async function sendAdminPasswordResetOTP(
  to: string,
  otp: string,
): Promise<void> {
  const subject = "Admin Portal — Password Reset OTP";

  const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #2a2a2a;
      padding: 40px;
      color: #ffffff;
    ">
      <div style="
        max-width: 600px;
        margin: auto;
        background: #1e1e1e;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        overflow: hidden;
        border-top: 4px solid #8A1717;
      ">
        <!-- Header -->
        <div style="background-color: #8A1717; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 2px;">TAV</h1>
          <p style="color: #f0f0f0; margin: 5px 0 0; font-size: 14px;">
            EST. 2008 — Tav Restobar Admin Portal
          </p>
        </div>

        <!-- Admin Badge -->
        <div style="
          background-color: #111;
          text-align: center;
          padding: 10px;
          border-bottom: 1px solid #333;
        ">
          <span style="
            display: inline-block;
            background-color: #f7c331;
            color: #1a1a1a;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 2px;
            padding: 4px 14px;
            border-radius: 20px;
            text-transform: uppercase;
          ">
            Admin Access Only
          </span>
        </div>

        <!-- Body -->
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #f7c331; margin-bottom: 10px;">Password Reset Request</h2>
          <p style="font-size: 15px; color: #d0d0d0; margin-bottom: 6px;">
            A password reset was requested for your <strong>Admin Portal</strong> account.
          </p>
          <p style="font-size: 14px; color: #aaaaaa; margin-bottom: 30px;">
            Use the OTP code below to proceed. It expires in <strong>3 minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="
            display: inline-block;
            background-color: #8A1717;
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 6px;
            padding: 20px 40px;
            border-radius: 12px;
            margin-bottom: 30px;
          ">
            ${otp}
          </div>

          <!-- Warning -->
          <div style="
            background-color: #2c1a1a;
            border: 1px solid #8A1717;
            border-radius: 8px;
            padding: 14px 20px;
            margin-bottom: 24px;
          ">
            <p style="font-size: 13px; color: #f0a0a0; margin: 0;">
              This OTP is strictly for <strong>authorized Tav Restobar admins</strong> only.
              If you did not request this, your account may be at risk —
              please contact your system administrator immediately.
            </p>
          </div>

          <p style="font-size: 14px; color: #bbbbbb; margin-top: 10px;">
            — <strong>Tav Restobar Admin System</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background-color: #1a1a1a;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #777;
        ">
          This email is intended for authorized admin staff only. Do not share this OTP with anyone.
          <br />
          © ${new Date().getFullYear()} Tav Restobar. All rights reserved.
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Tav Restobar Admin System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Admin password reset OTP sent to:", to);
  } catch (error) {
    console.error("Failed to send admin password reset OTP:", error);
  }
}
