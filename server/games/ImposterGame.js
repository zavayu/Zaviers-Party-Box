import { BaseGame } from './BaseGame.js'

// Full game data from the pass-and-play version
const GAME_DATA = {
  Animals: {
    emoji: '🦁',
    words: [
      'Elephant', 'Dolphin', 'Penguin', 'Giraffe', 'Kangaroo', 'Octopus',
      'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Eagle', 'Hawk', 'Owl',
      'Shark', 'Whale', 'Jellyfish', 'Seahorse', 'Butterfly', 'Dragonfly',
      'Gorilla', 'Chimpanzee', 'Orangutan', 'Zebra', 'Rhino', 'Hippo',
      'Crocodile', 'Alligator', 'Snake', 'Lizard', 'Turtle', 'Frog',
      'Koala', 'Panda', 'Sloth', 'Cheetah', 'Leopard', 'Jaguar',
      'Deer', 'Moose', 'Buffalo', 'Camel', 'Llama', 'Alpaca'
    ]
  },
  Food: {
    emoji: '🍕',
    words: [
      'Pizza', 'Sushi', 'Tacos', 'Burger', 'Pasta', 'Ramen',
      'Sandwich', 'Salad', 'Steak', 'Chicken', 'Rice', 'Noodles',
      'Curry', 'Soup', 'Chili', 'Burrito', 'Quesadilla', 'Nachos',
      'Lasagna', 'Spaghetti', 'Ravioli', 'Dumpling', 'Spring Roll',
      'Pancakes', 'Waffles', 'French Toast', 'Omelette', 'Bacon',
      'Hot Dog', 'Pretzel', 'Popcorn', 'Ice Cream', 'Cake', 'Cookie',
      'Brownie', 'Donut', 'Muffin', 'Croissant', 'Bagel', 'Toast',
      'Chips', 'Fries', 'Onion Rings', 'Wings', 'Ribs', 'BBQ'
    ]
  },
  Movies: {
    emoji: '🎬',
    words: [
      'Titanic', 'Avatar', 'Inception', 'Jaws', 'Frozen', 'Shrek',
      'Gladiator', 'Matrix', 'Terminator', 'Alien', 'Predator',
      'Rocky', 'Rambo', 'Die Hard', 'Jurassic Park', 'Star Wars',
      'Star Trek', 'Lord of the Rings', 'Harry Potter', 'Batman',
      'Superman', 'Spider-Man', 'Iron Man', 'Avengers', 'Thor',
      'Black Panther', 'Wonder Woman', 'Joker', 'Toy Story', 'Finding Nemo',
      'Up', 'Wall-E', 'Ratatouille', 'Moana', 'Coco', 'Tangled',
      'The Lion King', 'Aladdin', 'Beauty and the Beast', 'Mulan',
      'Pocahontas', 'Hercules', 'Tarzan', 'Bambi', 'Dumbo'
    ]
  },
  Sports: {
    emoji: '⚽',
    words: [
      'Soccer', 'Basketball', 'Tennis', 'Swimming', 'Baseball', 'Hockey',
      'Football', 'Golf', 'Boxing', 'Wrestling', 'Karate', 'Judo',
      'Volleyball', 'Rugby', 'Cricket', 'Badminton', 'Table Tennis',
      'Skiing', 'Snowboarding', 'Skateboarding', 'Surfing', 'Diving',
      'Gymnastics', 'Track', 'Marathon', 'Cycling', 'Archery', 'Fencing',
      'Bowling', 'Darts', 'Pool', 'Lacrosse', 'Polo', 'Rowing',
      'Sailing', 'Rock Climbing', 'Yoga', 'Pilates', 'CrossFit'
    ]
  },
  Professions: {
    emoji: '👨‍⚕️',
    words: [
      'Doctor', 'Teacher', 'Chef', 'Firefighter', 'Pilot', 'Engineer',
      'Nurse', 'Dentist', 'Lawyer', 'Judge', 'Police Officer', 'Detective',
      'Scientist', 'Astronaut', 'Architect', 'Artist', 'Musician', 'Actor',
      'Writer', 'Journalist', 'Photographer', 'Designer', 'Developer',
      'Farmer', 'Fisherman', 'Carpenter', 'Plumber', 'Electrician',
      'Mechanic', 'Barber', 'Stylist', 'Veterinarian', 'Zookeeper',
      'Librarian', 'Accountant', 'Banker', 'Cashier', 'Waiter', 'Bartender',
      'Baker', 'Butcher', 'Tailor', 'Soldier', 'Sailor', 'Marine'
    ]
  },
  Countries: {
    emoji: '🌍',
    words: [
      'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
      'UK', 'France', 'Germany', 'Italy', 'Spain', 'Portugal',
      'Russia', 'China', 'Japan', 'South Korea', 'India', 'Thailand',
      'Australia', 'New Zealand', 'Egypt', 'South Africa', 'Kenya',
      'Greece', 'Turkey', 'Poland', 'Sweden', 'Norway', 'Denmark',
      'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Ireland',
      'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore'
    ]
  },
  Cities: {
    emoji: '🏙️',
    words: [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Boston',
      'London', 'Paris', 'Rome', 'Madrid', 'Barcelona', 'Berlin',
      'Tokyo', 'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 'Singapore',
      'Dubai', 'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Montreal',
      'Amsterdam', 'Vienna', 'Prague', 'Budapest', 'Athens', 'Istanbul',
      'Moscow', 'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki', 'Dublin',
      'Lisbon', 'Bangkok', 'Mumbai', 'Delhi', 'Rio', 'Buenos Aires'
    ]
  },
  Brands: {
    emoji: '🏷️',
    words: [
      'Apple', 'Samsung', 'Google', 'Microsoft', 'Amazon', 'Facebook',
      'Nike', 'Adidas', 'Puma', 'Reebok', 'Coca-Cola', 'Pepsi',
      'McDonald\'s', 'Burger King', 'KFC', 'Starbucks', 'Subway',
      'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla',
      'Sony', 'Nintendo', 'PlayStation', 'Xbox', 'Disney', 'Netflix',
      'Spotify', 'YouTube', 'Instagram', 'Twitter', 'TikTok',
      'IKEA', 'Lego', 'Barbie', 'Hot Wheels', 'Marvel', 'DC Comics'
    ]
  },
  Instruments: {
    emoji: '🎸',
    words: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Cello', 'Bass',
      'Flute', 'Clarinet', 'Saxophone', 'Trumpet', 'Trombone', 'Tuba',
      'Harmonica', 'Accordion', 'Banjo', 'Ukulele', 'Mandolin', 'Harp',
      'Xylophone', 'Marimba', 'Tambourine', 'Bongos', 'Cymbals',
      'Keyboard', 'Synthesizer', 'Organ', 'Bagpipes', 'Oboe', 'Bassoon'
    ]
  },
  Colors: {
    emoji: '🎨',
    words: [
      'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple',
      'Pink', 'Brown', 'Black', 'White', 'Gray', 'Silver',
      'Gold', 'Beige', 'Tan', 'Navy', 'Turquoise', 'Teal',
      'Cyan', 'Magenta', 'Lime', 'Olive', 'Maroon', 'Crimson',
      'Scarlet', 'Indigo', 'Violet', 'Lavender', 'Coral', 'Salmon'
    ]
  },
  Vehicles: {
    emoji: '🚗',
    words: [
      'Car', 'Truck', 'Motorcycle', 'Bicycle', 'Scooter', 'Bus',
      'Train', 'Subway', 'Tram', 'Airplane', 'Helicopter', 'Jet',
      'Boat', 'Ship', 'Yacht', 'Submarine', 'Rocket', 'Spaceship',
      'Tank', 'Ambulance', 'Fire Truck', 'Police Car', 'Taxi',
      'Van', 'SUV', 'Sedan', 'Coupe', 'Convertible', 'Limousine',
      'Tractor', 'Bulldozer', 'Crane', 'Forklift', 'Golf Cart'
    ]
  },
  Furniture: {
    emoji: '🛋️',
    words: [
      'Chair', 'Table', 'Sofa', 'Bed', 'Desk', 'Dresser',
      'Bookshelf', 'Cabinet', 'Wardrobe', 'Nightstand', 'Ottoman',
      'Bench', 'Stool', 'Armchair', 'Recliner', 'Couch', 'Loveseat',
      'Coffee Table', 'Dining Table', 'End Table', 'Lamp', 'Mirror',
      'Rug', 'Curtain', 'Mattress', 'Pillow', 'Blanket', 'Drawer'
    ]
  },
  Technology: {
    emoji: '💻',
    words: [
      'Computer', 'Laptop', 'Tablet', 'Smartphone', 'Smartwatch',
      'Mouse', 'Keyboard', 'Monitor', 'Printer', 'Scanner', 'Camera',
      'Headphones', 'Speaker', 'Microphone', 'Router', 'Modem',
      'USB Drive', 'Hard Drive', 'SSD', 'RAM', 'CPU', 'GPU',
      'Drone', 'Robot', 'VR Headset', 'TV', 'Remote', 'Console',
      'Charger', 'Battery', 'Cable', 'Bluetooth', 'WiFi', 'GPS'
    ]
  },
  Clothing: {
    emoji: '👕',
    words: [
      'T-Shirt', 'Jeans', 'Dress', 'Skirt', 'Pants', 'Shorts',
      'Jacket', 'Coat', 'Hoodie', 'Sweater', 'Cardigan', 'Blazer',
      'Suit', 'Tie', 'Scarf', 'Hat', 'Cap', 'Beanie', 'Gloves',
      'Socks', 'Shoes', 'Boots', 'Sneakers', 'Sandals', 'Heels',
      'Belt', 'Vest', 'Tank Top', 'Polo Shirt', 'Blouse', 'Leggings',
      'Swimsuit', 'Bikini', 'Underwear', 'Pajamas', 'Robe', 'Kimono'
    ]
  },
  Weather: {
    emoji: '⛅',
    words: [
      'Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy', 'Windy',
      'Stormy', 'Thunder', 'Lightning', 'Hail', 'Sleet', 'Drizzle',
      'Hurricane', 'Tornado', 'Blizzard', 'Monsoon', 'Rainbow',
      'Hot', 'Cold', 'Warm', 'Cool', 'Humid', 'Dry', 'Frost'
    ]
  },
  School: {
    emoji: '📚',
    words: [
      'Math', 'Science', 'English', 'History', 'Geography', 'Art',
      'Music', 'PE', 'Biology', 'Chemistry', 'Physics', 'Literature',
      'Writing', 'Reading', 'Spelling', 'Grammar', 'Algebra', 'Geometry',
      'Calculus', 'Economics', 'Psychology', 'Sociology', 'Philosophy',
      'Drama', 'Theater', 'Dance', 'Computer Science', 'Languages'
    ]
  },
  Superheroes: {
    emoji: '🦸',
    words: [
      'Superman', 'Batman', 'Spider-Man', 'Wonder Woman', 'Iron Man',
      'Captain America', 'Thor', 'Hulk', 'Black Widow', 'Hawkeye',
      'Flash', 'Aquaman', 'Green Lantern', 'Cyborg', 'Black Panther',
      'Doctor Strange', 'Scarlet Witch', 'Vision', 'Ant-Man', 'Wasp',
      'Deadpool', 'Wolverine', 'Storm', 'Cyclops', 'Jean Grey',
      'Captain Marvel', 'Star-Lord', 'Gamora', 'Rocket', 'Groot'
    ]
  },
  Body: {
    emoji: '🫀',
    words: [
      'Head', 'Brain', 'Eyes', 'Ears', 'Nose', 'Mouth', 'Teeth',
      'Tongue', 'Neck', 'Shoulders', 'Arms', 'Elbows', 'Wrists',
      'Hands', 'Fingers', 'Chest', 'Heart', 'Lungs', 'Stomach',
      'Back', 'Spine', 'Hips', 'Legs', 'Knees', 'Ankles', 'Feet',
      'Toes', 'Skin', 'Hair', 'Nails', 'Blood', 'Bones', 'Muscles'
    ]
  },
  Hobbies: {
    emoji: '🎯',
    words: [
      'Reading', 'Writing', 'Drawing', 'Painting', 'Photography',
      'Cooking', 'Baking', 'Gardening', 'Hiking', 'Camping', 'Fishing',
      'Gaming', 'Collecting', 'Knitting', 'Sewing', 'Crafting',
      'Dancing', 'Singing', 'Playing Music', 'Watching Movies',
      'Bird Watching', 'Traveling', 'Blogging', 'Vlogging', 'Podcasting',
      'Woodworking', 'Pottery', 'Origami', 'Puzzles', 'Board Games'
    ]
  },
  VideoGames: {
    emoji: '🎮',
    words: [
      'Super Mario', 'Zelda', 'Halo', 'Call of Duty', 'Fortnite', 'Minecraft',
      'League of Legends', 'Overwatch', 'Apex Legends', 'Valorant', 'Counter-Strike', 'PUBG',
      'Elden Ring', 'Dark Souls', 'Bloodborne', 'Sekiro', 'Genshin Impact', 'Honkai Star Rail',
      'Stardew Valley', 'Animal Crossing', 'Pokemon', 'Final Fantasy', 'Kingdom Hearts', 'Persona',
      'Street Fighter', 'Tekken', 'Mortal Kombat', 'Smash Bros', 'Rocket League', 'FIFA',
      'NBA 2K', 'Madden', 'The Sims', 'SimCity', 'Civilization', 'Age of Empires',
      'Portal', 'Half-Life', 'Bioshock', 'Mass Effect', 'Dragon Age', 'Skyrim'
    ]
  },
  Animes: {
    emoji: '🍥',
    words: [
      'Naruto', 'One Piece', 'Bleach', 'Dragon Ball', 'Attack on Titan', 'My Hero Academia',
      'Demon Slayer', 'Jujutsu Kaisen', 'Fullmetal Alchemist', 'Death Note', 'Cowboy Bebop', 'Samurai Champloo',
      'Spy x Family', 'Chainsaw Man', 'Haikyuu', 'Kuroko no Basket', 'Slam Dunk', 'Yuri on Ice',
      'Sailor Moon', 'Cardcaptor Sakura', 'Inuyasha', 'Yu Yu Hakusho', 'Hunter x Hunter', 'Fairy Tail',
      'Tokyo Ghoul', 'Blue Exorcist', 'Black Clover', 'One Punch Man', 'Mob Psycho 100', 'Gintama',
      'Neon Genesis Evangelion', 'Steins;Gate', 'Your Name', 'Weathering With You', 'Princess Mononoke', 'Spirited Away'
    ]
  },
  Nature: {
    emoji: '🏔️',
    words: [
      'Mountain', 'River', 'Lake', 'Ocean', 'Beach', 'Forest',
      'Desert', 'Jungle', 'Waterfall', 'Cave', 'Valley', 'Hill',
      'Volcano', 'Island', 'Cliff', 'Canyon', 'Meadow', 'Field',
      'Pond', 'Stream', 'Glacier', 'Iceberg', 'Reef', 'Swamp',
      'Tree', 'Flower', 'Grass', 'Rock', 'Stone', 'Sand', 'Soil'
    ]
  }
}

