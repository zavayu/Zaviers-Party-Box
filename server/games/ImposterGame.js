import { BaseGame } from './BaseGame.js'
import { getWordHint } from './imposterHints.js'

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
      'Deer', 'Moose', 'Buffalo', 'Camel', 'Llama', 'Alpaca',
      'Axolotl', 'Capybara', 'Meerkat', 'Wombat', 'Narwhal', 'Red Panda',
      'Komodo Dragon', 'Pangolin', 'Armadillo', 'Fennec Fox', 'Manatee', 'Puffin',
      'Quokka', 'Okapi', 'Binturong', 'Tapir', 'Aardvark', 'Ibex',
      'Emu', 'Cassowary', 'Shoebill', 'Orca', 'Beluga', 'Blue Jay'
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
      'Chips', 'Fries', 'Onion Rings', 'Wings', 'Ribs', 'BBQ',
      'Falafel', 'Gnocchi', 'Bibimbap', 'Shawarma', 'Empanada', 'Pierogi',
      'Tamale', 'Samosa', 'Corn Dog', 'Gumbo', 'Churro', 'Tiramisu',
      'Baklava', 'Paella', 'Poutine', 'Moussaka', 'Bruschetta', 'Onigiri',
      'Arepa', 'Shakshuka', 'Ceviche', 'Beignets', 'Gelato', 'Risotto'
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
      'Pocahontas', 'Hercules', 'Tarzan', 'Bambi', 'Dumbo',
      'Knives Out', 'The Truman Show', 'Groundhog Day', 'Back to the Future', 'Home Alone', 'Mean Girls',
      'The Princess Bride', 'The Incredibles', 'Coraline', 'Interstellar', 'The Lego Movie', 'School of Rock'
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
      'Sailing', 'Rock Climbing', 'Yoga', 'Pilates', 'CrossFit',
      'Pickleball', 'Padel', 'Curling', 'Bobsled', 'Futsal', 'Dodgeball',
      'Ultimate Frisbee', 'Disc Golf', 'Sepak Takraw', 'Speed Skating', 'Softball', 'Kayaking',
      'Netball', 'Rounders', 'Luge', 'Skeleton', 'Biathlon', 'Bandy',
      'Lawn Bowls', 'Sumo', 'Mixed Martial Arts', 'Mountain Biking', 'Artistic Swimming', 'Trampoline Gymnastics'
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
      'Baker', 'Butcher', 'Tailor', 'Soldier', 'Sailor', 'Marine',
      'Paramedic', 'Optometrist', 'Court Reporter', 'Park Ranger', 'Crossing Guard', 'Translator',
      'Voice Actor', 'Florist', 'Jeweler', 'Locksmith', 'Flight Attendant', 'Archaeologist'
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
      'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore',
      'Morocco', 'Ghana', 'Nigeria', 'Ethiopia', 'Tanzania', 'Senegal',
      'Ukraine', 'Romania', 'Iceland', 'Croatia', 'Slovakia', 'Latvia'
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
      'Lisbon', 'Bangkok', 'Mumbai', 'Delhi', 'Rio', 'Buenos Aires',
      'Seattle', 'Las Vegas', 'New Orleans', 'Philadelphia', 'San Diego', 'Brussels',
      'Edinburgh', 'Warsaw', 'Cairo', 'Cape Town', 'Nairobi', 'Osaka'
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
      'IKEA', 'Lego', 'Barbie', 'Hot Wheels', 'Marvel', 'DC Comics',
      'Patagonia', 'The North Face', 'Converse', 'Vans', 'Crocs', 'Duolingo',
      'Adobe', 'Canon', 'Fujifilm', 'Dyson', 'Red Bull', 'Doritos'
    ]
  },
  Instruments: {
    emoji: '🎸',
    words: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Cello', 'Bass',
      'Flute', 'Clarinet', 'Saxophone', 'Trumpet', 'Trombone', 'Tuba',
      'Harmonica', 'Accordion', 'Banjo', 'Ukulele', 'Mandolin', 'Harp',
      'Xylophone', 'Marimba', 'Tambourine', 'Bongos', 'Cymbals',
      'Keyboard', 'Synthesizer', 'Organ', 'Bagpipes', 'Oboe', 'Bassoon',
      'French Horn', 'Recorder', 'Triangle', 'Cowbell', 'Timpani', 'Didgeridoo',
      'Sitar', 'Steelpan', 'Ocarina', 'Gong', 'Kalimba', 'Djembe'
    ]
  },
  Colors: {
    emoji: '🎨',
    words: [
      'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple',
      'Pink', 'Brown', 'Black', 'White', 'Gray', 'Silver',
      'Gold', 'Beige', 'Tan', 'Navy', 'Turquoise', 'Teal',
      'Cyan', 'Magenta', 'Lime', 'Olive', 'Maroon', 'Crimson',
      'Scarlet', 'Indigo', 'Violet', 'Lavender', 'Coral', 'Salmon',
      'Mint', 'Peach', 'Mauve', 'Plum', 'Mustard', 'Chartreuse',
      'Sage', 'Burgundy', 'Fuchsia', 'Copper', 'Cream', 'Periwinkle'
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
      'Tractor', 'Bulldozer', 'Crane', 'Forklift', 'Golf Cart',
      'Ferry', 'Hovercraft', 'Hot Air Balloon', 'Glider', 'Trolleybus', 'Monorail',
      'Rickshaw', 'Tuk-Tuk', 'Snowmobile', 'Zamboni', 'Dump Truck', 'Double-Decker Bus'
    ]
  },
  Furniture: {
    emoji: '🛋️',
    words: [
      'Chair', 'Table', 'Sofa', 'Bed', 'Desk', 'Dresser',
      'Bookshelf', 'Cabinet', 'Wardrobe', 'Nightstand', 'Ottoman',
      'Bench', 'Stool', 'Armchair', 'Recliner', 'Couch', 'Loveseat',
      'Coffee Table', 'Dining Table', 'End Table', 'Lamp', 'Mirror',
      'Rug', 'Curtain', 'Mattress', 'Pillow', 'Blanket', 'Drawer',
      'Futon', 'Beanbag Chair', 'Bunk Bed', 'Murphy Bed', 'Chaise Lounge', 'Rocking Chair',
      'Bar Stool', 'Credenza', 'Vanity', 'Piano Bench', 'Room Divider', 'High Chair'
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
      'Charger', 'Battery', 'Cable', 'Bluetooth', 'WiFi', 'GPS',
      'E-Reader', 'Projector', 'Webcam', 'Trackpad', 'Graphics Tablet', 'Smart Doorbell',
      'Robot Vacuum', '3D Printer', 'Dashcam', 'Action Camera', 'Barcode Scanner', 'Digital Photo Frame'
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
      'Swimsuit', 'Bikini', 'Underwear', 'Pajamas', 'Robe', 'Kimono',
      'Overalls', 'Trench Coat', 'Poncho', 'Tracksuit', 'Jumpsuit', 'Tuxedo',
      'Cape', 'Beret', 'Mittens', 'Slippers', 'Loafers', 'Apron'
    ]
  },
  Weather: {
    emoji: '⛅',
    words: [
      'Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy', 'Windy',
      'Stormy', 'Thunder', 'Lightning', 'Hail', 'Sleet', 'Drizzle',
      'Hurricane', 'Tornado', 'Blizzard', 'Monsoon', 'Rainbow',
      'Hot', 'Cold', 'Warm', 'Cool', 'Humid', 'Dry', 'Frost',
      'Heat Wave', 'Cold Front', 'Dust Storm', 'Freezing Rain', 'Wind Chill', 'Flash Flood',
      'Dew', 'Sun Shower', 'Waterspout', 'Whiteout', 'Thundercloud', 'Ice Storm'
    ]
  },
  School: {
    emoji: '📚',
    words: [
      'Math', 'Science', 'English', 'History', 'Geography', 'Art',
      'Music', 'PE', 'Biology', 'Chemistry', 'Physics', 'Literature',
      'Writing', 'Reading', 'Spelling', 'Grammar', 'Algebra', 'Geometry',
      'Calculus', 'Economics', 'Psychology', 'Sociology', 'Philosophy',
      'Drama', 'Theater', 'Dance', 'Computer Science', 'Languages',
      'Statistics', 'Astronomy', 'Robotics', 'Journalism', 'Civics', 'Health',
      'Environmental Science', 'Creative Writing', 'Public Speaking', 'Photography', 'Accounting', 'Woodshop'
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
      'Captain Marvel', 'Star-Lord', 'Gamora', 'Rocket', 'Groot',
      'Ms. Marvel', 'Blue Beetle', 'Static', 'Beast Boy', 'Starfire', 'Raven',
      'She-Hulk', 'Moon Knight', 'Shang-Chi', 'The Tick', 'Invincible', 'Hellboy'
    ]
  },
  Body: {
    emoji: '🫀',
    words: [
      'Head', 'Brain', 'Eyes', 'Ears', 'Nose', 'Mouth', 'Teeth',
      'Tongue', 'Neck', 'Shoulders', 'Arms', 'Elbows', 'Wrists',
      'Hands', 'Fingers', 'Chest', 'Heart', 'Lungs', 'Stomach',
      'Back', 'Spine', 'Hips', 'Legs', 'Knees', 'Ankles', 'Feet',
      'Toes', 'Skin', 'Hair', 'Nails', 'Blood', 'Bones', 'Muscles',
      'Eyebrows', 'Eyelashes', 'Lips', 'Cheeks', 'Chin', 'Philtrum',
      'Uvula', 'Retina', 'Eardrum', 'Tendons', 'Ligaments', 'Cartilage'
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
      'Woodworking', 'Pottery', 'Origami', 'Puzzles', 'Board Games',
      'Calligraphy', 'Candle Making', 'Rock Tumbling', 'Geocaching', 'Model Building', 'Stargazing',
      'Scrapbooking', 'Soap Making', 'Flower Arranging', 'Letterboxing', 'Thrifting', 'Magic Tricks'
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
      'Portal', 'Half-Life', 'Bioshock', 'Mass Effect', 'Dragon Age', 'Skyrim',
      'Hades', 'Hollow Knight', 'Celeste', 'Cuphead', 'Among Us', 'It Takes Two',
      'Untitled Goose Game', 'Disco Elysium', 'Subnautica', 'Slime Rancher', 'Outer Wilds', 'Beat Saber'
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
      'Neon Genesis Evangelion', 'Steins;Gate', 'Your Name', 'Weathering With You', 'Princess Mononoke', 'Spirited Away',
      'Frieren', 'Delicious in Dungeon', 'The Apothecary Diaries', 'Vinland Saga', 'Promised Neverland', 'Blue Lock',
      'Trigun', 'Akira', 'Ghost in the Shell', 'Monster', 'Samurai Pizza Cats', 'Bocchi the Rock!'
    ]
  },
  Nature: {
    emoji: '🏔️',
    words: [
      'Mountain', 'River', 'Lake', 'Ocean', 'Beach', 'Forest',
      'Desert', 'Jungle', 'Waterfall', 'Cave', 'Valley', 'Hill',
      'Volcano', 'Island', 'Cliff', 'Canyon', 'Meadow', 'Field',
      'Pond', 'Stream', 'Glacier', 'Iceberg', 'Reef', 'Swamp',
      'Tree', 'Flower', 'Grass', 'Rock', 'Stone', 'Sand', 'Soil',
      'Sand Dune', 'Geyser', 'Hot Spring', 'Fjord', 'Mangrove', 'Bog',
      'Estuary', 'Delta', 'Tide Pool', 'Redwood Grove', 'Salt Flat', 'Lagoon'
    ]
  },

  'Board Games': {
    emoji: '🎲',
    words: [
      'Chess', 'Checkers', 'Monopoly', 'Scrabble', 'Clue', 'Risk',
      'Catan', 'Ticket to Ride', 'Battleship', 'Connect Four', 'Sorry!', 'Guess Who?',
      'Twister', 'Mouse Trap', 'Operation', 'Pictionary', 'Jenga', 'Backgammon'
    ]
  },

  'School Supplies': {
    emoji: '✏️',
    words: [
      'Pencil', 'Eraser', 'Ruler', 'Highlighter', 'Stapler', 'Glue Stick',
      'Scissors', 'Notebook', 'Binder', 'Index Cards', 'Calculator', 'Compass',
      'Protractor', 'Crayons', 'Markers', 'Pencil Sharpener', 'Graph Paper', 'Backpack'
    ]
  },

  'Kitchen Tools': {
    emoji: '🍳',
    words: [
      'Whisk', 'Spatula', 'Rolling Pin', 'Colander', 'Measuring Cup', 'Can Opener',
      'Peeler', 'Cheese Grater', 'Tongs', 'Ladle', 'Cutting Board', 'Mixing Bowl',
      'Frying Pan', 'Blender', 'Toaster', 'Oven Mitt', 'Pizza Cutter', 'Ice Cream Scoop'
    ]
  },

  'Amusement Parks': {
    emoji: '🎡',
    words: [
      'Roller Coaster', 'Ferris Wheel', 'Carousel', 'Bumper Cars', 'Log Flume', 'Drop Tower',
      'Haunted House', 'Funhouse Mirror', 'Ring Toss', 'Prize Booth', 'Cotton Candy', 'Funnel Cake',
      'Water Slide', 'Wave Pool', 'Lazy River', 'Photo Booth', 'Ticket Booth', 'Fast Pass'
    ]
  },

  'Camping Gear': {
    emoji: '🏕️',
    words: [
      'Tent', 'Sleeping Bag', 'Lantern', 'Headlamp', 'Cooler', 'Camp Stove',
      'Camp Chair', 'Hammock', 'Tarp', 'First Aid Kit', 'Water Bottle', 'Bug Spray',
      'Binoculars', 'Trail Map', 'Hiking Boots', 'Rain Jacket', 'Tent Stakes', 'Sleeping Pad'
    ]
  }
}

