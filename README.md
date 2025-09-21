# FlashPage.io - Instant Subdomain Creator

A fun and simple website that allows users to instantly create their own subdomain with custom content and a GIF from Klipy.

## Features

- 🚀 Instant subdomain creation (e.g., `my-page.flashpage.io`)
- 📝 Custom page content with title and message
- 🎬 Klipy integration for adding fun GIFs
- 📊 View counter for each page
- 🎨 Beautiful, responsive design with Tailwind CSS
- ⚡ Built with Nuxt 4 and Nuxt UI v4
- 🔒 Secure with MongoDB backend

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Nuxt Server Routes, Nitro
- **Database**: MongoDB with Mongoose
- **Deployment**: Docker, Caddy, Cloudflare DNS
- **API**: Klipy API for GIF search

## Prerequisites

- Node.js 20+
- MongoDB (local or cloud instance)
- Klipy API key (free from [Klipy Partners](https://partner.klipy.com/api-keys))

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flashpage.io.git
cd flashpage.io
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/flashpage
KLIPY_API_KEY=your_klipy_api_key_here
SITE_URL=http://localhost:3000
```

5. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Cloudflare DNS Configuration

1. Add an A record pointing `flashpage.io` to your server IP
2. Add a CNAME record for `*.flashpage.io` pointing to `flashpage.io`
3. Generate a Cloudflare API token with Zone:DNS:Edit permissions

### Caddy Configuration

Caddy automatically handles:
- SSL certificates via Let's Encrypt
- Wildcard certificate for all subdomains
- Reverse proxy to the Nuxt application
- Security headers

## How It Works

1. **Main Page** (`flashpage.io`): Users fill out a form with:
   - Subdomain name (e.g., "my-awesome-page")
   - Page title
   - Content message
   - Selected GIF from Klipy search

2. **Subdomain Creation**: The app instantly creates the subdomain and stores data in MongoDB

3. **Dynamic Routing**: When someone visits a subdomain:
   - Caddy proxies the request to the Nuxt app
   - Middleware detects the subdomain from the host header
   - The app fetches and displays the corresponding page

4. **No Pre-configuration**: Subdomains work immediately after creation without any DNS changes
