# PartyBox 🎉

A collection of interactive party games with both pass-and-play and online multiplayer modes.

## Features

### Pass & Play Mode
- **Secret Word (Imposter)** - Find the imposter who doesn't know the secret word
- **Outlier** - Spot the category that doesn't belong
- **Word Hunt** - Find words containing specific letters
- **Wordle** - Guess the 5-letter word

### Online Multiplayer Mode
- **Secret Word Online** - Play the imposter game with friends remotely
- Real-time WebSocket communication
- Room-based gameplay with join codes
- Automatic reconnection on page refresh
- Host controls and game settings

## Project Structure

```
PartyBox/
├── client/              # React frontend application
│   ├── src/
│   │   ├── games/       # Game components
│   │   ├── components/  # UI components
│   │   ├── game-data/   # Game content and data
│   │   └── hooks/       # Custom React hooks
│   └── package.json
│
└── server/              # Node.js WebSocket server
    ├── games/           # Server-side game logic
    ├── handlers/        # WebSocket message handlers
    ├── models/          # Data models (Room, etc.)
    ├── utils/           # Utility functions
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development

**1. Clone the repository:**
```bash
git clone <repository-url>
cd PartyBox
```

**2. Start the server:**
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:3001`

**3. Start the client (in a new terminal):**
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:5173`

**4. Open your browser:**
- Navigate to `http://localhost:5173`
- Pass & Play mode works immediately
- Online mode requires the server to be running

## Deployment

This application is deployed on Render with separate services for the client and server.

### Server Deployment (Render Web Service)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Deploy and note the server URL

### Client Deployment (Render Static Site)
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the site:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Update the WebSocket URL in your client code to point to your deployed server
5. Deploy

## Game Modes

### Pass & Play
Perfect for local gatherings - no internet connection required. Players take turns using the same device. All games are available in this mode.

### Online Multiplayer
Play with friends remotely using room codes. Currently available for Secret Word (Imposter) game. Features include:
- Real-time communication via WebSocket
- Room creation with unique join codes
- Automatic reconnection on refresh
- Host controls for game management
- Category selection
- Turn-based chat system

## Technology Stack

**Frontend:**
- React - UI framework
- Vite - Build tool and dev server
- Tailwind CSS - Styling
- WebSocket API - Real-time communication

**Backend:**
- Node.js - Runtime environment
- ws - WebSocket library
- Express-style architecture

**Deployment:**
- Render - Hosting platform
- GitHub - Version control

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test both pass-and-play and online modes
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - feel free to use this project for your own party games!