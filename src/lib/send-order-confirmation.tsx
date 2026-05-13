import { render } from "react-email";
import { transport } from "./email";
import {
    OrderConfirmationEmail,
    type OrderConfirmationEmailProps,
} from "@/components/emails/order-confirmation-email";

export async function sendOrderConfirmation(props: OrderConfirmationEmailProps) {
    const html = await render(<OrderConfirmationEmail {...props} />);
    await transport.sendMail({
        from:    '"Just Add Movies" <noreply@justaddmovies.se>',
        to:      props.userEmail,
        subject: `Your order #${props.orderId} is confirmed`,
        html,
    });
}