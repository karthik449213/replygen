#!/bin/bash

# ReplyGen Deployment Helper Script
# This script helps prepare the project for deployment

echo "🚀 ReplyGen Deployment Helper"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure validated"

# Create deployment builds
echo "📦 Building frontend..."
npm run build 2>/dev/null || echo "⚠️  Frontend build failed - you may need to add build:frontend script"

echo "📦 Building backend..."
npx esbuild server/index.ts --bundle --platform=node --target=node20 --outfile=dist/server.js --packages=external --format=esm 2>/dev/null || echo "⚠️  Backend build failed"

echo "🔧 Deployment files created:"
echo "  - netlify.toml (Netlify configuration)"
echo "  - render.yaml (Render configuration)"
echo "  - .env.production (Environment template)"

echo ""
echo "📋 Next Steps:"
echo "1. Get OpenRouter API Key from https://openrouter.ai/"
echo "2. Deploy backend to Render:"
echo "   - Connect your GitHub repo"
echo "   - Set OPENROUTER_API_KEY environment variable"
echo "   - Deploy using render.yaml"
echo "3. Update netlify.toml with your Render backend URL"
echo "4. Deploy frontend to Netlify:"
echo "   - Connect your GitHub repo"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist/public"
echo ""
echo "🔑 Required Environment Variables:"
echo "  Backend (Render): OPENROUTER_API_KEY"
echo "  Frontend (Netlify): VITE_API_URL (set in netlify.toml redirects)"
echo ""
echo "📖 See README.md for detailed deployment instructions"