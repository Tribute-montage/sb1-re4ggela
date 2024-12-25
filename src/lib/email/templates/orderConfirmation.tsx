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
import { OrderDetailsForm } from '../../../store/useOrderFormStore';

interface OrderConfirmationEmailProps {
  order: OrderDetailsForm;
  orderNumber: string;
  clientName: string;
  dashboardUrl: string;
}

export function OrderConfirmationEmail({
  order,
  orderNumber,
  clientName,
  dashboardUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your tribute montage order has been received</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.header}>Order Confirmation</Text>
            <Text style={styles.paragraph}>
              Dear {clientName},
            </Text>
            <Text style={styles.paragraph}>
              Thank you for your tribute montage order. We have received your request and our team will begin working on it shortly.
            </Text>
            
            <Section style={styles.details}>
              <Text style={styles.subheader}>Order Details:</Text>
              <Text style={styles.detail}>Order Number: {orderNumber}</Text>
              <Text style={styles.detail}>Subject Name: {order.subjectName}</Text>
              <Text style={styles.detail}>Video Type: {order.videoType}</Text>
              <Text style={styles.detail}>
                Requested Delivery: {new Date(order.requestedDeliveryDate).toLocaleDateString()}
              </Text>
            </Section>

            <Button style={styles.button} href={dashboardUrl}>
              View Order Status
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