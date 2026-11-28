// Broad clues that fit several possible answers in the same category.
const hintGroups = [
  ['Animals', 'Saltwater', ['Octopus', 'Jellyfish', 'Seahorse', 'Stingray', 'Starfish']],
  ['Animals', 'Nocturnal', ['Owl', 'Bat', 'Raccoon', 'Hedgehog', 'Skunk', 'Fox', 'Leopard', 'Jaguar']],
  ['Food', 'Street food', ['Tacos', 'Pretzel', 'Falafel', 'Empanada', 'Samosa', 'Corn Dog']],
  ['Food', 'Sold by the slice', ['Pizza', 'Cake', 'Lasagna', 'Cheesecake', 'Quiche']],
  ['Movies', 'Animated adventure', ['Shrek', 'Frozen', 'Moana', 'Tangled', 'Coco', 'Coraline']],
  ['Sports', 'Indoor court', ['Basketball', 'Volleyball', 'Badminton', 'Pickleball', 'Squash']],
  ['Video Games', 'Controller', ['Mario Kart', 'Cuphead', 'Hades', 'Celeste', 'Rocket League']],
  ['Professions', 'Repairs', ['Mechanic', 'Plumber', 'Electrician', 'Locksmith']],
  ['Celebrities', 'Pop vocals', ['Taylor Swift', 'Beyoncé', 'Shakira', 'Bruno Mars', 'Adele']],
  ['Countries', 'Mediterranean coast', ['Spain', 'France', 'Italy', 'Greece', 'Morocco', 'Egypt']],
  ['Cities', 'Waterfront', ['Sydney', 'Vancouver', 'Hong Kong', 'Barcelona', 'Cape Town']],
  ['Superheroes', 'Superhero team', ['Cyborg', 'Hawkeye', 'Black Widow', 'Thor', 'Beast Boy']],
  ['Brands', 'Shopping mall', ['Nike', 'Apple', 'Starbucks', 'Adidas', 'Vans']],
  ['Instruments', 'Breath and airflow', ['Flute', 'Clarinet', 'Trumpet', 'Tuba', 'Recorder', 'Ocarina']],
  ['Technology', 'Records video', ['Camera', 'Webcam', 'Dashcam', 'Smartphone', 'Tablet']],
  ['Clothing', 'Cold-weather layers', ['Coat', 'Beanie', 'Scarf', 'Mittens', 'Jacket']],
  ['School', 'Problem sets', ['Math', 'Algebra', 'Geometry', 'Physics', 'Robotics']],
  ['Body', 'Face', ['Eyes', 'Chin', 'Lips', 'Eyebrows', 'Eyelashes']],
  ['Hobbies', 'Indoor project', ['Origami', 'Drawing', 'Knitting', 'Puzzles', 'Calligraphy']],
  ['Anime', 'Training arc', ['Naruto', 'Dragon Ball', 'Demon Slayer', 'My Hero Academia']],
  ['Clash Royale', 'Tower push', ['Hog Rider', 'Giant', 'Battle Ram', 'Royal Giant', 'Ram Rider']],
  ['TV Shows', 'Workplace ensemble', ['The Office', 'Abbott Elementary', 'The Bear', 'Severance']],
  ['Colors', 'Leafy shade', ['Green', 'Mint', 'Olive', 'Sage', 'Lime']],
  ['Vehicles', 'Public transit', ['Bus', 'Train', 'Tram', 'Ferry', 'Subway']],
  ['Furniture', 'Reading nook', ['Armchair', 'Sofa', 'Recliner', 'Lamp', 'Bench']],
  ['Weather', 'Slippery roads', ['Foggy', 'Snowy', 'Hail', 'Sleet', 'Freezing Rain']],
  ['Nature', 'Shaped by water', ['Canyon', 'Waterfall', 'Valley', 'Delta', 'Glacier']],
  ['Board Games', 'Plan several moves ahead', ['Chess', 'Checkers', 'Risk', 'Catan', 'Backgammon']],
  ['School Supplies', 'Pencil case', ['Pencil', 'Eraser', 'Highlighter', 'Markers', 'Pencil Sharpener']],
  ['Kitchen Tools', 'Baking prep', ['Whisk', 'Mixing Bowl', 'Measuring Cup', 'Rolling Pin', 'Oven Mitt']],
  ['Amusement Parks', 'Screams', ['Roller Coaster', 'Drop Tower', 'Haunted House', 'Log Flume']],
  ['Camping Gear', 'After dark', ['Lantern', 'Headlamp', 'Sleeping Bag', 'Tent', 'Sleeping Pad']],
  ['Animals', 'Black-and-white markings', ['Zebra', 'Panda', 'Penguin', 'Orca', 'Skunk']],
  ['Animals', 'Freshwater', ['Otter', 'Beaver', 'Platypus', 'Frog', 'Alligator', 'Hippo']],
  ['Food', 'Sweet bakery case', ['Cookie', 'Brownie', 'Donut', 'Muffin', 'Cinnamon Roll']],
  ['Movies', 'A ticking clock', ['Inception', 'Die Hard', 'Jaws', 'Alien', 'Interstellar']],
  ['Sports', 'Snow and ice', ['Skiing', 'Snowboarding', 'Figure Skating', 'Curling', 'Bobsled', 'Luge']],
  ['Video Games', 'Farming and collecting', ['Stardew Valley', 'Animal Crossing', 'Minecraft', 'Terraria', 'Slime Rancher']],
  ['Professions', 'Emergency response', ['Firefighter', 'Paramedic', 'Police Officer', 'Nurse', 'Doctor']],
  ['Celebrities', 'On the big screen', ['Keanu Reeves', 'Pedro Pascal', 'Michelle Yeoh', 'Jack Black', 'Tom Cruise']],
  ['Countries', 'An island nation', ['Japan', 'Iceland', 'Cuba', 'Jamaica', 'New Zealand', 'Sri Lanka']],
  ['Cities', 'European capital', ['Paris', 'Berlin', 'Vienna', 'Prague', 'Athens', 'Lisbon']],
  ['Superheroes', 'Can fly', ['Superman', 'Wonder Woman', 'Captain Marvel', 'Starfire', 'Thor']],
  ['Brands', 'Fast-food counter', ['McDonald\'s', 'Burger King', 'KFC', 'Subway', 'Starbucks']],
  ['Instruments', 'Played by striking', ['Drums', 'Xylophone', 'Marimba', 'Timpani', 'Gong', 'Triangle']],
  ['Technology', 'Desktop workspace', ['Mouse', 'Keyboard', 'Monitor', 'Printer', 'Scanner', 'Trackpad']],
  ['Clothing', 'Formal occasion', ['Suit', 'Tie', 'Blazer', 'Tuxedo', 'Heels', 'Loafers']],
  ['School', 'Lab work', ['Science', 'Biology', 'Chemistry', 'Physics', 'Environmental Science']],
  ['Body', 'Bends during movement', ['Elbows', 'Wrists', 'Fingers', 'Knees', 'Ankles', 'Toes']],
  ['Body', 'Found in the torso', ['Heart', 'Lungs', 'Stomach', 'Spine', 'Skin', 'Chest', 'Liver', 'Pancreas', 'Ribs']],
  ['Hobbies', 'Outdoors and observing', ['Bird Watching', 'Stargazing', 'Photography', 'Hiking', 'Geocaching']],
  ['Anime', 'Supernatural battles', ['Bleach', 'Jujutsu Kaisen', 'Blue Exorcist', 'Yu Yu Hakusho', 'Black Clover']],
  ['Clash Royale', 'Defensive building', ['Cannon', 'Tesla', 'Inferno Tower']],
  ['TV Shows', 'Investigation and suspects', ['Sherlock', 'Mindhunter', 'True Detective', 'Only Murders in the Building', 'Fargo']],
  ['Colors', 'Warm sunset', ['Orange', 'Coral', 'Scarlet', 'Gold', 'Peach', 'Crimson']],
  ['Vehicles', 'Construction site', ['Bulldozer', 'Crane', 'Forklift', 'Dump Truck', 'Truck']],
  ['Furniture', 'Stores folded items', ['Dresser', 'Cabinet', 'Wardrobe', 'Drawer', 'Credenza']],
  ['Weather', 'Thunderstorm', ['Thunder', 'Lightning', 'Hail', 'Thundercloud', 'Flash Flood']],
  ['Nature', 'Coastal landscape', ['Beach', 'Reef', 'Tide Pool', 'Lagoon', 'Estuary', 'Cliff']],
  ['Board Games', 'Drawing or guessing', ['Pictionary', 'Clue', 'Guess Who?', 'Battleship']],
  ['School Supplies', 'Measures or draws angles', ['Ruler', 'Compass', 'Protractor', 'Graph Paper']],
  ['Kitchen Tools', 'Prepping vegetables', ['Peeler', 'Cutting Board', 'Colander', 'Grater', 'Cheese Grater']],
  ['Amusement Parks', 'Water ride', ['Log Flume', 'Water Slide', 'Wave Pool', 'Lazy River']],
  ['Camping Gear', 'Keeps you dry', ['Rain Jacket', 'Tent', 'Tarp', 'Hiking Boots']],
]

const hints = new Map()
for (const [category, hint, words] of hintGroups) {
  if (!hints.has(category)) hints.set(category, new Map())
  const categoryHints = hints.get(category)
  for (const word of words) {
    if (!categoryHints.has(word)) categoryHints.set(word, hint)
  }
}

function categoryHints(category) {
  const aliases = { VideoGames: 'Video Games', Animes: 'Anime' }
  return hints.get(aliases[category] ?? category.replaceAll('_', ' '))
}

export function getWordHint(category, word) {
  return categoryHints(category)?.get(word)
}

export function getHintedWords(category, words) {
  const lookup = categoryHints(category)
  return words.filter(word => lookup?.has(word))
}