export class ImposterGame extends BaseGame {
  constructor(room) {
    super(room)
    this.gameType = 'secret-word'
  }

  initializeGame(selectedCategory = null) {
    // Use selected category or pick random one
    const categories = Object.keys(GAME_DATA)
    const category = selectedCategory && GAME_DATA[selectedCategory] ? selectedCategory : this.getRandomElement(categories)
    const words = GAME_DATA[category].words
    const secretWord = this.getRandomElement(words)

    // Assign random imposters (1 imposter for now)
    const playerIds = Array.from(this.room.players.keys())
    const shuffled = this.shuffleArray(playerIds)
    const imposters = [shuffled[0]] // 1 imposter

    // Initialize game state
    this.room.gameState = {
      secretWord,
      category,
      imposters,
      votes: {},
      chatMessages: [],
      currentTurnPlayerId: null,
      turnOrder: [],
      selectedCategory: category // Store the selected category
    }

    console.log(`Imposter game initialized in room ${this.room.code} with category: ${category}`)
    return true
  }

  getPlayerGameState(playerId) {
    const isImposter = this.room.gameState.imposters.includes(playerId)
    return {
      isImposter,
      secretWord: isImposter ? null : this.room.gameState.secretWord
    }
  }

  handleGameMessage(playerId, message) {
    switch (message.type) {
      case 'sendChatMessage':
        return this.handleChatMessage(playerId, message.message)
      case 'vote':
        return this.handleVote(playerId, message.votedPlayerId)
      default:
        return { success: false, error: `Unknown message type: ${message.type}` }
    }
  }

