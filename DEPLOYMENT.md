# GitHub and Netlify deployment

## 1. Keep the repository clean

Create a local environment file from the template:

```sh
cp .env.example .env.local
```

Fill `.env.local` with the Firebase web app configuration from Firebase Console. `.env.local`, `dist/`, `node_modules/`, and local tooling files are ignored by Git. Only `.env.example` belongs in the repository.

Firebase web configuration is visible in the browser by design. The API key is not an admin credential. Never put Firebase Admin SDK credentials, service-account JSON, database exports containing user data, passwords, or other private keys in this project.

## 2. Protect the Firebase data

Users, friend requests, messages, presence, and game state already live in Firebase Realtime Database. They should not be copied into GitHub. Before production, review the Realtime Database Rules in Firebase Console and require authenticated access with per-user or per-conversation authorization. Also enable the email/password provider and configure authorized domains, including the Netlify domain.

The existing client reads and writes these paths:

- `users`
- `friendRequests`
- `friends`
- `status`
- `chats`

Export data only as a private backup through Firebase tooling. Store that backup outside the repository with restricted access.

## 3. Deploy on Netlify

1. Push the project folder to a new GitHub repository. Do not commit `.env.local`.
2. Import the repository into Netlify.
3. Netlify will use `npm run build` and publish `dist/` from `netlify.toml`.
4. In Netlify site settings, add the seven `VITE_FIREBASE_*` variables from `.env.local` under **Environment variables**. Apply them to the deploy context you use.
5. In Firebase Authentication, add the Netlify production hostname to **Authorized domains**.
6. Deploy, then test sign-up, login, friend requests, chat, and each game in a private browser window.

## 4. Verify before pushing

```sh
npm ci
npm run build
```

If the build reports missing Firebase variables, configure `.env.local` locally or the matching variables in Netlify. Never solve that by putting credentials back into source code.
