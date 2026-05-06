import {
    Body,
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

interface ExistingUserProps {
    userName: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const ExistingUser = ({
    userName,
}: ExistingUserProps) => (
    <Tailwind
        config={{
            presets: [pixelBasedPreset],
        }}
    >
        <Html>
            <Head />

            <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                <Preview>Register attempt</Preview>

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
                            Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.
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

ExistingUser.PreviewProps = {
    userName: "Alan",
    newEmailLink: "http://localhost:3000",
} as ExistingUserProps;

export default ExistingUser;