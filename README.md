# Mooood App

This project is a mood tracking application built with React, Vite and a small Express API.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API server in one terminal:
   ```bash
   npm run server
   ```
3. In another terminal start the Vite development server:
   ```bash
   npm run dev
   ```

## API server URL

The frontend expects the API base URL to be supplied via the `VITE_API_BASE_URL` environment variable at build and runtime.

When running locally you can point this variable at the local API server by adding it to a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

For a deployed environment set `VITE_API_BASE_URL` to the URL of the hosted API server.

### Netlify

If you are deploying with Netlify, add `VITE_API_BASE_URL` to your site's Environment
variables so the frontend knows where to reach the API. You can skip running the
local server if you rely entirely on the deployed backend.
