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
import { formatPrice } from "@/lib/format";

export interface OrderConfirmationEmailProps {
    userName:  string;
    userEmail: string;
    orderId:   string;
    items:     { title: string; quantity: number; price: number }[];
    total:     number;
    shippingAddress: { street: string; city: string; zip: string };
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.BETTER_AUTH_URL ?? "http://localhost:3000");

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
                <Preview>Your order #{orderId} is confirmed!</Preview>

                <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">
                    <Img
                        src={`${baseUrl}/JAM.png`}
                        width="40"
                        height="33"
                        alt="Just Add Movies logo"
                    />

                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Hi {userName},
                        </Text>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Thank you for your order! Here&apos;s your summary:
                        </Text>
                        <Text className="text-xs font-medium text-[#706a7b] uppercase tracking-wider">
                            Order #{orderId}
                        </Text>
                    </Section>

                    <Hr className="border-[#f0f0f0] my-4" />

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

                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Happy movie time!
                        </Text>
                    </Section>
                </Container>

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