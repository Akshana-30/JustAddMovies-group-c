import { Section } from "react-email";
import { EmailLayout } from "./_components/email-layout";
import {
    ContentText,
    DisclaimerText,
    GoldText,
    SloganHeading,
    TitleHeading
} from "./_components/custom-components";
import { UserProp } from "./_types/interfaces";

interface UserEmailProp extends UserProp {
    userEmail: string;
}

const RegisterAttempt = ({
    userName,
    userEmail,
}: UserEmailProp) => (
    <EmailLayout title="Account Security Notice" previewText="An account creation attempt was made using your email.">
        <Section>
            <TitleHeading>Security Notice</TitleHeading>
        </Section>

        <Section>
            <ContentText>
                Hi <GoldText>{userName}</GoldText>,
            </ContentText>

            <ContentText styling="mb-10">
                We wanted to let you know that someone recently
                attempted to create a new account
                using your email address <GoldText>{userEmail}</GoldText> on our website.

                If this was you, please try logging in to your existing account instead.
            </ContentText>
        </Section>

        <Section>
            <DisclaimerText>
                If you did not attempt to register,
                you can safely ignore this email.
            </DisclaimerText>

            <SloganHeading>Happy movie time!</SloganHeading>
        </Section>
    </EmailLayout>
);

RegisterAttempt.PreviewProps = {
    userName: "Alan",
    userEmail: "test@example.com",
} as UserEmailProp;

export default RegisterAttempt;