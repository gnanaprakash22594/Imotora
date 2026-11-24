# iMotora Deployment Guide — Cloudflare Workers + Render + Supabase

Architecture:
- **Frontend (Next.js 15 + OpenNext):** **Cloudflare Workers** (`imotora-store-storefront`, global edge CDN, Free tier)
- **Backend + Medusa Admin:** **Render** (`imotora-store` Web Service using `render.yaml`)
- **Database:** **Supabase** (Managed PostgreSQL 16 in Mumbai `ap-south-1`, Free tier)

---

## Step 1: Deploy Frontend on Cloudflare Workers (`imotora-store-storefront`)
1. Go to **https://dash.cloudflare.com** → **Compute (Workers) → Workers & Pages → Create → Import a repository**.
2. Connect GitHub and select **`gnanaprakash22594/Imotora`**.
3. Configure Build Settings:
   - **Project name:** `imotora-storefront`
   - **Root directory:** `imotora-store-storefront`
   - **Build command:** `npm run cf:build`
   - **Deploy command:** `npx wrangler deploy`
4. Add **Build & Runtime Environment Variables**:
   - `MEDUSA_BACKEND_URL` = `https://imotora-medusa-backend.onrender.com` *(update with your actual Render URL once backend is live)*
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` = `pk_temp_placeholder` *(replace with real `pk_...` key after running `npm run seed` on Render)*
   - `NEXT_PUBLIC_BASE_URL` = `https://imotora-storefront.<your-subdomain>.workers.dev`
   - `NEXT_PUBLIC_DEFAULT_REGION` = `in`
   - `REVALIDATE_SECRET` = `imotora-revalidate-2026`
5. Click **Save and Deploy**.

---

## Step 2: Create PostgreSQL Database on Supabase
1. Go to **https://supabase.com** → **New Project** → Name it `imotora` (Region: **Mumbai `ap-south-1`**).
2. Open **Project Settings → Database → Connection String → URI** → choose **Session Pooler** (port `5432`, IPv4 compatible).
3. Copy the URI and replace `[YOUR-PASSWORD]` with your database password.

---

## Step 3: Deploy Medusa Backend + Admin on Render (`imotora-store`)
1. Go to **https://dashboard.render.com** → **New + → Blueprint** (or **Web Service**) → Connect **`gnanaprakash22594/Imotora`**.
2. Verify settings (auto-loaded from `render.yaml`):
   - **Root Directory:** `imotora-store`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx medusa db:migrate && npm run start`
3. Set Environment Variables on Render:
   - `DATABASE_URL` = Supabase Session Pooler URI (from Step 2)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` & `COOKIE_SECRET` = strong random strings
   - `MEDUSA_BACKEND_URL` = `https://<your-render-service>.onrender.com`
   - `ADMIN_CORS` = `https://<your-render-service>.onrender.com`
   - `STORE_CORS` = `https://imotora-storefront.<your-subdomain>.workers.dev,http://localhost:3000`
   - `AUTH_CORS` = `https://imotora-storefront.<your-subdomain>.workers.dev,https://<your-render-service>.onrender.com`
   - `STOREFRONT_URL` = `https://imotora-storefront.<your-subdomain>.workers.dev`
4. Once Render shows **Live**, open **Shell** on Render and run:
   ```bash
   npm run seed
   npx medusa user -e admin@imotora.in -p YourStrongPassword123!
   ```
5. Copy the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...` printed in the seed output!

---

## Step 4: Connect Frontend to Live Backend
1. Go back to **Cloudflare Dashboard → Workers & Pages → `imotora-storefront` → Settings → Variables and Secrets**.
2. Update:
   - `MEDUSA_BACKEND_URL` → your exact Render URL (`https://<your-render-service>.onrender.com`)
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` → your real `pk_...` key from Step 3
   - `NEXT_PUBLIC_BASE_URL` → your exact Cloudflare Workers URL
3. Trigger a fresh deployment (**Deployments → Retry deployment**).

Your live URLs:
- **Storefront:** `https://imotora-storefront.<your-subdomain>.workers.dev`
- **Admin Portal:** `https://<your-render-service>.onrender.com/app`
