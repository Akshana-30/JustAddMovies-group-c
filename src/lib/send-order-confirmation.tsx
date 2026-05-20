// ── Order confirmation email helper ───────────────────────────────
// Thin wrapper around nodemailer that renders the React Email template
// to an HTML string and hands it off to the SMTP transport defined in
// src/lib/email.ts. Kept as a separate module so handleCheckout stays
// focused on business logic and this can be reused elsewhere if needed.
import { pretty, render } from "react-email";
import { transport } from "./email";
import OrderConfirmationEmail from "@/components/emails/order-confirmation-email";
import { OrderConfirmationEmailProps } from "@/components/emails/_types/interfaces";

// ── sendOrderConfirmation ─────────────────────────────────────────
// Accepts the same props as the email template so the caller
// (handleCheckout) does not need to know about rendering details.
// The subject line uses the full cuid(2) order ID to match what
// is displayed in the customer dashboard and the admin panel.
export async function sendOrderConfirmation(props: OrderConfirmationEmailProps) {
    const html = await pretty(await render(<OrderConfirmationEmail {...props} />));
    await transport.sendMail({
        from: '"Just Add Movies" <noreply@justaddmovies.se>',
        to: props.userEmail,
        subject: `Your order #${props.orderId} is confirmed`,
        html,
    });
}
