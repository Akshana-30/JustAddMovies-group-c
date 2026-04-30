import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    pixelBasedPreset,
    Preview,
    Row,
    Section,
    Tailwind,
    Text
} from "react-email";

// Some of the components can be moved into their own tsx file

interface ResetPasswordProps {
    userName: string;
    resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const ResetPasswordEmail = ({
    userName,
    resetPasswordLink,
}: ResetPasswordProps) => (
    <Tailwind
        config={{
            presets: [pixelBasedPreset],
        }}
    >
        <Html>
            <Head />

            <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                <Preview>Just Add Movies reset your password</Preview>

                <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">
                    <Img
                        src={`${baseUrl}/static/JAM.png`}
                        width="40"
                        height="33"
                        alt="Just Add Movies logo"
                    />

                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Hi {userName},
                        </Text>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Someone recently requested a password change for your Just Add Movies account. If this was you, you can set the new password here:
                        </Text>

                        <Button
                            className="bg-[#007ee6] rounded text-white text-[15px] no-underline text-center block w-52.5 py-3.5 px-1.75"
                            href={resetPasswordLink}
                        >
                            Reset password
                        </Button>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            If you don&apos;t want to change your password or didn&apos;t
                            request this, just ignore and delete this message.
                        </Text>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            To keep your account secure, please don&apos;t forward this
                            email to anyone. See our Help Center for{' '}
                            <Link className="underline" href="#">
                                more security tips.
                            </Link>
                        </Text>

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

ResetPasswordEmail.PreviewProps = {
    userName: "Alan",
    resetPasswordLink: "http://localhost:3000",
} as ResetPasswordProps;

export default ResetPasswordEmail;