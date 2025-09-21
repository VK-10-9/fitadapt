# 🚀 Deployment Guide

This guide covers deploying FitAdapt to various hosting platforms, with detailed instructions for production-ready deployments.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Supabase project set up and configured
- ✅ Environment variables properly set
- ✅ Application tested locally
- ✅ Database schema deployed
- ✅ All dependencies installed
- ✅ Build process working (`npm run build`)

## 🔧 Environment Variables

For all deployment platforms, you'll need these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> 🔒 **Security**: Never expose service role keys on the client side.

## 1. 🟢 Vercel Deployment (Recommended)

Vercel offers the best Next.js hosting experience with zero configuration.

### 1.1 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fitadapt)

### 1.2 Manual Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your personal account or team
- **Link to existing project**: No (for first deployment)
- **What's your project's name**: fitadapt
- **In which directory**: ./
- **Override settings**: No

#### Step 4: Add Environment Variables

**Option A: Via Vercel Dashboard**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Option B: Via CLI**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

#### Step 5: Redeploy
```bash
vercel --prod
```

### 1.3 Custom Domain (Optional)

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase auth settings with new domain

### 1.4 Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 2. 🧡 Netlify Deployment

### 2.1 Via GitHub Integration

#### Step 1: Connect Repository
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the FitAdapt repository

#### Step 2: Configure Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: (leave empty)

#### Step 3: Add Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Add your Supabase credentials

#### Step 4: Deploy
Click "Deploy site" - your site will be live in minutes!

### 2.2 Via Netlify CLI

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login
```bash
netlify login
```

#### Step 3: Initialize
```bash
netlify init
```

#### Step 4: Deploy
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

### 2.3 Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NPM_FLAGS = "--prefix=/dev/null"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

## 3. ⚡ Railway Deployment

### 3.1 Deploy to Railway

#### Step 1: Connect Repository
1. Go to [Railway](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your FitAdapt repository

#### Step 2: Configure Environment
1. Go to your project dashboard
2. Click on your service
3. Navigate to **Variables** tab
4. Add your environment variables

#### Step 3: Deploy
Railway will automatically deploy your application.

### 3.2 Railway Configuration

Create `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 4. 🔵 DigitalOcean App Platform

### 4.1 Deploy via Dashboard

#### Step 1: Create App
1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository

#### Step 2: Configure Build
- **Source Directory**: /
- **Build Command**: `npm run build`
- **Run Command**: `npm start`

#### Step 3: Add Environment Variables
Add your Supabase credentials in the environment variables section.

### 4.2 App Spec Configuration

Create `.do/app.yaml`:

```yaml
name: fitadapt
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/fitadapt
    branch: main
  run_command: npm start
  build_command: npm run build
  http_port: 3000
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_SUPABASE_URL
    scope: RUN_TIME
    value: ${NEXT_PUBLIC_SUPABASE_URL}
  - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
    scope: RUN_TIME
    value: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
```

## 5. 🟦 Azure Static Web Apps

### 5.1 Deploy via GitHub Actions

#### Step 1: Create Static Web App
1. Go to Azure Portal
2. Create a new "Static Web App" resource
3. Connect your GitHub repository

#### Step 2: Configure Build
Azure will automatically detect Next.js and configure the build.

### 5.2 GitHub Actions Workflow

Azure creates this workflow automatically:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: ".next"
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

## 6. 🐳 Docker Deployment

### 6.1 Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

CMD ["npm", "start"]
```

### 6.2 Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fitadapt:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

### 6.3 Deploy to Docker

```bash
# Build image
docker build -t fitadapt .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  fitadapt

# Or use Docker Compose
docker-compose up -d
```

## 7. ☁️ AWS Deployment

### 7.1 AWS Amplify

#### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify
```bash
amplify init
```

#### Step 3: Add Hosting
```bash
amplify add hosting
```

Choose "Amazon CloudFront and S3" for production.

#### Step 4: Deploy
```bash
amplify publish
```

### 7.2 AWS ECS/Fargate

For containerized deployment, you can use the Docker configuration with AWS ECS.

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🔒 Production Security

### 1. Environment Variables
- Never commit secrets to version control
- Use platform-specific secret management
- Rotate keys regularly

### 2. CSP Headers
Add Content Security Policy:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://*.supabase.co;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 3. Rate Limiting
Implement rate limiting for API routes:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const limit = 10; // requests per minute
  const windowMs = 60 * 1000; // 1 minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 0, lastReset: Date.now() });
  }

  const ipData = rateLimit.get(ip);

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  ipData.count++;
  return NextResponse.next();
}
```

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking
Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for user session recording
- **Mixpanel** or **Google Analytics** for user analytics

## 🎉 Post-Deployment

### 1. Update Supabase Settings
- Update Site URL to your production domain
- Add production domain to redirect URLs
- Configure email templates with production URLs

### 2. Test Production
- Test user registration/login
- Verify workout generation
- Check progress tracking
- Test all core features

### 3. Performance Optimization
- Enable compression
- Optimize images
- Implement caching strategies
- Monitor Core Web Vitals

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables Not Working
- Restart your application after adding variables
- Check variable names (case-sensitive)
- Ensure variables are available in the correct environment

#### Database Connection Issues
- Verify Supabase project is active
- Check if your deployment platform IP is allowed
- Test connection from your local environment

### Getting Help

1. Check platform-specific documentation
2. Review build logs for specific errors
3. Test locally before deploying
4. Use platform support channels

Congratulations! Your FitAdapt application is now live and ready for users! 🎉