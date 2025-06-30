# Quick Deployment Guide

## Overview
Deploy ReplyGen to production with Netlify (frontend) + Render (backend) in under 10 minutes.

## Prerequisites
- GitHub repository with your code
- OpenRouter API key ([get one here](https://openrouter.ai/))
- Netlify account
- Render account

## Step 1: Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Go to "Keys" section
4. Create new API key
5. Copy the key (starts with `sk-or-...`)

## Step 2: Deploy Backend (Render)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `replygen-backend`
   - Build Command: `npm install && npx esbuild server/index.ts --bundle --platform=node --target=node20 --outfile=dist/server.js --packages=external --format=esm`
   - Start Command: `node dist/server.js`

3. **Set Environment Variables**
   - Add `OPENROUTER_API_KEY` with your API key
   - Add `NODE_ENV` with value `production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your backend URL (e.g., `https://replygen-backend.onrender.com`)

## Step 3: Deploy Frontend (Netlify)

1. **Update Configuration**
   - Edit `netlify.toml` in your repository
   - Replace `https://your-backend-url.onrender.com` with your actual Render URL

2. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import from Git"
   - Connect your GitHub repository

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Initial build takes 3-5 minutes
   - Your site will be available at a random URL (e.g., `xyz123.netlify.app`)

## Step 4: Test Your Deployment

1. Visit your Netlify site URL
2. Paste a test email
3. Select a tone
4. Click "Generate Reply"
5. Verify the response appears correctly

## Troubleshooting

### "API key not configured" Error
- Check that `OPENROUTER_API_KEY` is set in your Render environment variables
- Verify the key starts with `sk-or-`
- Ensure your OpenRouter account has credits

### Frontend Can't Connect to Backend
- Verify the backend URL in `netlify.toml` is correct
- Check that your Render service is running (green status)
- Look at Render logs for any errors

### Build Failures
- Check that Node.js version is 18+ in both platforms
- Verify all dependencies are listed in `package.json`
- Review build logs for specific error messages

## Custom Domain (Optional)

### Netlify Custom Domain
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Follow DNS configuration instructions

### Environment URLs
- Update `netlify.toml` redirects with your custom domain
- No backend changes needed

## Production Monitoring

### Render Monitoring
- Check service logs in Render dashboard
- Monitor response times and errors
- Set up alerts for downtime

### Netlify Analytics
- Enable Netlify Analytics for traffic insights
- Monitor build success rates
- Check Core Web Vitals

## Security Notes

- OpenRouter API key is only stored on Render (backend)
- Frontend runs entirely in browser (no secrets exposed)
- CORS is properly configured for cross-origin requests
- No user data is stored or logged

## Cost Estimates

- **Netlify**: Free tier supports 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month (sufficient for demos)
- **OpenRouter**: Pay-per-use (typically $0.01-0.10 per request)

---

Your ReplyGen app is now live and ready for users!