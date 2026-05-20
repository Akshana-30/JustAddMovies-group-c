import { Section } from "react-email";
import { EmailLayout } from "./_components/email-layout";
import {
    ContentText,
    DisclaimerText,
    GoldText,
    NavButton,
    SecurityTipsLink,
    SloganHeading,
    TitleHeading
} from "./_components/custom-components";
import { UserProp } from "./_types/interfaces";

interface EmailChangeProps extends UserProp {
    newEmailName: string;
    confirmEmailLink: string;
}

const EmailChange = ({
    userName,
    newEmailName,
    confirmEmailLink,
}: EmailChangeProps) => (
    <EmailLayout title="Confirm Your New Email" previewText="Please confirm your request to change your email address.">
        <Section>
            <TitleHeading>Confirm Your New Email</TitleHeading>
        </Section>

        <Section>
            <ContentText>
                Hi <GoldText>{userName}</GoldText>,
            </ContentText>
        </Section>

        <Section>
            <ContentText>
                Please click the button below to approve
                changing your email address to <GoldText>{newEmailName}</GoldText>.
            </ContentText>

            <NavButton href={confirmEmailLink}>Change Email</NavButton>
        </Section>

        <Section>
            <DisclaimerText>
                If you didn&apos;t request this change, you can safely ignore
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

EmailChange.PreviewProps = {
    userName: "Alan",
    newEmailName: "test@example.com",
    confirmEmailLink: "http://localhost:3000",
} as EmailChangeProps;

export default EmailChange;