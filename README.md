This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Backend & API

A Node.js/Express backend lives in the `server/` directory. It exposes a REST API at `/api/*` used by the frontend for products, categories, orders, blogs and authentication.

### Local setup

1. Copy `server/.env.example` to `server/.env` and set your MongoDB URI and a JWT secret.
2. Install dependencies and start the server:
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. The API will listen on port `5000` by default. The frontend expects the base URL defined in `.env.local` (see below).

### Frontend configuration

The Next.js app uses an environment variable to know where the API lives:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Set this in `.env.local`. When you deploy the backend, update this variable to the public address (e.g. Heroku, Vercel Serverless function, etc.).

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
