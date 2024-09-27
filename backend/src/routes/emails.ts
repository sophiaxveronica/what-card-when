import { Router } from 'express';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend('re_2mLX5Zs4_2EPtALs5DbSbv9u2Zqjfwebs');
const signup_list = 'd852b273-7a62-42ee-80e0-afcde83c6d5a';

// Send email 
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const result = await resend.emails.send({
      from: 'What Card When Team <hi@whatcardwhen.com>',
      replyTo: 'hi@whatcardwhen.com',
      to,
      subject,
      html,
    });

    res.json({ success: true, result });
    console.error('Email sent successfully');
  } catch (error) {
    console.error('Error sending email');
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Add user to contact list
router.post('/add-contact', async (req, res) => {
  try {
    // Unfortunately we can't add custom data like the cards list here
    const { name, email } = req.body;

    const result = await resend.contacts.create({
      email: email,
      firstName: name,
      audienceId: signup_list,
    });

    res.json({ success: true, result });
    console.error('Contact added successfully');
  } catch (error) {
    console.error('Error adding contact');
    res.status(500).json({ success: false, error: 'Failed to add contact' });
  }
});

export default router;