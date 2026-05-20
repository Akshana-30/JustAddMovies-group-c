import { Section } from "react-email";
import { EmailLayout } from "./_components/email-layout";
import {
    ContentText,
    DisclaimerText,
    NavButton,
    SloganHeading,
    GoldText,
    TitleHeading,
    SecurityTipsLink
} from "./_components/custom-components";
import { WebsiteProp } from "./_types/interfaces";

interface VerifyEmailProps extends WebsiteProp {
    verificationLink: string;
}

const VerifyEmail = ({
    userName,
    websiteName,
    verificationLink,
}: VerifyEmailProps) => (
    <EmailLayout title="Verify Your Email" previewText="Verify your email address to complete your registration.">
        <Section>
            <TitleHeading>Almost There!</TitleHeading>
        </Section>

        <Section>
            <ContentText>
                Hi <GoldText>{userName}</GoldText>,
            </ContentText>

            <ContentText>
                Thank you for signing up for <GoldText>{websiteName}</GoldText>!
            </ContentText>
        </Section>

        <Section>
            <ContentText>
                To finish setting up your account,
                please click the button below
                to verify your email address.
            </ContentText>

            <NavButton href={verificationLink}>Verify Email</NavButton>
        </Section>

        <Section>
            <DisclaimerText>
                If you didn&apos;t create an account, you can safely ignore
                this email.
            </DisclaimerText>

            <DisclaimerText>
                To keep your account secure, please do not forward this
                email to anyone. Visit our Help Center for{' '}
                <SecurityTipsLink>
                    more security tips.
                </SecurityTipsLink>
            </DisclaimerText>

            <SloganHeading>Happy movie time!</SloganHeading>
        </Section>
    </EmailLayout>
);

VerifyEmail.PreviewProps = {
    userName: "Alan",
    websiteName: "Just Add Movies",
    verificationLink: "http://localhost:3000",
} as VerifyEmailProps;

export default VerifyEmail;