export class ImposterGame extends BaseGame {
  constructor(room, broadcastCallback = null) {
    super(room, broadcastCallback)
    this.gameType = 'imposter'
    this.usedWords = new Set()
    this.lastWord = null
    this.roundNumber = 0
  }

  initializeGame(selectedCategory = null) {
    const allowed = Object.hasOwn(GAME_DATA, selectedCategory) ? [selectedCategory] : Object.keys(GAME_DATA)
    const unused = word => !this.usedWords.has(word.toLowerCase())
    const available = allowed.filter(category => GAME_DATA[category].words.some(unused))
    const category = this.getRandomElement(available.length ? available : allowed)
    const words = GAME_DATA[category].words
    const choices = words.filter(available.length ? unused : word => word !== this.lastWord)
    const secretWord = this.getRandomElement(choices.length ? choices : words)
    const playerIds = [...this.room.players.keys()]
    const { imposterCount = 1, wordHints = false } = this.room.gameState
    const count = Math.min(imposterCount, playerIds.length - 1)

    if (!available.length) {
      allowed.forEach(key => GAME_DATA[key].words.forEach(word => this.usedWords.delete(word.toLowerCase())))
    }
    this.usedWords.add(secretWord.toLowerCase())
    this.lastWord = secretWord

    this.room.gameState = {
      secretWord,
      category,
      imposters: this.shuffleArray(playerIds).slice(0, count),
      votes: {},
      chatMessages: [],
      turnOrder: [],
      selectedCategory,
      imposterCount: count,
      wordHints,
      roundNumber: ++this.roundNumber,
    }

    console.log(`Imposter game initialized in room ${this.room.code} with category: ${category}`)
    return true
  }

