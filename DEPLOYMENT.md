# iMotora Deployment Guide — Vercel + Render + Supabase

Recommended production architecture:
- **Database:** **Supabase** (Managed PostgreSQL 16 in Mumbai `ap-south-1`, Free tier)
- **Backend + Medusa Admin:** **Render** (`imotora-store` Web Service using `render.yaml`)
- **Storefront (Next.js 15):** **Vercel** (`imotora-store-storefront`, Free tier, global Edge CDN, zero cold starts)

---

## Step 1: Create PostgreSQL Database on Supabase
1. Go to https://supabase.com → **New Project** → Name it `imotora` (Region: **Mumbai `ap-south-1`**).
2. Open **Project Settings → Database → Connection String → URI** → select **Session Pooler** (port `5432`, IPv4 compatible with Render).
3. Copy the URI and replace `[YOUR-PASSWORD]` with your database password.

---

## Step 2: Deploy Medusa Backend + Admin on Render
1. Go to https://dashboard.render.com → **New + → Blueprint** (or **Web Service**).
2. Connect your GitHub repository: `https://github.com/gnanaprakash22594/Imotora.git`.
3. Render automatically reads `render.yaml` (`rootDir: imotora-store`, `buildCommand: npm install && npm run build`, `startCommand: npx medusa db:migrate && npm run start`).
4. Add/verify Environment Variables on Render:
   - `DATABASE_URL` = your Supabase Session Pooler URI from Step 1
   - `NODE_ENV` = `production`
   - `JWT_SECRET` / `COOKIE_SECRET` = auto-generated strong secrets
   - `MEDUSA_BACKEND_URL` = `https://<your-render-service>.onrender.com`
   - `ADMIN_CORS` = `https://<your-render-service>.onrender.com`
   - `STORE_CORS` = `https://<your-vercel-app>.vercel.app,http://localhost:3000`
   - `AUTH_CORS` = `https://<your-vercel-app>.vercel.app,https://<your-render-service>.onrender.com`
   - `STOREFRONT_URL` = `https://<your-vercel-app>.vercel.app`
5. Wait for the first deploy to turn **Live** (`GET /health` → `200 OK`).
6. Open Render's **Shell** tab (or run locally once pointing `DATABASE_URL` to Supabase) and seed the catalog + create your Admin user:
   ```bash
   npm run seed
   npx medusa user -e admin@imotora.in -p YourStrongPassword123!
   ```
   Copy the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...` printed in the seed logs!

---

## Step 3: Deploy Next.js Storefront on Vercel
1. Go to https://vercel.com/new → Import `https://github.com/gnanaprakash22594/Imotora.git`.
2. **IMPORTANT:** Set **Root Directory** to `imotora-store-storefront`.
3. Add Environment Variables:
   - `MEDUSA_BACKEND_URL` = `https://<your-render-service>.onrender.com`
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` = `pk_...` (from Step 2)
   - `NEXT_PUBLIC_BASE_URL` = `https://<your-vercel-app>.vercel.app`
   - `NEXT_PUBLIC_DEFAULT_REGION` = `in`
   - `REVALIDATE_SECRET` = any random string
4. Click **Deploy**!

---

## Step 4: Final CORS Sync
Once Vercel gives you your live `https://imotora....vercel.app` URL:
1. Update `STORE_CORS`, `AUTH_CORS`, and `STOREFRONT_URL` on **Render** to match your exact Vercel URL.
2. Save & let Render redeploy (~1 min).

Your live URLs:
- **Storefront:** `https://<your-vercel-app>.vercel.app`
- **Admin Portal:** `https://<your-render-service>.onrender.com/app`
