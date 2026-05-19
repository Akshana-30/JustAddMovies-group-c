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

interface WelcomeEmailProps {
    userName: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const WelcomeEmail = ({
    userName,
}: WelcomeEmailProps) => (
    <Tailwind
        config={{
            presets: [pixelBasedPreset],
        }}
    >
        <Html>
            <Head />

            <Body className="bg-[#f6f9fc] py-2.5 font-sans">
                <Preview>Welcome Email</Preview>

                <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">
                    <Img
                        src={`${baseUrl}/static/JAM.png`}
                        width="40"
                        height="33"
                        alt="Just Add Movies logo"
                    />

                    <Section>
                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Greetings {userName}!
                        </Text>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            Your account is now active, and you are now ready to shop some movies:
                        </Text>

                        <Button
                            className="bg-[#007ee6] rounded text-white text-[15px] no-underline text-center block w-52.5 py-3.5 px-1.75"
                            href="http://localhost:3000/movies"
                        >
                            Movie Shop
                        </Button>

                        <Text className="text-base font-light text-[#404040] leading-6.5">
                            You can also check out your new user dashboard:
                        </Text>

                        <Button
                            className="bg-[#007ee6] rounded text-white text-[15px] no-underline text-center block w-52.5 py-3.5 px-1.75"
                            href="http://localhost:3000/admin-dashboard/dashboard"
                        >
                            Dashboard
                        </Button>

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
)