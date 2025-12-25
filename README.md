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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

social-network-platform/
│
├── apps/                         # All runnable applications
│   │
│   ├── backend/                  # API + Realtime server
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.ts
│   │   │   │   ├── env.ts
│   │   │   │   ├── cors.ts
│   │   │   │   └── socket.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── User.model.ts
│   │   │   │   ├── Topic.model.ts
│   │   │   │   ├── Message.model.ts
│   │   │   │   └── FriendRequest.model.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── topic.controller.ts
│   │   │   │   ├── friend.controller.ts
│   │   │   │   ├── message.controller.ts
│   │   │   │   └── search.controller.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── topic.routes.ts
│   │   │   │   ├── friend.routes.ts
│   │   │   │   ├── message.routes.ts
│   │   │   │   └── search.routes.ts
│   │   │   │
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── rateLimit.middleware.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── topic.service.ts
│   │   │   │   ├── message.service.ts
│   │   │   │   └── search.service.ts
│   │   │   │
│   │   │   ├── app.ts            # Express app (REST)
│   │   │   └── server.ts         # HTTP + Socket.IO
│   │   │
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                      # Next.js Website
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   └── middleware.ts
│   │   │
│   │   ├── components/
│   │   ├── styles/
│   │   ├── public/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/                   # React Native (Expo)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/
│   │   │   └── _layout.tsx
│   │   │
│   │   ├── components/
│   │   ├── assets/
│   │   ├── package.json
│   │   └── tsconfig.json
│
├── packages/                     # 🔥 SHARED CODE (THE CONNECTION)
│   │
│   ├── api-client/               # Used by web + mobile
│   │   ├── src/
│   │   │   ├── http.ts           # Axios / fetch wrapper
│   │   │   ├── auth.api.ts
│   │   │   ├── user.api.ts
│   │   │   ├── topic.api.ts
│   │   │   ├── friend.api.ts
│   │   │   └── message.api.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-types/             # Used by ALL (backend/web/mobile)
│   │   ├── src/
│   │   │   ├── user.types.ts
│   │   │   ├── topic.types.ts
│   │   │   ├── message.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── socket-client/            # Shared Socket.IO client
│   │   ├── src/
│   │   │   └── socket.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│
├── docs/
│   ├── architecture.md
│   ├── api-contract.md
│   ├── auth-flow.md
│   └── realtime-flow.md
│
├── .env
├── turbo.json                    # Monorepo orchestration
├── package.json                  # Root dependencies
├── tsconfig.base.json            # Shared TS config
└── README.md
