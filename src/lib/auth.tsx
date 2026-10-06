import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { pretty, render, toPlainText } from "react-email";
import nodemailer from "nodemailer";
import { transport, isEtherealTransport } from "./email";
import { CAPS } from "./caps";
import { DEMO_EMAILS } from "./demo-accounts";
import VerifyEmail from "@/components/emails/verify-email";
import EmailChange from "@/components/emails/email-change-confirmation";
import RegisterAttempt from "@/components/emails/register-attempt-email";
import WelcomeEmail from "@/components/emails/welcome-email";
import ResetPasswordEmail from "@/components/emails/reset-password-email";

// In demo mode (Ethereal SMTP), save the preview link so the UI can show it
// instead of relying on an email that never reaches a real inbox.
async function savePreviewIfEthereal(email: string, info: unknown) {
    if (!isEtherealTransport()) return;
    const previewUrl = nodemailer.getTestMessageUrl(info as Parameters<typeof nodemailer.getTestMessageUrl>[0]);
    if (!previewUrl) return;
    await prisma.emailPreview.upsert({
        where: { email },
        update: { previewUrl },
        create: { email, previewUrl },
    });
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const auth = betterAuth({
    trustedOrigins: [
        "https://just-add-movies-group-c-woad.vercel.app",
        "http://localhost:3000",
        "http://localhost:3100",
    ],
    rateLimit: {
        enabled: true,
        customRules: {
            "/sign-up": {
                window: 60,
                max: 3,
            },

            "/verify-email": {
                window: 60,
                max: 1,
            },

            "/reset-password": {
                window: 60,
                max: 1,
            }
        }
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        resetPasswordTokenExpiresIn: 1800,

        sendResetPassword: async ({ user, token }) => {
            const manualUrl = `${process.env.BETTER_AUTH_URL}/reset-password/${token}`;

            const html = await pretty(
                await render(<ResetPasswordEmail resetPasswordLink={manualUrl} userName={user.name} websiteName={appName || "Just Add Movies"} />)
            );

            const text = toPlainText(html);

            const info = await transport.sendMail({
                from: '"Just Add Movies" <noreply@justaddmovies.se>',
                to: `${user.name} <${user.email}>`,
                subject: "Reset your password",
                html,
                text,
            });

            await savePreviewIfEthereal(user.email, info);
        },

        onExistingUserSignUp: async ({ user }) => {
            const html = await pretty(
                await render(<RegisterAttempt userName={user.name} userEmail={user.email} />)
            );

            const text = toPlainText(html);

            await transport.sendMail({
                from: '"Just Add Movies" <noreply@justaddmovies.se>',
                to: `${user.name} <${user.email}>`,
                subject: "Register attempt with your email",
                html,
                text,
            });
        }
    },

    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: false,
            redirectTo: "/",

            sendChangeEmailConfirmation: async ({ user, newEmail }) => {
                const manualUrl = `${process.env.BETTER_AUTH_URL}/?email_approval=success`;

                const html = await pretty(
                    await render(<EmailChange confirmEmailLink={manualUrl} newEmailName={newEmail} userName={user.name} />)
                );

                const text = toPlainText(html);

                await transport.sendMail({
                    from: '"Just Add Movies" <noreply@justaddmovies.se>',
                    to: `${user.name} <${user.email}>`,
                    subject: "Approve email change",
                    html,
                    text,
                });
            }
        },
    },

    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendOnSignIn: false,
        expiresIn: 1800,

        sendVerificationEmail: async ({ url, user }) => {
            const html = await pretty(await render(<VerifyEmail verificationLink={url} userName={user.name} websiteName={appName || "Just Add Movies"} />));

            const text = toPlainText(html);

            const info = await transport.sendMail({
                from: '"Just Add Movies" <noreply@justaddmovies.se>',
                to: `${user.name} <${user.email}>`,
                subject: "Verify your email",
                html,
                text,
            });

            await savePreviewIfEthereal(user.email, info);
        },

        async afterEmailVerification(user) {
            const moviesPageUrl = "http://localhost:3000/movies";
            const dashboardPageUrl = "http://localhost:3000/admin-dashboard/dashboard";

            const html = await pretty(await render(<WelcomeEmail userName={user.name} websiteName={appName || "Just Add Movies"} moviesPageLink={moviesPageUrl} dashboardPageLink={dashboardPageUrl} />))
            const text = toPlainText(html);

            await transport.sendMail({
                from: '"Just Add Movies" <noreply@justaddmovies.se>',
                to: `${user.name} <${user.email}>`,
                subject: `Welcome to ${appName || "Just Add Movies"}, ${user.name}!`,
                html,
                text,
            })
        }
    },

    databaseHooks: {
        user: {
            create: {
                before: async () => {
                    const count = await prisma.user.count({ where: { email: { notIn: DEMO_EMAILS } } });
                    if (count >= CAPS.users) {
                        throw new APIError("BAD_REQUEST", {
                            message: `This is a public demo limited to ${CAPS.users} accounts. Please use one of the demo accounts on the sign-in page instead.`,
                        });
                    }
                },
            },
        },
    },

    plugins: [
        admin(),
        nextCookies(),
    ]
})