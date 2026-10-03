# RivalChat

RivalChat is a real-time chat app where friends can talk and challenge each other to quick games.

## Features

- Create an account with your name, email, and password.
- Log in and log out securely with Firebase Authentication.
- Search for other users by username.
- Send, accept, and reject friend requests.
- See which friends are online or when they were last seen.
- Send messages instantly in real time.
- See when a friend is typing.
- Mark messages as read.
- Delete your sent messages.
- Play games inside a chat:
  - Tic Tac Toe
  - Rock Paper Scissors
  - Connect Four
  - Snakes & Ladders
- Play games with live shared game state.
- Use the app on desktop and mobile screens.

## How the data works

RivalChat uses Firebase for authentication and real-time data. User accounts, friend requests, messages, online status, and game state are stored in Firebase Realtime Database.

That data should stay in Firebase. Do not add database exports, passwords, service-account files, or other private data to GitHub.

## Run it locally

Install the dependencies:

```sh
npm install
```

Create a local environment file:

```sh
cp .env.example .env.local
```

Add your Firebase web app values to `.env.local`, then start the development server:

```sh
npm run dev
```

Open the local URL shown by Vite in your browser.

## Create a production build

```sh
npm run build
```

The finished website is created in the `dist` folder.

## Deploy with Netlify

The repository includes Netlify settings in `netlify.toml`.

For a GitHub deployment:

1. Import the repository into Netlify.
2. Add the seven `VITE_FIREBASE_*` variables in Netlify site settings.
3. Add the Netlify site domain to Firebase Authentication authorized domains.
4. Deploy the site.

For a quick manual deployment, run `npm run build` and drag the `dist` folder into Netlify.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full deployment and security checklist.

## Main technologies

- React
- Vite
- Firebase Authentication
- Firebase Realtime Database
- Tailwind CSS
