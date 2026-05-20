// ── Order confirmation email template ─────────────────────────────
// Built with react-email so the layout is written as JSX and rendered
// to a plain HTML string at send time. The Tailwind preset (pixel-based)
// is used instead of CSS variables because email clients do not support
// custom properties — all colours must be hardcoded hex values.
import {
  Row,
  Section,
  Text,
} from "react-email";

// ── formatPrice ───────────────────────────────────────────────────
// Prices in the database are stored in öre (e.g. 8900 = 89 kr).
// formatPrice divides by 100 and formats with the Swedish locale so
// the email matches the prices shown in the storefront.
import { formatPrice } from "@/lib/format";
import { EmailLayout } from "./_components/email-layout";
import {
  ColumnFlex,
  ColumnRight,
  ContentText,
  DisclaimerText,
  GoldText,
  LineBreak,
  SecurityTipsLink,
  SemiBoldText,
  SloganHeading,
  SummaryText,
  TitleHeading
} from "./_components/custom-components";
import { OrderConfirmationEmailProps } from "./_types/interfaces";

const OrderConfirmationEmail = ({
  userName,
  orderId,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) => (
  <EmailLayout title="Order Confirmed" previewText={`Your order #${orderId} has been successfully processed!`}>
    {/* ── Greeting ─────────────────────────────────────────── */}
    <Section>
      <TitleHeading>Order Confirmed</TitleHeading>

      <ContentText>
        Hi <GoldText>{userName}</GoldText>,
      </ContentText>

      <ContentText styling="mb-10">
        Thank you for your order!
        Here is a summary of your purchase:
      </ContentText>

      <Text className="text-xs font-medium text-[#777183] uppercase tracking-wider">
        Order #{orderId}
      </Text>
    </Section>

    <LineBreak />

    {/* ── Order items ──────────────────────────────────────── */}
    <Section>
      {items.map((item, i) => (
        <Row key={i} className="py-1">
          <ColumnFlex>
            <SummaryText>
              {item.title}{" "}
              <span className="text-gold/80">× {item.quantity}</span>
            </SummaryText>
          </ColumnFlex>

          <ColumnRight>
            <SummaryText styling="font-medium">
              {formatPrice(item.price * item.quantity)}
            </SummaryText>
          </ColumnRight>
        </Row>
      ))}
    </Section>

    <LineBreak />

    {/* ── Order total ───────────────────────────────────────── */}
    <Section>
      <Row>
        <ColumnFlex>
          <SemiBoldText>
            Total
          </SemiBoldText>
        </ColumnFlex>

        <ColumnRight>
          <SemiBoldText>
            {formatPrice(total)}
          </SemiBoldText>
        </ColumnRight>
      </Row>
    </Section>

    <LineBreak />

    {/* ── Shipping ──────────────────────────────────────────── */}
    {/* The address is collected in the payment form and passed  */}
    {/* through handleCheckout so the customer can verify where  */}
    {/* their order will be delivered. Shipping is always free.  */}
    <Section>
      <Row>
        <ColumnFlex>
          <SemiBoldText>Shipping</SemiBoldText>
        </ColumnFlex>

        <ColumnRight>
          <Text className="text-base font-semibold text-[#4ade80] m-0">
            Free
          </Text>
        </ColumnRight>
      </Row>

      <Text className="text-sm text-[#777183] mt-2 mb-0">
        {shippingAddress.street}
        <br />
        {shippingAddress.zip} {shippingAddress.city} <br />
        {shippingAddress.country}
      </Text>
    </Section>

    <LineBreak styling="mb-10"/>

    {/* ── Sign-off ──────────────────────────────────────────── */}
    <DisclaimerText>
      If you did not place this order, 
      please contact us through our 
      website as soon as possible.
    </DisclaimerText>

    <DisclaimerText>
      To keep your account secure, please do not forward this
      email to anyone. Visit our Help Center for{' '}
      <SecurityTipsLink>
        more security tips.
      </SecurityTipsLink>
    </DisclaimerText>

    <Section>
      <SloganHeading>Happy movie time!</SloganHeading>
    </Section>
  </EmailLayout>
);

// ── Preview props ─────────────────────────────────────────────────
// Used by the react-email dev server (npm run email:dev) to render a
// realistic preview at http://localhost:3001 without placing a real order.
OrderConfirmationEmail.PreviewProps = {
  userName: "Alan",
  userEmail: "alan@example.com",
  orderId: "abc123def456xyz",
  items: [
    { title: "The Matrix", quantity: 1, price: 999 },
    { title: "Inception", quantity: 2, price: 1299 },
  ],
  total: 3597,
  shippingAddress: {
    street: "Teknikringen 10",
    city: "Linköping",
    zip: "58330",
  },
} as OrderConfirmationEmailProps;

export default OrderConfirmationEmail;