  handleChatMessage(playerId, messageText) {
    // Check if in discussion phase
    if (this.room.gamePhase !== 'discussion') {
      return { success: false, error: 'Chat is only available during discussion phase' }
    }

    // Check if it's the player's turn
    if (this.room.gameState.currentTurnPlayerId !== playerId) {
      return { success: false, error: 'It is not your turn to chat' }
    }

    // Validate message (single word, no empty messages)
    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) {
      return { success: false, error: 'Message cannot be empty' }
    }

    // Check if it's a single word (no spaces)
    if (trimmedMessage.includes(' ')) {
      return { success: false, error: 'Please send only one word at a time' }
    }

    // Add message to chat
    const player = this.room.players.get(playerId)
    const chatMessage = {
      playerId,
      playerName: player.name,
      message: trimmedMessage,
      timestamp: Date.now()
    }

    this.room.gameState.chatMessages.push(chatMessage)

    // Move to next player's turn
    const currentIndex = this.room.gameState.turnOrder.indexOf(playerId)
    const nextIndex = (currentIndex + 1) % this.room.gameState.turnOrder.length
    this.room.gameState.currentTurnPlayerId = this.room.gameState.turnOrder[nextIndex]

    console.log(`Chat message from ${player.name} in room ${this.room.code}: "${trimmedMessage}"`)
    return { success: true }
  }

  handleVote(playerId, votedPlayerId) {
    // Check if voting phase
    if (this.room.gamePhase !== 'voting') {
      return { success: false, error: 'Not in voting phase' }
    }

    // Check if voted player exists
    if (!this.room.players.has(votedPlayerId)) {
      return { success: false, error: 'Invalid player to vote for' }
    }

    // Can't vote for yourself
    if (playerId === votedPlayerId) {
      return { success: false, error: 'Cannot vote for yourself' }
    }

    // Record vote
    this.room.gameState.votes[playerId] = votedPlayerId

    console.log(`Player ${playerId} voted for ${votedPlayerId} in room ${this.room.code}`)
    return { success: true }
  }

  canAdvancePhase(newPhase) {
    switch (newPhase) {
      case 'discussion':
        return { canAdvance: true }
      case 'voting':
        return { canAdvance: true }
      case 'results':
        // Ensure everyone has voted
        const votesCount = Object.keys(this.room.gameState.votes).length
        const playersCount = this.room.players.size
        if (votesCount < playersCount) {
          return { 
            canAdvance: false, 
            error: `Not all players have voted yet. ${playersCount - votesCount} player(s) still need to vote.` 
          }
        }
        return { canAdvance: true }
      default:
        return { canAdvance: true }
    }
  }

  onPhaseAdvanced(newPhase) {
    if (newPhase === 'discussion') {
      this.setupDiscussionTurns()
    }
  }

  setupDiscussionTurns() {
    // Create randomized turn order
    const playerIds = Array.from(this.room.players.keys())
    const shuffledOrder = this.shuffleArray(playerIds)
    
    this.room.gameState.turnOrder = shuffledOrder
    this.room.gameState.currentTurnPlayerId = shuffledOrder[0]
    this.room.gameState.chatMessages = []
    
    console.log(`Discussion turns set up for room ${this.room.code}. Turn order:`, shuffledOrder)
  }

  resetGame() {
    this.room.gameState = {
      secretWord: null,
      category: null,
      imposters: [],
      votes: {},
      chatMessages: [],
      currentTurnPlayerId: null,
      turnOrder: [],
      selectedCategory: null // Reset selected category
    }
  }

  // Helper method to get available categories
  getAvailableCategories() {
    return Object.keys(GAME_DATA).map(category => ({
      name: category,
      emoji: GAME_DATA[category].emoji,
      wordCount: GAME_DATA[category].words.length
    }))
  }
}