# PartyBox 🎉

A collection of party games with both pass-and-play and online multiplayer modes.

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
├── client/          # React frontend application
│   ├── src/
│   │   ├── games/   # Game components
│   │   ├── components/
│   │   └── hooks/   # Custom React hooks
│   └── package.json
├── server/          # Node.js WebSocket server
│   ├── games/       # Server-side game logic
│   ├── handlers/    # Message handlers
│   ├── models/      # Data models
│   └── package.json
└── render.yaml      # Deployment configuration
```

## Quick Start

### Local Development

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

3. **Open your browser:**
   - Navigate to `http://localhost:5173/Zaviers-Party-Box/`
   - Pass & Play mode works immediately
   - Online mode requires the server to be running

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Render:**
1. Push to GitHub
2. Connect to Render
3. Deploy using the included `render.yaml`

## Game Modes

### Pass & Play
Perfect for local gatherings - no internet connection required. Players take turns using the same device.

### Online Multiplayer
Play with friends remotely using room codes. Features include:
- Real-time communication via WebSocket
- Automatic reconnection
- Host controls
- Category selection
- Turn-based chat system

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, WebSocket (ws library)
- **Deployment:** Render, GitHub Pages
- **Development:** Hot reload, ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both pass-and-play and online modes
5. Submit a pull request

## License

MIT License - feel free to use this project for your own party games!