  getPlayerGameState(playerId) {
    const isImposter = this.room.gameState.imposters.includes(playerId)
    return {
      isImposter,
      roundNumber: this.room.gameState.roundNumber,
      secretWord: isImposter ? null : this.room.gameState.secretWord,
      wordHint: isImposter && this.room.gameState.wordHints
        ? getWordHint(this.room.gameState.secretWord)
        : undefined
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
    const isClueRound = this.room.gamePhase === 'clues'
    if (!isClueRound && this.room.gamePhase !== 'discussion') {
      return { success: false, error: 'Chat is only available during discussion phase' }
    }

    // Check if it's the player's turn
    if (isClueRound && this.getCurrentCluePlayer() !== playerId) {
      return { success: false, error: 'It is not your turn to chat' }
    }

    // Validate message (single word, no empty messages)
    const trimmedMessage = typeof messageText === 'string' ? messageText.trim() : ''
    if (!trimmedMessage) {
      return { success: false, error: 'Message cannot be empty' }
    }

    // Check if it's a single word (no spaces)
    if (trimmedMessage.length > (isClueRound ? 50 : 300)) {
      return { success: false, error: 'Message is too long' }
    }
    if (isClueRound && /\s/.test(trimmedMessage)) {
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
      case 'clues':
        return { canAdvance: this.room.gamePhase === 'roleReveal' }
      case 'discussion':
        return {
          canAdvance: this.room.gamePhase === 'clues' && !this.getCurrentCluePlayer(),
          error: 'Wait for everyone to give a clue.'
        }
      case 'voting':
        return { canAdvance: this.room.gamePhase === 'discussion' }
      case 'results':
        if (this.room.gamePhase !== 'voting') return { canAdvance: false }
        if ([...this.room.players.values()].some(player => player.isConnected !== false &&
          !this.room.gameState.votes[player.id])) {
          return { canAdvance: false, error: 'Wait for everyone to vote.' }
        }
        return { canAdvance: true }
      default:
        return { canAdvance: false }
    }
  }

  getCurrentCluePlayer() {
    if (this.room.gamePhase !== 'clues') return null
    const { turnOrder, chatMessages } = this.room.gameState
    return turnOrder.find(id => {
      const player = this.room.players.get(id)
      return player && player.isConnected !== false && !chatMessages.some(clue => clue.playerId === id)
    }) ?? null
  }

  onPhaseAdvanced(newPhase) {
    if (newPhase === 'clues') {
      const players = [...this.room.players.values()].filter(player => player.isConnected !== false)
      this.room.gameState.turnOrder = this.shuffleArray(players.map(player => player.id))
    }
  }

  onPlayerReconnected(oldId, newId) {
    const state = this.room.gameState
    if (!state.turnOrder) return
    const replaceId = id => id === oldId ? newId : id
    state.imposters = state.imposters.map(replaceId)
    state.turnOrder = state.turnOrder.map(replaceId)
    state.chatMessages.forEach(message => { message.playerId = replaceId(message.playerId) })
    state.votes = Object.fromEntries(Object.entries(state.votes).map(([from, to]) => [replaceId(from), replaceId(to)]))
  }

  resetGame() {
    this.room.gameState = {}
  }

  getAvailableCategories() {
    return Object.keys(GAME_DATA).map(name => ({
      name,
      emoji: GAME_DATA[name].emoji,
      wordCount: GAME_DATA[name].words.length
    }))
  }
}
