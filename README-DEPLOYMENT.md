# PartyBox - Deployment Guide

## Architecture Overview

PartyBox now consists of two components:

1. **Client (Frontend)** - React app with pass-and-play and online modes
2. **Server (Backend)** - Node.js WebSocket server for online multiplayer

## Quick Start - Render Deployment (Recommended)

### 1. Automatic Deployment
1. Push your code to GitHub (including the `render.yaml` file)
2. Go to [render.com](https://render.com) and sign up
3. Click "New" → "Blueprint" → Connect your GitHub repo
4. Render will automatically create both client and server services
5. Once deployed, update the client's `VITE_WS_URL` environment variable to point to your server URL

### 2. Get Your URLs
- **Server:** `https://partybox-server-xxx.onrender.com`
- **Client:** `https://partybox-client-xxx.onrender.com`

### 3. Configure WebSocket Connection
In Render dashboard, go to your client service → Environment → Add:
- **Key:** `VITE_WS_URL`
- **Value:** `wss://partybox-server-xxx.onrender.com` (replace with your actual server URL)

## Alternative - GitHub Pages + Render Server

If you want to keep using GitHub Pages for the client:

### 1. Deploy Server to Render
1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Set Root Directory to `server`
4. Deploy and note the server URL

### 2. Deploy Client to GitHub Pages
```bash
# Windows
deploy-github-pages.bat wss://your-server-url.onrender.com

# Linux/Mac
./deploy-github-pages.sh wss://your-server-url.onrender.com
```

## Local Development

```bash
# Terminal 1 - Start server
cd server
npm install
npm start

# Terminal 2 - Start client
cd client
npm install
npm run dev
```

## Environment Configuration

### Development
- Client connects to `ws://localhost:8080`
- Server runs on port 8080

### Production
- Client connects to `wss://your-server-domain.com`
- Server runs on port assigned by hosting platform

## Features

### Pass & Play Mode
- Works entirely offline
- No server connection required
- Perfect for local gatherings

### Online Mode
- Real-time multiplayer via WebSocket
- Automatic reconnection on page refresh
- Room-based gameplay with codes
- Host controls and settings

## Deployment Checklist

- [ ] Server deployed and accessible
- [ ] Client built with correct WebSocket URL
- [ ] HTTPS/WSS used in production
- [ ] Health check endpoint working
- [ ] Environment variables configured
- [ ] Both services auto-deploy on code changes

## Troubleshooting

### "Connection Error" in Online Mode
1. Check if server is running: visit `https://your-server-url.com/health`
2. Verify WebSocket URL in browser dev tools
3. Ensure using `wss://` (not `ws://`) for HTTPS sites

### Build Failures
1. Check build logs in deployment platform
2. Verify all dependencies are in package.json
3. Ensure environment variables are set correctly

### Room Not Found After Refresh
- Rooms are automatically cleaned up after 30 seconds of inactivity
- This is expected behavior to prevent memory leaks