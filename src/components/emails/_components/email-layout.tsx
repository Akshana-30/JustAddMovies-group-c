import {
    Body,
    Container,
    Font,
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
import { emailDarkColors, emailRootColors } from "../_themes/theme";

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    previewText: string;
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
export const EmailLayout = ({ 
    children, 
    previewText, 
    title 
}: LayoutProps) => (
    <Tailwind
        config={{
            presets: [pixelBasedPreset],
            theme: {
                extend: {
                    colors: {
                        ...emailRootColors,
                        ...emailDarkColors,
                    }
                }
            }
        }}
    >
        <Html>
            <Head>
                <title>{`${title} | Just Add Movies`}</title>

                <Font
                    fontFamily="Robot Slab"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap",
                        format: "woff2",
                    }}

                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>

            <Body className="bg-dark-background text-xs py-2.5 font-serif">
                <Preview>{previewText}</Preview>

                <Container className="bg-dark-surface border-3 border-solid border-gold/60 p-11.25">
                    <Img
                        src={`${baseUrl}/JAM.png`}
                        width="80"
                        height="80"
                        alt="Just Add Movies logo"
                        className="mb-10 mx-auto"
                    />

                    {children}
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