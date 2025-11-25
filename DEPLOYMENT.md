# Deployment Guide

Complete guide for deploying the Orizon Landing Page to production environments.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [AWS (S3 + CloudFront)](#aws-s3--cloudfront)
  - [Docker](#docker)
  - [Traditional Server (VPS)](#traditional-server-vps)
- [Environment Configuration](#environment-configuration)
- [Build Optimization](#build-optimization)
- [Post-Deployment](#post-deployment)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure the following:

### Code Quality

- [ ] All tests pass (if implemented)
- [ ] No ESLint errors
  ```bash
  npm run lint
  ```
- [ ] TypeScript compilation succeeds
  ```bash
  npx tsc --noEmit
  ```
- [ ] Production build succeeds
  ```bash
  npm run build
  ```

### Performance

- [ ] Lighthouse score > 90 (Performance)
- [ ] Images optimized (AVIF/WebP formats)
- [ ] Unused code removed
- [ ] Console logs removed (automatic in production)

### Content

- [ ] All placeholder text replaced
- [ ] Contact information updated
- [ ] Social media links correct
- [ ] All videos uploaded to public folder or CDN
- [ ] Favicon and metadata configured

### Security

- [ ] Environment variables secured
- [ ] No sensitive data in code
- [ ] HTTPS configured
- [ ] CORS policies set (if using API)

### SEO

- [ ] Meta tags configured
- [ ] Open Graph tags added
- [ ] Sitemap generated
- [ ] Robots.txt configured

---

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications (created by the Next.js team).

#### Advantages
- Zero configuration for Next.js
- Automatic HTTPS
- Global CDN
- Automatic preview deployments
- Edge Functions support
- Built-in analytics

#### Deployment Steps

**Method 1: GitHub Integration (Recommended)**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./landing (if in subdirectory)
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables** (if any)
   - Go to Project Settings > Environment Variables
   - Add variables for Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at `https://your-project.vercel.app`

**Method 2: Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Navigate to project directory
   cd landing

   # First deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Follow prompts**
   - Set up and deploy? Yes
   - Which scope? (Your account)
   - Link to existing project? No
   - Project name? orizon-landing
   - Directory? ./
   - Override settings? No

#### Custom Domain

1. Go to Project Settings > Domains
2. Add your domain (e.g., `orizon.agency`)
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)

#### Continuous Deployment

Vercel automatically deploys on:
- **Push to main**: Production deployment
- **Push to other branches**: Preview deployment
- **Pull requests**: Preview deployment with unique URL

---

### Netlify

Alternative platform with similar features to Vercel.

#### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect GitHub account
   - Select repository

3. **Build Settings**
   ```
   Base directory: landing
   Build command: npm run build
   Publish directory: .next
   ```

4. **Deploy**
   - Click "Deploy site"
   - Site will be live at `https://random-name.netlify.app`

#### Custom Domain

1. Go to Domain settings
2. Add custom domain
3. Configure DNS with your provider
4. Enable HTTPS (automatic)

---

### AWS (S3 + CloudFront)

For full control and integration with AWS services.

#### Prerequisites

- AWS Account
- AWS CLI installed
- S3 bucket created
- CloudFront distribution

#### Deployment Steps

1. **Build for Static Export**

   Modify `next.config.js`:
   ```javascript
   module.exports = {
     output: 'export',
     images: {
       unoptimized: true, // S3 doesn't support Next.js Image Optimization
     },
   };
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter: Access Key ID, Secret Access Key, Region, Output format
   ```

4. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://orizon-landing --region us-east-1
   ```

5. **Upload to S3**
   ```bash
   aws s3 sync out/ s3://orizon-landing --delete
   ```

6. **Configure S3 for Static Website**
   ```bash
   aws s3 website s3://orizon-landing \
     --index-document index.html \
     --error-document 404.html
   ```

7. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::orizon-landing/*"
       }
     ]
   }
   ```

8. **Create CloudFront Distribution**
   - Origin: S3 bucket endpoint
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Compress Objects: Yes
   - Price Class: Use All Edge Locations

9. **Configure Custom Domain** (Route 53)
   - Create hosted zone for your domain
   - Add A record pointing to CloudFront distribution
   - Request SSL certificate in ACM

#### Deployment Script

Create `scripts/deploy-aws.sh`:
```bash
#!/bin/bash

# Build
npm run build

# Upload to S3
aws s3 sync out/ s3://orizon-landing --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

---

### Docker

For containerized deployments.

#### Dockerfile

Create `Dockerfile`:
```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### .dockerignore

Create `.dockerignore`:
```
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log
```

#### Build & Run

```bash
# Build image
docker build -t orizon-landing .

# Run container
docker run -p 3000:3000 orizon-landing

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  orizon-landing
```

#### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

### Traditional Server (VPS)

For deployment on DigitalOcean, Linode, AWS EC2, etc.

#### Prerequisites

- Ubuntu 20.04+ server
- SSH access
- Domain name

#### Server Setup

1. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   node --version  # Should be v18.x.x
   ```

4. **Install PM2**
   ```bash
   npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/orizon-landing.git
   cd orizon-landing/landing
   ```

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Build**
   ```bash
   npm run build
   ```

8. **Start with PM2**
   ```bash
   pm2 start npm --name "orizon-landing" -- start
   pm2 save
   pm2 startup
   ```

#### Nginx Configuration

1. **Install Nginx**
   ```bash
   apt install -y nginx
   ```

2. **Configure Site**
   ```bash
   nano /etc/nginx/sites-available/orizon-landing
   ```

   ```nginx
   server {
       listen 80;
       server_name orizon.agency www.orizon.agency;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/orizon-landing /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

#### SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d orizon.agency -d www.orizon.agency

# Auto-renewal test
certbot renew --dry-run
```

#### Deployment Script

Create `scripts/deploy.sh`:
```bash
#!/bin/bash

# Pull latest code
cd /var/www/orizon-landing/landing
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart PM2
pm2 restart orizon-landing

echo "Deployment complete!"
```

---

## Environment Configuration

### Environment Variables

Create `.env.production`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.orizon.agency

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=false

# Contact Form
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

### Platform-Specific Setup

**Vercel:**
- Add in Project Settings > Environment Variables
- Separate values for Production, Preview, Development

**Netlify:**
- Add in Site Settings > Environment Variables
- All environments or specific contexts

**AWS:**
- Store in AWS Systems Manager Parameter Store
- Access via AWS SDK in application

---

## Build Optimization

### 1. Image Optimization

```bash
# Install image optimization tools
npm install -D @next/bundle-analyzer

# Optimize images before commit
# Use tools like TinyPNG, Squoosh, or ImageOptim
```

### 2. Code Splitting

Already configured via Next.js dynamic imports:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <Spinner />
});
```

### 3. Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true npm run build"

# Run analysis
npm run analyze
```

### 4. Compression

Enable compression in `next.config.js`:
```javascript
module.exports = {
  compress: true,
};
```

---

## Post-Deployment

### Verify Deployment

1. **Check Site is Live**
   - Visit your production URL
   - Test all sections load correctly
   - Verify animations work

2. **Test Performance**
   - Run Lighthouse audit
   - Check loading time
   - Verify Core Web Vitals

3. **Check Functionality**
   - Test navigation
   - Verify contact form (if implemented)
   - Check responsive design on mobile

4. **Monitor Errors**
   - Check browser console for errors
   - Review server logs
   - Set up error tracking (Sentry)

### SEO Configuration

Add to `src/app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Orizon Agency - Digital Excellence',
  description: 'Leading digital agency specializing in web development, UI/UX design, and brand strategy.',
  keywords: 'web development, UI/UX design, digital agency, brand strategy',
  authors: [{ name: 'Orizon Agency' }],
  openGraph: {
    title: 'Orizon Agency',
    description: 'Leading digital agency',
    url: 'https://orizon.agency',
    siteName: 'Orizon Agency',
    images: [
      {
        url: 'https://orizon.agency/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orizon Agency',
    description: 'Leading digital agency',
    images: ['https://orizon.agency/twitter-image.png'],
  },
};
```

### Sitemap

Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://orizon.agency',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
```

### Robots.txt

Create `src/app/robots.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://orizon.agency/sitemap.xml',
  };
}
```

---

## Monitoring & Analytics

### Google Analytics

1. **Install Package**
   ```bash
   npm install @next/third-parties
   ```

2. **Add to Layout**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     );
   }
   ```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
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

### Error Tracking (Sentry)

1. **Install**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Initialize**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure**
   Files will be auto-generated:
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`

---

## Troubleshooting

### Common Issues

#### 1. Build Fails

**Error:** `Build failed with exit code 1`

**Solution:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Images Not Loading

**Error:** 404 on image resources

**Solution:**
- Ensure images are in `public/` folder
- Use correct paths (no `/public` prefix)
- Check file extensions are lowercase

#### 3. Environment Variables Not Working

**Error:** `undefined` when accessing `process.env.NEXT_PUBLIC_*`

**Solution:**
- Ensure variables start with `NEXT_PUBLIC_`
- Rebuild after changing env vars
- Check platform-specific env var configuration

#### 4. Animations Not Working in Production

**Error:** GSAP animations don't trigger

**Solution:**
- Ensure GSAP is in dependencies, not devDependencies
- Check ScrollTrigger is registered
- Verify window/document checks for SSR

#### 5. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
      ],
    },
  ];
}
```

### Performance Issues

If site is slow:

1. **Check Bundle Size**
   ```bash
   npm run analyze
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Enable AVIF/WebP formats
   - Lazy load images below fold

3. **Reduce JavaScript**
   - Dynamic imports for heavy components
   - Remove unused dependencies
   - Code splitting

4. **Enable Caching**
   - Configure CDN cache headers
   - Use service workers (optional)

---

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Traditional Server

```bash
# Create backup before deployment
cp -r /var/www/orizon-landing /var/www/orizon-landing-backup

# Rollback if needed
rm -rf /var/www/orizon-landing
mv /var/www/orizon-landing-backup /var/www/orizon-landing
pm2 restart orizon-landing
```

### Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force  # Be careful!
```

---

## Continuous Deployment

### GitHub Actions

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

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Conclusion

Your Orizon Landing Page is now ready for production deployment. Choose the platform that best fits your needs:

- **Vercel**: Easiest, best for Next.js (Recommended)
- **Netlify**: Good alternative to Vercel
- **AWS**: Full control, enterprise features
- **Docker**: Portable, containerized
- **VPS**: Traditional hosting, full control

For most cases, **Vercel with GitHub integration** provides the best developer experience and performance.

Need help? Refer to:
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Development setup
- Platform-specific documentation

Happy deploying!
