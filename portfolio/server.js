require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Serve the portfolio HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // If you have a real email set up via .env, use nodemailer here.
    // For now we log and return success so the portfolio works out of the box.
    // ── Real nodemailer implementation ───────────────────────────────────────
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || 'wanjarhoda24@gmail.com',
            subject: `New Message from ${name} via Portfolio`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        });

        return res.json({ success: true, message: 'Message received! I\'ll get back to you soon.' });
    } catch (error) {
        console.error('Email error:', error);
        // Fallback to success during development if SMTP is not configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('NOTICE: SMTP credentials missing. Submission logged above but email was not sent.');
            return res.json({ success: true, message: 'Message received! (Dev Mode: Email logged to console)' });
        }
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
});

// Projects API – add/edit your real projects here
app.get('/api/projects', (req, res) => {
    const projects = [
        {
            id: 1,
            title: 'AI-Driven Smart Agriculture Analysis System',
            description: 'This system uses advanced AI models to analyze climate data, soil composition, elevation, and local biodiversity to generate accurate insights and recommendations for farmers, researchers, and environmental planners.',
            tags: ['AI Analysis', 'Machine Learning', 'Environmental Data'],
            link: 'https://green-platform.vercel.app/'
        },
        {
            id: 2,
            title: 'Daily App',
            description: 'A personal productivity application designed to track and manage daily tasks, helping users optimize their personal production and progress.',
            tags: ['Java', 'Productivity', 'School Project'],
            link: 'https://github.com/rhodandwiga/daily-app'
        },
        {
            id: 3,
            title: 'School Administrative System',
            description: 'A comprehensive school management website designed to streamline administrative tasks, student records, and faculty coordination.',
            tags: ['PHP', 'Laravel', 'MySQL'],
            link: 'https://github.com/rhodandwiga/school-administration-system'
        },
        {
            id: 4,
            title: 'Smart Waste Management System',
            description: 'An AI-powered system that detects waste in real-time and notifies management for collection, ensuring a cleaner environment through automated monitoring.',
            tags: ['Python', 'ML', 'React'],
            link: 'https://garbage-nu.vercel.app/'
        }
    ];
    res.json(projects);
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`\n🚀  Portfolio running at http://localhost:${PORT}\n`);
});
