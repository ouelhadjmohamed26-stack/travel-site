// DiscoverMove Backend API
// Production-ready Express.js server with email and payment integration

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Email service setup
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========================
// BOOKING ENDPOINT
// ========================
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, date, guests, message } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !guests) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }

    if (!validator.isISO8601(date)) {
      return res.status(400).json({ 
        error: 'Invalid date format' 
      });
    }

    if (guests < 1 || guests > 20) {
      return res.status(400).json({ 
        error: 'Invalid number of guests' 
      });
    }

    const bookingId = `BK-${Date.now()}`;
    const bookingDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email to customer
    const customerEmail = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Booking Confirmation - DiscoverMove Tours',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${validator.escape(name)},</p>
        <p>Thank you for your booking with DiscoverMove!</p>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Number of Guests:</strong> ${guests}</li>
          <li><strong>Contact:</strong> ${validator.escape(phone)}</li>
        </ul>
        
        ${message ? `<p><strong>Special Requests:</strong> ${validator.escape(message)}</p>` : ''}
        
        <p>Our team will contact you shortly to confirm all details.</p>
        <p>Best regards,<br>DiscoverMove Team</p>
      `
    };

    // Email to admin
    const adminEmail = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `New Booking Request - ${name}`,
      html: `
        <h2>New Booking Request</h2>
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${validator.escape(name)}</li>
          <li><strong>Email:</strong> ${validator.escape(email)}</li>
          <li><strong>Phone:</strong> ${validator.escape(phone)}</li>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
        </ul>
        
        <h3>Tour Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Guests:</strong> ${guests}</li>
        </ul>
        
        ${message ? `<p><strong>Message:</strong> ${validator.escape(message)}</p>` : ''}
      `
    };

    // Send emails
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(adminEmail)
    ]);

    console.log(`📧 Booking confirmed: ${bookingId}`);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      bookingId
    });

  } catch (error) {
    console.error('❌ Booking error:', error.message);
    res.status(500).json({
      error: 'Failed to process booking'
    });
  }
});

// ========================
// NEWSLETTER ENDPOINT
// ========================
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }

    // Send welcome email
    const welcomeEmail = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to DiscoverMove Newsletter',
      html: `
        <h2>Welcome to DiscoverMove!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive the latest updates about our premium tours in Oriental Morocco.</p>
        <p>Best regards,<br>DiscoverMove Team</p>
      `
    };

    await sgMail.send(welcomeEmail);

    console.log(`📰 Newsletter subscription: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('❌ Newsletter error:', error.message);
    res.status(500).json({
      error: 'Failed to subscribe'
    });
  }
});

// ========================
// PAYMENT ENDPOINT (Stripe)
// ========================
app.post('/api/payment', async (req, res) => {
  try {
    const { amount, currency = 'usd', description } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ 
        error: 'Invalid amount' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      description: validator.escape(description || 'DiscoverMove Tour Booking')
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('❌ Payment error:', error.message);
    res.status(500).json({
      error: 'Failed to process payment'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DiscoverMove API running on http://localhost:${PORT}`);
  console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;
