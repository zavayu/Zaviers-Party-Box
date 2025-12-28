# PartyBox Server

WebSocket server for PartyBox Online Mode.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on port 8080 by default, or the port specified in the `PORT` environment variable.

## Environment Variables

- `PORT` - Server port (default: 8080)

## Client Configuration

The client should set `VITE_WS_URL` environment variable to point to the WebSocket server URL.

For development:
```bash
VITE_WS_URL=ws://localhost:8080 npm run dev
```

Or create a `.env` file in the client directory:
```
VITE_WS_URL=ws://localhost:8080
```

## Features

- Room creation and management
- Player joining/leaving
- Room state synchronization
- Automatic cleanup of empty rooms
- Graceful disconnect handling

