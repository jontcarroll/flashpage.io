# FlashPage.io - Instant Subdomain Creator

A fun and simple website that allows users to instantly create their own subdomain with custom content and a GIF from Klipy.

## Features

- 🚀 Instant subdomain creation (e.g., `my-page.flashpage.io`)
- 📝 Custom page content with title and message
- 🎬 Klipy integration for adding fun GIFs
- 📊 View counter for each page
- 🎨 Beautiful, responsive design with Tailwind CSS
- ⚡ Built with Nuxt 4 and Vue 3
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
npm install
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
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Production Deployment

### Using Docker Compose

1. Set up your environment variables in `.env`:
```env
MONGO_PASSWORD=secure_password_here
KLIPY_API_KEY=your_klipy_api_key
SITE_URL=https://flashpage.io
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

2. Build and run with Docker Compose:
```bash
docker-compose -f docker-compose.production.yml up -d
```

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

## API Endpoints

- `POST /api/subdomains` - Create a new subdomain
- `GET /api/subdomains/check/:slug` - Check subdomain availability
- `GET /api/subdomains/:slug` - Get subdomain data
- `GET /api/klipy/search?q=keyword` - Search GIFs via Klipy

## Project Structure

```
flashpage.io/
├── app/
│   └── pages/
│       ├── index.vue          # Main creation form
│       └── [...subdomain].vue # Dynamic subdomain display
├── server/
│   ├── api/                   # API endpoints
│   ├── middleware/            # Subdomain detection
│   ├── models/               # MongoDB schemas
│   └── utils/                # Database connection
├── assets/
│   └── css/                  # Tailwind styles
├── docker-compose.yml        # Development Docker config
├── docker-compose.production.yml # Production Docker config
├── Dockerfile               # Multi-stage Docker build
├── Caddyfile               # Caddy reverse proxy config
└── nuxt.config.ts          # Nuxt configuration
```

## Security Considerations

- Subdomain names are validated (alphanumeric + hyphens only)
- Content length limits prevent abuse
- MongoDB injection protection via Mongoose
- Rate limiting recommended for production
- HTTPS enforced via Caddy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
