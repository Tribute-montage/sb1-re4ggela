import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';
import { Order } from '../../../types/order';

interface ReviewReminderEmailProps {
  order: Order;
  clientName: string;
  daysWaiting: number;
  dashboardUrl: string;
}

export function ReviewReminderEmail({
  order,
  clientName,
  daysWaiting,
  dashboardUrl,
}: ReviewReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your tribute montage is waiting for review</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.header}>Review Reminder</Text>
            <Text style={styles.paragraph}>
              Dear {clientName},
            </Text>
            <Text style={styles.paragraph}>
              Your tribute montage has been ready for review for {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'}. 
              Please take a moment to review it so we can make any necessary adjustments.
            </Text>

            <Section style={styles.details}>
              <Text style={styles.subheader}>Order Details:</Text>
              <Text style={styles.detail}>Order Number: {order.id}</Text>
              <Text style={styles.detail}>Status: Awaiting Review</Text>
            </Section>

            <Button style={styles.button} href={dashboardUrl}>
              Review Your Montage
            </Button>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              If you have any questions, please don't hesitate to{' '}
              <Link href="mailto:support@tributemontage.com">contact our support team</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
    color: '#1a1a1a',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
  },
  details: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  },
  subheader: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  detail: {
    fontSize: '14px',
    color: '#484848',
    marginBottom: '8px',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
    margin: '24px 0',
  },
  hr: {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  },
  footer: {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center' as const,
    marginTop: '32px',
  },
};