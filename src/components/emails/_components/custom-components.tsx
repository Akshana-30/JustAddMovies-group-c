import { ReactNode } from "react";
import { Button, Column, Heading, Hr, Link, Text } from "react-email";

interface BaseProps { children: ReactNode; styling?: string; }
interface ButtonProps extends BaseProps { href: string; }

// Headers //
export const TitleHeading = ({ children, styling }: BaseProps) => (
    <Heading as="h2" className={`font-bold text-dark-genre-text/85 leading-6.5 ${styling}`}>
        {children}
    </Heading>
)

export const SloganHeading = ({ children, styling }: BaseProps) => (
    <Heading as="h3" className={`font-bold text-dark-genre-text/85 leading-6.5 ${styling}`}>
        {children}
    </Heading>
)

// Texts //
export const ContentText = ({ children, styling }: BaseProps) => (
    <Text className={`text-base font-light text-dark-text leading-6.5 ${styling}`}>
        {children}
    </Text>
)

export const DisclaimerText = ({ children, styling }: BaseProps) => (
    <Text className={`italic text-sm font-light text-dark-text-muted leading-6.5 mb-8 ${styling}`}>
        {children}
    </Text>
)

export const GoldText = ({ children }: BaseProps) => (
    <span className="text-gold">
        {children}
    </span>
)

export const SemiBoldText = ({ children, styling }: BaseProps) => (
    <Text className={`text-base font-semibold text-dark-text/65 m-0 ${styling}`}>
        {children}
    </Text>
)

export const SummaryText = ({ children, styling }: BaseProps) => (
    <Text className={`text-sm text-dark-text/55 m-0 ${styling}`}>
        {children}
    </Text>
)

// Columns //
export const ColumnFlex = ({ children, styling }: BaseProps) => (
    <Column className={`flex-1 ${styling}`}>
        {children}
    </Column>
)

export const ColumnRight = ({ children, styling }: BaseProps) => (
    <Column className={`text-right ${styling}`}>
        {children}
    </Column>
)

// Components //
export const NavButton = ({ children, styling, href }: ButtonProps) => (
    <Button
        className={`bg-primary/60 my-10 rounded text-dark-genre-text/90 text-sm no-underline text-center block w-1/3 py-3.5 px-1.75 ${styling}`}
        href={href}
    >
        {children}
    </Button>
)
export const LineBreak = ({ styling }: { styling?: string }) => (
    <Hr className={`bg-dark-foreground/70 w-full my-4 ${styling}`} />
)

export const SecurityTipsLink = ({ children, styling }: BaseProps) => (
    <Link className={`underline text-dark-text-muted ${styling}`} href="#">
        {children}
    </Link>
)