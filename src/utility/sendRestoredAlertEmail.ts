import path from "path";
import ejs from "ejs";
import { transporter } from "../lib/nodemailer";
import config from "../config";

interface RestoredEmailData {
  emails: string[];
  areaName: string;
  restorationTime: string;
  restorationNote?: string;
}

export const sendRestoredAlertEmail = async (data: RestoredEmailData) => {
  if (!data.emails || data.emails.length === 0) return;

  const templatePath = path.join(
    process.cwd(),
    "/src/templates/outage.restored.template.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    areaName: data.areaName,
    restorationTime: new Date(data.restorationTime).toLocaleString(),
    restorationNote: data.restorationNote || null,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: data.emails,
    subject: `[RESTORED] Power Supply Restored in ${data.areaName}`,
    html,
  });
};
