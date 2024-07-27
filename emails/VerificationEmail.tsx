import { Html, Head, Body, Preview, Container, Section, Heading, Text } from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head>
                <title>Verification Email</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
                <Preview>Your verification code is ready.</Preview>
                <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                    <Section style={{ textAlign: 'center' }}>
                        <Heading style={{ color: '#333', marginBottom: '20px' }}>
                            Hello {username},
                        </Heading>
                        <Text style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                            Your verification code is below. Please use this code to complete your verification process.
                        </Text>
                        <Heading style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
                            {otp}
                        </Heading>
                        <Text style={{ fontSize: '14px', color: '#777' }}>
                            If you did not request this code, please ignore this email.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
