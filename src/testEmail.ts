import { sendEmail } from '../lib/sendgrid/client'; // Adjust the path based on your project structure

export async function testEmailHandler(req: any, res: any) {
  try {
    // Call the `sendEmail` function with test parameters
    await sendEmail({
      to: 'testrecipient@example.com', // Replace with your email to test
      subject: 'Test Email',
      html: '<p>This is a test email to verify SendGrid integration.</p>',
    });

    // Send a success response
    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);

    // Send an error response
    res.status(500).json({ message: 'Failed to send test email', error });
  }
}
