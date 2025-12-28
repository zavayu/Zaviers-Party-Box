# Deployment Guide

This project consists of two parts that need to be deployed:
1. **Client** - React frontend (static files)
2. **Server** - Node.js WebSocket server

## Recommended: Render Deployment

### Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)

### Automatic Deployment with render.yaml

1. **Push your code to GitHub** including the `render.yaml` file in the root directory

2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` and create both services

3. **Configure Environment Variables:**
   - The server will automatically get a URL like `https://partybox-server-xxx.onrender.com`
   - Set `VITE_WS_URL=wss://partybox-server-xxx.onrender.com` in the client service environment variables

### Manual Deployment

#### Server Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `NODE_ENV=production`

#### Client Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variable:** `VITE_WS_URL=wss://your-server-url.onrender.com`

## Alternative: Hybrid Deployment

### Keep Client on GitHub Pages
1. Update client environment for production WebSocket URL
2. Deploy server to Render/Railway/Heroku
3. Update `VITE_WS_URL` to point to your server

### Client Build for GitHub Pages
```bash
cd client
# Set production WebSocket URL
echo "VITE_WS_URL=wss://your-server-url.onrender.com" > .env.production
npm run build
npm run deploy
```

## Environment Variables

### Client (.env files)
- `VITE_WS_URL` - WebSocket server URL
  - Development: `ws://localhost:8080`
  - Production: `wss://your-server-domain.com`

### Server
- `PORT` - Server port (automatically set by hosting platform)
- `NODE_ENV` - Environment (development/production)

## Local Development

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Production Considerations

### Security
- Server automatically uses HTTPS/WSS in production
- CORS is handled by WebSocket protocol
- No sensitive data stored in client

### Performance
- Client is statically served (fast CDN delivery)
- Server handles WebSocket connections efficiently
- Room cleanup prevents memory leaks

### Monitoring
- Health check endpoint at `/health`
- Server logs connection/disconnection events
- Client has reconnection logic

## Troubleshooting

### WebSocket Connection Issues
1. Check if server is running and accessible
2. Verify WebSocket URL is correct (ws:// for HTTP, wss:// for HTTPS)
3. Check browser console for connection errors
4. Ensure firewall/proxy allows WebSocket connections

### Deployment Issues
1. Check build logs for errors
2. Verify environment variables are set correctly
3. Ensure server health check endpoint responds
4. Check server logs for runtime errors