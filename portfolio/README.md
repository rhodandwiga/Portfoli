# 🚀 Portfolio – Node.js & Express

A professional developer portfolio powered by Node.js and Express.

## Project Structure

```
portfolio/
├── server.js              ← Express server (routes + API)
├── package.json
├── .env.example           ← Copy to .env and fill in your values
├── .gitignore
└── public/                ← Static files served by Express
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/            ← Put your profile photo here
        └── portfolio.png  ← (optional – replace placeholder initials)
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set up environment variables
cp .env.example .env
# Then edit .env with your SMTP details to enable real email sending

# 3. Start the server
npm start

# Development (auto-reload)
npm run dev
```

The portfolio will be live at **http://localhost:3000**

## Customise Your Portfolio

| What to change | Where |
|---|---|
| Your name & bio | `public/index.html` – sidebar section |
| Hero text | `public/index.html` – `#home` section |
| Skills | `public/index.html` – `#about` section |
| Projects | `server.js` – `/api/projects` array |
| Colors & fonts | `public/css/style.css` – `:root` variables |
| Profile photo | Drop `portfolio.png` into `public/images/` and update `<img src>` in the HTML |
| Email on contact | `server.js` – uncomment nodemailer block + fill `.env` |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Serves the portfolio |
| `GET` | `/api/projects` | Returns projects JSON |
| `POST` | `/api/contact` | Handles contact form submissions |
