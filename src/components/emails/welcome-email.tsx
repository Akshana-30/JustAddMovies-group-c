import { Section } from "react-email";
import { EmailLayout } from "./_components/email-layout";
import { 
    ContentText, 
    GoldText, 
    NavButton, 
    SloganHeading, 
    TitleHeading 
} from "./_components/custom-components";
import { WebsiteProp } from "./_types/interfaces";

interface WelcomeEmailProps extends WebsiteProp {
    moviesPageLink: string;
    dashboardPageLink: string;
}

const WelcomeEmail = ({
    userName,
    websiteName,
    moviesPageLink,
    dashboardPageLink,
}: WelcomeEmailProps) => (
    <EmailLayout title="Welcome!" previewText="Your account is active. Explore your new dashboard today.">
        <Section>
            <TitleHeading>
                Welcome to <GoldText>{websiteName}</GoldText>!
            </TitleHeading>
        </Section>

        <Section>
            <ContentText>
                Hi <GoldText>{userName}</GoldText>,
            </ContentText>
        </Section>

        <Section>
            <ContentText>
                Your account is active and you are ready to start exploring. 
                Click below to look for your next favorite film:
            </ContentText>

            <NavButton href={moviesPageLink}>Shop Movies</NavButton>

            <ContentText>
                You can also view your personalized profile details here:
            </ContentText>

            <NavButton href={dashboardPageLink}>Dashboard</NavButton>
        </Section>

        <Section>
            <SloganHeading>Happy movie time!</SloganHeading>
        </Section>
    </EmailLayout>
)

WelcomeEmail.PreviewProps = {
    userName: "Alan",
    websiteName:  "Just Add Movies",
    moviesPageLink: "http://localhost:3000/movies",
    dashboardPageLink: "http://localhost:3000/admin-dashboard/dashboard",
}

export default WelcomeEmail;