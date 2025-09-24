## Render deployment guide (microservices + SPA)

This repo now includes microservices under `server/services/*` and a client SPA under `client/`.

### Services
- Gateway: `server/services/gateway/index.js`
- Auth: `server/services/auth/index.js`
- Transactions: `server/services/transactions/index.js`
- Reminders: `server/services/reminders/index.js`

### Environment variables
Set these on Render as appropriate.

Common (Auth, Transactions, Reminders):
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret

Gateway only:
- `ALLOWED_ORIGINS`: Comma-separated origins (e.g. `https://your-site.onrender.com,http://localhost:3000`)
- `AUTH_SERVICE_URL`: URL of Auth service (e.g. `https://<auth-service>.onrender.com`)
- `TXN_SERVICE_URL`: URL of Transactions service
- `REM_SERVICE_URL`: URL of Reminders service

Client (Static Site or preview build):
- `REACT_APP_API_BASE`: Gateway base URL (e.g. `https://<gateway>.onrender.com`)

### Start commands (Render)

Node services (use in the respective Render Web Services):
- Gateway: `cd server && npm i && npm run start:gateway`
- Auth: `cd server && npm i && npm run start:auth`
- Transactions: `cd server && npm i && npm run start:transactions`
- Reminders: `cd server && npm i && npm run start:reminders`

Static Site (Client):
- Build command: `cd client && npm ci && npm run build`
- Publish directory: `client/build`

Ensure `client/public/_redirects` exists (already added) so SPA routes are rewritten:
```
/*    /index.html   200
```

### Local development

1) Install deps: `cd server && npm i && cd ../client && npm i`
2) Start services (separate terminals):
   - `cd server && npm run start:auth`
   - `cd server && npm run start:transactions`
   - `cd server && npm run start:reminders`
   - `cd server && npm run start:gateway`
3) Start client: `cd client && npm start`
4) Set env locally (e.g. `.env` files or shell):
   - All services: `MONGO_URI`, `JWT_SECRET`
   - Gateway: `ALLOWED_ORIGINS=http://localhost:3000`
   - Client: `REACT_APP_API_BASE=http://localhost:4000`

### Notes
- Services are stateless and can be scaled independently in Render.
- The client updates transactions immediately after creation (no reload).
- If you keep the monolith (`server/index.js`) deployed, ensure the client points to the gateway instead to use microservices.


