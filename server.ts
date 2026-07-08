import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // Helper template generator
  function generateAuditEmail(email: string) {
    const userName = email.split("@")[0] || "there";
    const capitalUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
    return `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; background-color: #07070d; color: #f1f5f9; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        <div style="text-align: center; margin-bottom: 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 24px;">
          <div style="display: inline-block; background-color: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; padding: 6px 14px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; font-family: monospace; margin-bottom: 12px;">
            Flowstra AI Operations Engine
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking: -0.025em; line-height: 1.2;">Your Operational Blueprint is Live</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">Custom Strategic Integration Report & Diagnostic</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">Hello ${capitalUserName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">Congratulations! Your Flowstra AI operations audit is complete. Based on your submission, our engine has compiled the optimal blueprint below for your team:</p>

        <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 8px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">01 / The AI Transition Blueprint</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0;">Map all repetitive, rules-bound workflows within your client acquisition funnel. Swap out legacy manual messaging and handoffs with automated API webhook pipes to save hours of administrative labor.</p>
        </div>

        <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 8px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">02 / Priority Operations Focus</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0;">We recommend starting immediately with your <strong>Google Workspace triggers</strong> (Gmail automation & Google Calendar synchronizers) to save up to 10+ hours of administrative overhead this week.</p>
        </div>

        <div style="background-color: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
          <span style="color: #34d399; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace; display: block; margin-bottom: 6px;">Exclusive Scaling Bonus Code</span>
          <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em; display: block; font-family: monospace; margin: 4px 0;">FLOWSTRA20</span>
          <p style="font-size: 12px; color: #94a3b8; margin: 6px 0 0 0; line-height: 1.4;">Enter this voucher code during your service onboarding checkout to unlock an exclusive 20% discount on all premium service deployments.</p>
        </div>

        <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-top: 24px;">To implement these customized operations and scale your company's workflows, schedule a live strategy session with our execution team:</p>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://cal.com/flowstra/30min" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">Schedule 30-Min Strategy Consultation</a>
        </div>

        <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <p style="color: #64748b; font-size: 10px; margin: 0; font-family: monospace;">Sent securely via Flowstra AI Operations Sandbox.</p>
        </div>
      </div>
    `;
  }

  // Dynamic preview endpoint
  app.get("/api/preview-email", (req, res) => {
    const email = (req.query.email as string) || "recipient@example.com";
    const htmlContent = generateAuditEmail(email);
    res.setHeader("Content-Type", "text/html");
    return res.send(htmlContent);
  });

  // Cached Ethereal test account holder
  let cachedTestAccount: any = null;

  // Backend API route to dispatch audit emails
  app.post("/api/send-audit-email", async (req, res) => {
    const { email, customSmtp } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      let smtpHost = customSmtp?.host || process.env.SMTP_HOST;
      let smtpPort = parseInt(customSmtp?.port || process.env.SMTP_PORT || "587");
      let smtpUser = customSmtp?.user || process.env.SMTP_USER;
      let smtpPass = customSmtp?.pass || process.env.SMTP_PASS;
      let smtpFrom = customSmtp?.from || process.env.SMTP_FROM || "Flowstra <no-reply@flowstra.com>";

      let sent = false;
      let previewUrl = `/api/preview-email?email=${encodeURIComponent(email)}`;

      const htmlContent = generateAuditEmail(email);

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: "Your Flowstra AI Operations Audit & Blueprint",
          html: htmlContent,
        });

        sent = true;
      } else {
        console.warn("SMTP credentials not fully provided in environment or request. Mock-sending email using Nodemailer Ethereal SMTP test account.");
        
        let testAccount = cachedTestAccount;
        if (!testAccount) {
          try {
            testAccount = await nodemailer.createTestAccount();
            cachedTestAccount = testAccount;
          } catch (etherealError) {
            console.warn("Failed to create live Ethereal test account, using static fallback:", etherealError);
            testAccount = {
              user: "kristopher.glover39@ethereal.email",
              pass: "NqQ17FpCptV3nqy8U7"
            };
          }
        }

        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await transporter.sendMail({
          from: '"Flowstra Sandbox" <no-reply@flowstra.com>',
          to: email,
          subject: "Your Flowstra AI Operations Audit & Blueprint",
          html: htmlContent,
        });

        sent = true;
        const onlinePreview = nodemailer.getTestMessageUrl(info);
        if (onlinePreview) {
          previewUrl = onlinePreview;
        }
        console.log(`[Flowstra Ethereal Test Inbox URL]: ${previewUrl}`);
      }

      return res.json({ success: true, sent, previewUrl });
    } catch (error: any) {
      console.error("Backend dispatch error:", error);
      // Fallback gracefully to returning the local previewUrl even if sending fails!
      return res.json({ 
        success: true, 
        sent: false, 
        previewUrl: `/api/preview-email?email=${encodeURIComponent(email)}`,
        warning: error.message || "Failed to dispatch email, fell back to local preview" 
      });
    }
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
