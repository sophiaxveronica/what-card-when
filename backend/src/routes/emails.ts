import { Router } from 'express';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend('re_2mLX5Zs4_2EPtALs5DbSbv9u2Zqjfwebs');

router.post('/send', async (req, res) => {
    console.log("HI");
  try {
    const { to, subject, html } = req.body;

    const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html,
      });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

export default router;