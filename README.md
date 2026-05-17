# DiscoverMove - Premium Morocco Tours Website

A fully functional, production-ready travel site for boutique tours in Oriental Morocco featuring Tafoughalt & Zegzel.

## 🌟 Features

### Frontend
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Multi-language** - English, French, Arabic with RTL support
- ✅ **Booking System** - Integrated form with validation
- ✅ **Newsletter** - Email subscription management
- ✅ **Gallery** - Premium image showcase
- ✅ **Testimonials** - Customer reviews
- ✅ **SEO Optimized** - Sitemap, robots.txt, meta tags

### Backend
- ✅ **Booking API** - Handles tour reservations
- ✅ **Newsletter API** - Email subscriptions
- ✅ **Payment Ready** - Stripe integration prepared
- ✅ **Email Notifications** - SendGrid integration
- ✅ **Rate Limiting** - Protect against abuse
- ✅ **Input Validation** - Secure data handling

### Advanced Features
- ✅ **PWA Support** - Install as mobile app
- ✅ **Offline Access** - Service Worker caching
- ✅ **Analytics Ready** - Google Analytics integration
- ✅ **Payment Processing** - Stripe ready
- ✅ **Performance** - Image optimization
- ✅ **Security** - CORS, validation, rate limiting

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**
- API Keys:
  - SendGrid (for emails)
  - Stripe (for payments)
  - Google Analytics (for tracking)

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/ouelhadjmohamed26-stack/travel-site.git
cd travel-site

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and add your API keys:

```env
# SendGrid
SENDGRID_API_KEY=sg_your_key_here
SENDGRID_FROM_EMAIL=noreply@discovermove.com
ADMIN_EMAIL=your-email@example.com

# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Google Analytics
GA_MEASUREMENT_ID=G_XXXXX
```

### 3. Start Development

**Terminal 1 - Backend:**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
# In the project directory
python -m http.server 3000
# Frontend runs on http://localhost:3000
```

### 4. Test the Site

- Visit `http://localhost:3000`
- Try booking form
- Try newsletter subscription
- Switch languages (EN, FR, AR)

---

## 📁 Project Structure

```
travel-site/
├── index.html              # Tour details page (English)
├── landing.html            # Home/landing page (French)
├── styles.css              # Main stylesheet
├── script.js               # Frontend JS + API integration
├── server.js               # Express.js backend
├── package.json            # Node dependencies
├── manifest.json           # PWA configuration
├── sw.js                   # Service Worker (offline)
├── robots.txt              # SEO robots config
├── sitemap.xml             # URL sitemap
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── Procfile                # Heroku config
```

---

## 🔧 API Endpoints

### Bookings
```bash
POST /api/bookings
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "date": "2026-06-15",
  "guests": 4,
  "message": "Any special requirements"
}

Response:
{
  "success": true,
  "message": "Booking request submitted successfully",
  "bookingId": "BK-1234567890"
}
```

### Newsletter
```bash
POST /api/newsletter
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

### Payment (Stripe)
```bash
POST /api/payment
Content-Type: application/json

{
  "amount": 10000,
  "currency": "usd",
  "description": "Tour booking for 4 guests"
}

Response:
{
  "clientSecret": "pi_test_xxxx",
  "paymentIntentId": "pi_test_xxxx"
}
```

---

## 🛠️ Get API Keys

### SendGrid (for Emails)
1. Sign up: https://sendgrid.com
2. Create API key in Settings > API Keys
3. Verify sender email in Sender Authentication
4. Add to `.env`

### Stripe (for Payments)
1. Sign up: https://stripe.com
2. Get test keys from Dashboard
3. Add to `.env`
4. Use test card: `4242 4242 4242 4242`

### Google Analytics
1. Go to: https://analytics.google.com
2. Create new property
3. Copy Measurement ID (G_XXXXX)
4. Add to `script.js`: Replace `GA_MEASUREMENT_ID`

---

## 📱 PWA Setup

The site is already PWA-ready! Users can:

1. Open on mobile browser
2. Tap menu → "Add to Home Screen"
3. App installs like a native app
4. Works offline with cached content

To customize:
- Update `manifest.json` with your icons
- Replace `/icon-192.png` and `/icon-512.png`

---

## 🚢 Deployment

### Frontend (Netlify)

```bash
# 1. Push to GitHub
git add .
git commit -m "Add backend integration"
git push origin main

# 2. Connect to Netlify
# - Go to netlify.com
# - Click "New site from Git"
# - Select your GitHub repo
# - Auto-deploys on every push

# 3. Set environment variable
# In Netlify: Build & Deploy > Environment
# Add: API_BASE_URL=https://api.discovermove.com
```

### Backend (Heroku)

```bash
# 1. Create Heroku account & install CLI
npm install -g heroku
heroku login

# 2. Create app
heroku create discovermove-api

# 3. Set environment variables
heroku config:set SENDGRID_API_KEY=sg_xxxxx
heroku config:set STRIPE_SECRET_KEY=sk_test_xxxxx
heroku config:set ADMIN_EMAIL=admin@discovermove.com

# 4. Deploy
git push heroku main

# Your API is live at:
# https://discovermove-api.herokuapp.com
```

### Custom Domain

```bash
# 1. Register domain (discovermove.com)

# 2. For Netlify:
# - Site settings > Domain management
# - Add custom domain

# 3. For Heroku API:
# - In code: Update API_BASE_URL to your domain
# - Redeploy

# 4. Update DNS records:
# - Point discovermove.com to Netlify nameservers
# - Create CNAME for api.discovermove.com → Heroku
```

---

## 🔒 Security Checklist

- ✅ Environment variables in `.env` (never commit)
- ✅ Input validation on all forms
- ✅ Rate limiting on API endpoints
- ✅ CORS configured
- ✅ HTTPS enforced (on production)
- ✅ SQL injection protected (using Mongoose/ORM)
- ✅ XSS protection with content validation

---

## 📊 Monitoring

### Check API Health
```bash
curl http://localhost:5000/api/health
```

### View Logs
```bash
# Local
npm run dev

# Heroku
heroku logs --tail
```

---

## 🐛 Troubleshooting

### Forms not submitting?
- Check browser console for errors
- Verify `.env` file has API keys
- Check backend is running
- Verify API_BASE_URL in script.js

### Emails not sending?
- Check SendGrid API key
- Verify sender email in SendGrid
- Check admin email is correct

### Payment not working?
- Use Stripe test keys
- Use test card: `4242 4242 4242 4242`
- Check browser console for errors

---

## 📞 Support

For issues:
1. Check error messages in browser console
2. Check backend logs
3. Verify all API keys are set
4. Check `.env` file is correctly formatted

---

## 📄 License

MIT License - Feel free to use for your travel business

---

## 🎉 Next Steps

1. ✅ Get API keys (SendGrid, Stripe, Google Analytics)
2. ✅ Update `.env` file
3. ✅ Test locally
4. ✅ Deploy to Netlify (frontend)
5. ✅ Deploy to Heroku (backend)
6. ✅ Setup custom domain
7. ✅ Monitor analytics

**Your site is production-ready! 🚀**
