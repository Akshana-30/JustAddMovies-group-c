// ── Order confirmation email template ─────────────────────────────
// Built with react-email so the layout is written as JSX and rendered
// to a plain HTML string at send time. The Tailwind preset (pixel-based)
// is used instead of CSS variables because email clients do not support
// custom properties — all colours must be hardcoded hex values.
import {
    Body,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Img,
    pixelBasedPreset,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "react-email";

// ── formatPrice ───────────────────────────────────────────────────
// Prices in the database are stored in öre (e.g. 8900 = 89 kr).
// formatPrice divides by 100 and formats with the Swedish locale so
// the email matches the prices shown in the storefront.
import { formatPrice } from "@/lib/format";

// ── Props ─────────────────────────────────────────────────────────
// Exported so send-order-confirmation.tsx can reuse the same type
// without duplicating the shape in two places.
export interface OrderConfirmationEmailProps {
    userName:  string;
    userEmail: string;
    orderId:   string;
    items:     { title: string; quantity: number; price: number }[];
    total:     number;
    shippingAddress: { street: string; city: string; zip: string };
}

// ── Base URL ──────────────────────────────────────────────────────
// Email clients cannot resolve relative paths, so images require an
// absolute URL. On Vercel the environment variable is set automatically;
// locally BETTER_AUTH_URL (defined in .env) is used as the fallback so
// the logo resolves to http://localhost:3000/JAM.png during development.
const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.BETTER_AUTH_URL ?? "http://localhost:3000");

// ── Template ──────────────────────────────────────────────────────
export const OrderConfirmationEmail = ({
                                           userName,
                                           orderId,
                                           items,
                                           total,
                                           shippingAddress,
                                       }: OrderConfirmationEmailProps) => (
    <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Html>
            <Head />
            <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                {/* Preview text shown in inbox before opening the email */}
                <Preview>Your order #{orderId} is confirmed!</Preview>

                <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">

                    {/* ── Logo ─────────────────────────────────────────────── */}
                    {/* JAM.png is served from /public and referenced via an    */}
                    {/* absolute URL so it loads in all email clients.           */}
                    <Img
                        src={`${baseUrl}/JAM.png`}
                        width="40"
                        height="33"
                        alt="Just Add Movies logo"
                    />

                    {/* ── Greeting ─────────────────────────────────────────── */}
                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Hi {userName},
                        </Text>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Thank you for your order! Here&apos;s your summary:
                        </Text>
                        {/* Full cuid(2) ID shown to match the customer dashboard */}
                        <Text className="text-xs font-medium text-[#706a7b] uppercase tracking-wider">
                            Order #{orderId}
                        </Text>
                    </Section>

                    <Hr className="border-[#f0f0f0] my-4" />

                    {/* ── Order items ──────────────────────────────────────── */}
                    {/* Price per line = unit price × quantity, both in öre,   */}
                    {/* formatted to Swedish kronor by formatPrice.             */}
                    <Section>
                        {items.map((item, i) => (
                            <Row key={i} className="py-1">
                                <Column className="flex-1">
                                    <Text className="text-sm text-[#404040] m-0">
                                        {item.title}{" "}
                                        <span className="text-[#706a7b]">× {item.quantity}</span>
                                    </Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="text-sm font-medium text-[#404040] m-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr className="border-[#f0f0f0] my-4" />

                    {/* ── Order total ───────────────────────────────────────── */}
                    <Section>
                        <Row>
                            <Column className="flex-1">
                                <Text className="text-base font-semibold text-[#404040] m-0">
                                    Total
                                </Text>
                            </Column>
                            <Column className="text-right">
                                <Text className="text-base font-semibold text-[#404040] m-0">
                                    {formatPrice(total)}
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr className="border-[#f0f0f0] my-4" />

                    {/* ── Shipping ──────────────────────────────────────────── */}
                    {/* The address is collected in the payment form and passed  */}
                    {/* through handleCheckout so the customer can verify where  */}
                    {/* their order will be delivered. Shipping is always free.  */}
                    <Section>
                        <Row>
                            <Column className="flex-1">
                                <Text className="text-base font-semibold text-[#404040] m-0">
                                    Shipping
                                </Text>
                            </Column>
                            <Column className="text-right">
                                <Text className="text-base font-semibold text-[#4ade80] m-0">
                                    Free
                                </Text>
                            </Column>
                        </Row>
                        <Text className="text-sm text-[#706a7b] mt-2 mb-0">
                            {shippingAddress.street}<br />
                            {shippingAddress.zip} {shippingAddress.city}
                        </Text>
                    </Section>

                    <Hr className="border-[#f0f0f0] my-4" />

                    {/* ── Sign-off ──────────────────────────────────────────── */}
                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Happy movie time!
                        </Text>
                    </Section>
                </Container>

                {/* ── Footer ────────────────────────────────────────────── */}
                <Section className="max-w-145 mx-auto">
                    <Row>
                        <Text className="text-center text-[#706a7b]">
                            © 2026 Just Add Movies, All Rights Reserved <br />
                            Teknikringen 10, 2nd Floor, Linköping, 58330 - Sweden
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
    </Tailwind>
);

// ── Preview props ─────────────────────────────────────────────────
// Used by the react-email dev server (npm run email:dev) to render a
// realistic preview at http://localhost:3001 without placing a real order.
OrderConfirmationEmail.PreviewProps = {
    userName:  "Alan",
    userEmail: "alan@example.com",
    orderId:   "abc123def456xyz",
    items: [
        { title: "The Matrix",  quantity: 1, price: 999  },
        { title: "Inception",   quantity: 2, price: 1299 },
    ],
    total: 3597,
    shippingAddress: { street: "Teknikringen 10", city: "Linköping", zip: "58330" },
} as OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
