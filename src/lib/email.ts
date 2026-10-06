import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

// Ethereal is a fake SMTP catcher (no real inbox receives the mail), so in
// demo mode we surface the Ethereal preview link in the UI instead.
export function isEtherealTransport() {
    return (process.env.SMTP_HOST ?? "").includes("ethereal");
}