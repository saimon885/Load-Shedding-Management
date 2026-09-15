import path from "path";
import ejs from "ejs";
import { transporter } from "../lib/nodemailer";
import config from "../config";

interface OutageEmailData {
  emails: string[];
  areaName: string;
  type: string;
  reason: string;
  startTime: string;
  estimatedRestorationTime?: string;
}

export const sendOutageAlertEmail = async (data: OutageEmailData) => {
  if (!data.emails || data.emails.length === 0) return;

  const templatePath = path.join(
    process.cwd(),
    "/src/templates/outage.alert.template.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    areaName: data.areaName,
    type: data.type,
    reason: data.reason,
    startTime: new Date(data.startTime).toLocaleString(),
    estimatedRestorationTime: data.estimatedRestorationTime
      ? new Date(data.estimatedRestorationTime).toLocaleString()
      : null,
    year: new Date().getFullYear(),
  });
  await transporter.sendMail({
    from: config.email_sender,
    to: data.emails,
    subject: `Outage Alert🚨🚨`,
    html,
  });
};
