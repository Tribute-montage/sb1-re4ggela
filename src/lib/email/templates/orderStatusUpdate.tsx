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

interface OrderStatusUpdateEmailProps {
  order: Order;
  clientName: string;
  newStatus: Order['status'];
  message?: string;
  dashboardUrl: string;
}

export function OrderStatusUpdateEmail({
  order,
  clientName,
  newStatus,
  message,
  dashboardUrl,
}: OrderStatusUpdateEmailProps) {
  const statusMessages = {
    'pending': 'Your order is pending review',
    'in-progress': 'Work has begun on your tribute montage',
    'review': 'Your tribute montage is ready for review',
    'completed': 'Your tribute montage is complete',
  };

  return (
    <Html>
      <Head />
      <Preview>Your tribute montage order status has been updated</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.header}>Order Status Update</Text>
            <Text style={styles.paragraph}>
              Dear {clientName},
            </Text>
            <Text style={styles.paragraph}>
              {statusMessages[newStatus]}
            </Text>
            
            {message && (
              <Text style={styles.message}>
                {message}
              </Text>
            )}

            <Section style={styles.details}>
              <Text style={styles.subheader}>Order Details:</Text>
              <Text style={styles.detail}>Order Number: {order.id}</Text>
              <Text style={styles.detail}>Status: {newStatus}</Text>
              <Text style={styles.detail}>
                Last Updated: {new Date().toLocaleDateString()}
              </Text>
            </Section>

            <Button style={styles.button} href={dashboardUrl}>
              View Order Details
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
  message: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '6px',
    margin: '16px 0',
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