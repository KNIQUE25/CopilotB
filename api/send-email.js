export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Safety check for req.body
  const body = req.body || {};
  const { name, email, message } = body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY, // Ensure this is set in Vercel settings
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Bridgette Kimotho',
          email: 'kimothobridgette@gmail.com', // MUST be verified in Brevo
        },
        to: [
          {
            email: 'kimothobridgette@gmail.com', 
            name: 'Bridgette Kimotho',
          },
        ],
        replyTo: {
          email: email, // Allows you to click "Reply" and email the person who filled the form
          name: name,
        },
        subject: `New Contact Form Submission from ${name}`,
        htmlContent: `
          <h3>New Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}