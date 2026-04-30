import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    pixelBasedPreset,
    Preview,
    Row,
    Section,
    Tailwind,
    Text
} from "react-email";

// Some of the components can be moved into their own tsx file

interface VerifyEmailProps {
    userName: string;
    websiteName: string;
    verificationLink: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const VerifyEmail = ({
    userName,
    websiteName,
    verificationLink,
}: VerifyEmailProps) => (
    <Tailwind
        config={{
            presets: [pixelBasedPreset],
        }}
    >
        <Html>
            <Head />

            <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                <Preview>Confirm your email address</Preview>

                <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">
                    <Img
                        src={`${baseUrl}/static/JAM.png`}
                        width="40"
                        height="33"
                        alt="Just Add Movies logo"
                    />

                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Almost there
                        </Text>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Hi {userName}, thank you for signing up for {websiteName}
                        </Text>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            To verify your account, we just need to confirm your email
                        </Text>

                        <Button
                            className="bg-[#007ee6] rounded text-white text-[15px] no-underline text-center block w-52.5 py-3.5 px-1.75"
                            href={verificationLink}
                        >
                            Verify email
                        </Button>
                        

                        <Section className="mobile:px-6! px-10 pt-16 pb-8">
                            <Text className="font-6 font-inter text-fg-3 m-0 max-w-77.5">
                                If you didn&apos;t create an account, you can safely ignore
                                this email.
                            </Text>
                        </Section>
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

VerifyEmail.PreviewProps = {
    userName: "Alan",
    websiteName: "Just Add Movies",
    verificationLink: "http://localhost:3000",
} as VerifyEmailProps;

export default VerifyEmail;