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
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── topic.service.ts
│   │   │   │   ├── message.service.ts
│   │   │   │   └── search.service.ts
│   │   │   │
│   │   │   └── server.ts         # HTTP + Socket.IO
│   │   │
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                              # Next.js Website
│   │   ├── app/
│   │   │   ├── profile/
│   │   │   │   └── page.tsx              
│   │   │   │
│   │   │   ├── topics/
│   │   │   │   ├── page.tsx              # Browse topics with filters
│   │   │   │   ├── [id]/                 # View single topic + comments
│   │   │   │   │   └── page.tsx
│   │   │   │   └── create/               # Create new topic (protected)
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── users/                    # View other user profiles
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── friends/                  # Friends management
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── messages/                 # Real-time messaging
│   │   │   │   ├── page.tsx              # All conversations
│   │   │   │   └── [id]/                 # Chat with user
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── search/                   # Global search
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── layout.tsx                
│   │   │   ├── page.tsx                  # Landing/Feed page
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthModal.tsx         
│   │   │   │   ├── LoginForm.tsx         
│   │   │   │   └── RegisterForm.tsx      
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx            
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── topics/
│   │   │   │   ├── TopicCard.tsx         # Shows like/comment buttons
│   │   │   │   ├── TopicList.tsx
│   │   │   │   ├── TopicForm.tsx
│   │   │   │   └── TopicTypeFilter.tsx   # Filter by type (education, tourism)
│   │   │   │
│   │   │   ├── comments/
│   │   │   │   ├── CommentList.tsx
│   │   │   │   ├── CommentItem.tsx
│   │   │   │   └── CommentForm.tsx       # Triggers auth modal if not logged in
│   │   │   │
│   │   │   ├── friends/
│   │   │   │   ├── FriendCard.tsx
│   │   │   │   ├── FriendRequestCard.tsx
│   │   │   │   └── AddFriendButton.tsx   # Triggers auth modal
│   │   │   │
│   │   │   ├── messages/
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── MessageInput.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UserCard.tsx
│   │   │   │   └── ProfileHeader.tsx
│   │   │   │
│   │   │   └── ui/                       # Reusable UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx           
│   │   │   └── SocketContext.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                
│   │   │   ├── useRequireAuth.ts         # NEW: Hook for protected actions
│   │   │   ├── useSocket.ts
│   │   │   └── useDebounce.ts            #?
│   │   │
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   │
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   │                
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   └── postcss.config.mjs
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

okan test