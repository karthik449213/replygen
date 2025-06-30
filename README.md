# ReplyGen - AI Email Reply Generator

A modern web application that generates professional email replies using DeepSeek AI. Users can paste any email, select their preferred tone, and receive AI-powered responses instantly.

## Features

- **7 Tone Options**: Professional, Friendly, Apologetic, Enthusiastic, Concise, Detailed, Diplomatic
- **Privacy First**: No signup required, no data storage
- **Lightning Fast**: Generate replies in under 3 seconds
- **Copy & Regenerate**: Easy copy to clipboard and regenerate options
- **Responsive Design**: Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **AI**: DeepSeek LLM via OpenRouter API
- **Database**: In-memory storage (no persistence needed)

## Quick Start (Development)

1. Clone the repository
2. Install dependencies: `npm install`
3. Set environment variable: `OPENROUTER_API_KEY=your_key_here`
4. Run development server: `npm run dev`
5. Open http://localhost:5000

## Production Deployment

### Frontend Deployment (Netlify)

#### Step 1: Prepare Frontend Build
The frontend needs to be built and deployed separately from the backend.

1. **Create a new file**: `netlify.toml` in the root directory:
```toml
[build]
  publish = "dist/public"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Update package.json** to add a build script for frontend only:
```json
{
  "scripts": {
    "build:frontend": "vite build",
    "preview": "vite preview"
  }
}
```

3. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build:frontend`
   - Set publish directory: `dist/public`
   - Deploy site

#### Step 2: Update Frontend API URL
Create a `.env.production` file in the root:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

Update the `apiRequest` function in `client/src/lib/queryClient.ts` to use the environment variable:
```typescript
const baseURL = import.meta.env.VITE_API_URL || '';
```

### Backend Deployment (Render)

#### Step 1: Prepare Backend
1. **Create `render.yaml`** in the root directory:
```yaml
services:
  - type: web
    name: replygen-backend
    env: node
    buildCommand: npm install && npm run build:server
    startCommand: npm run start:server
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENROUTER_API_KEY
        sync: false
```

2. **Update package.json** with backend-specific scripts:
```json
{
  "scripts": {
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node20 --outfile=dist/server.js --external:express",
    "start:server": "node dist/server.js"
  }
}
```

#### Step 2: Deploy to Render
1. **Connect Repository**: Link your GitHub repo to Render
2. **Create Web Service**: 
   - Build Command: `npm install && npm run build:server`
   - Start Command: `npm run start:server`
   - Environment: Node.js
3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `OPENROUTER_API_KEY`: `your_openrouter_api_key_here`
4. **Deploy Service**

## Environment Variables Setup

### OpenRouter API Key Setup

#### 1. Get OpenRouter API Key
- Visit [OpenRouter.ai](https://openrouter.ai/)
- Create an account or sign in
- Go to "Keys" section in your dashboard
- Create a new API key
- Copy the key (starts with `sk-or-...`)

#### 2. Set Environment Variables

**For Render (Backend):**
1. In your Render dashboard
2. Go to your web service
3. Navigate to "Environment" tab
4. Add environment variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: `your_openrouter_api_key_here`

**For Local Development:**
Create a `.env` file in the root directory:
```
OPENROUTER_API_KEY=sk-or-your-key-here
```

### CORS Configuration
The backend is configured to accept requests from any origin in production. For security, update the CORS settings in `server/index.ts` to match your frontend domain:

```typescript
app.use(cors({
  origin: ['https://your-netlify-site.netlify.app'],
  credentials: true
}));
```

## Deployment Checklist

### Before Deploying:

- [ ] Obtain OpenRouter API key
- [ ] Create `netlify.toml` with correct backend URL
- [ ] Create `render.yaml` for backend deployment
- [ ] Update API URLs in frontend code
- [ ] Test locally with production build

### After Deploying:

- [ ] Set `OPENROUTER_API_KEY` in Render environment
- [ ] Update `netlify.toml` redirects with actual backend URL
- [ ] Test email generation functionality
- [ ] Verify copy to clipboard works
- [ ] Check mobile responsiveness

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API client
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                 # Shared TypeScript types
└── package.json
```

## API Documentation

### POST /api/generate-reply

Generate an AI-powered email reply.

**Request Body:**
```json
{
  "email": "The email content to reply to (min 10 characters)",
  "tone": "professional|friendly|apologetic|enthusiastic|concise|detailed|diplomatic"
}
```

**Response:**
```json
{
  "reply": "Generated email reply text",
  "stats": {
    "words": 45,
    "characters": 256,
    "generationTime": "1.2s"
  }
}
```

**Error Responses:**
- `400`: Invalid request data
- `429`: Rate limit exceeded
- `500`: Server error or API key issues

## Troubleshooting

### Common Issues:

1. **"API key not configured" error**:
   - Ensure `OPENROUTER_API_KEY` is set in Render environment
   - Verify the key starts with `sk-or-`

2. **CORS errors**:
   - Update CORS settings in `server/index.ts`
   - Ensure backend URL is correct in `netlify.toml`

3. **Build failures**:
   - Check Node.js version (should be 20+)
   - Verify all dependencies are installed

4. **Frontend not connecting to backend**:
   - Update `VITE_API_URL` environment variable
   - Check `netlify.toml` redirects configuration

### Getting Help:

- Check browser console for frontend errors
- Review Render logs for backend issues
- Verify OpenRouter API key is valid and has credits

## License

MIT License - feel free to use this project for your own applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application uses the DeepSeek model via OpenRouter, which requires API credits. Make sure your OpenRouter account has sufficient credits for generating replies.