// Broad clues that fit several possible answers in the same category.
const hintGroups = [
  ['Often seen in aquariums.', ['Octopus', 'Jellyfish', 'Seahorse', 'Stingray', 'Starfish']],
  ['Often active after dark.', ['Owl', 'Bat', 'Raccoon', 'Hedgehog', 'Skunk']],
  ['Often served as street food.', ['Tacos', 'Pretzel', 'Falafel', 'Empanada', 'Samosa', 'Corn Dog']],
  ['Often shared or sold by the slice.', ['Pizza', 'Cake', 'Lasagna', 'Brownie']],
  ['Could fit on a family movie night.', ['Shrek', 'Frozen', 'Moana', 'Tangled', 'Coco', 'Coraline']],
  ['The playing surface can be indoors.', ['Basketball', 'Volleyball', 'Badminton', 'Pickleball', 'Fencing']],
  ['Often played with a controller.', ['Mario Kart', 'Cuphead', 'Hades', 'Celeste', 'Rocket League']],
  ['People often call them when something needs fixing.', ['Mechanic', 'Plumber', 'Electrician', 'Locksmith']],
  ['Known for performing in front of an audience.', ['Taylor Swift', 'Beyoncé', 'Shakira', 'Bruno Mars', 'Adele']],
  ['Has a coastline on the Mediterranean.', ['Spain', 'France', 'Italy', 'Greece', 'Morocco', 'Egypt']],
  ['Has a famous waterfront.', ['Sydney', 'Vancouver', 'Hong Kong', 'Barcelona', 'Cape Town']],
  ['Often works alongside a team.', ['Cyborg', 'Hawkeye', 'Black Widow', 'Thor', 'Beast Boy']],
  ['You could find it in a mall.', ['Nike', 'Apple', 'Starbucks', 'Adidas', 'Vans']],
  ['Can be played by blowing into it.', ['Flute', 'Clarinet', 'Trumpet', 'Tuba', 'Recorder', 'Ocarina']],
  ['May be used to capture or play back media.', ['Camera', 'Webcam', 'Dashcam', 'Smartphone', 'Tablet']],
  ['Often worn when the weather turns cold.', ['Coat', 'Beanie', 'Scarf', 'Mittens', 'Jacket']],
  ['Often involves solving a problem step by step.', ['Math', 'Algebra', 'Geometry', 'Physics', 'Robotics']],
  ['Found somewhere on the head.', ['Eyes', 'Ears', 'Chin', 'Lips', 'Eyebrows', 'Eyelashes']],
  ['You could do it at a table.', ['Origami', 'Drawing', 'Knitting', 'Puzzles', 'Calligraphy']],
  ['Characters train or grow stronger.', ['Naruto', 'Dragon Ball', 'Demon Slayer', 'My Hero Academia']],
  ['Can be sent toward a tower.', ['Hog Rider', 'Giant', 'Battle Ram', 'Royal Giant', 'Ram Rider']],
  ['Often follows a group with an unusual workplace.', ['The Office', 'Abbott Elementary', 'The Bear', 'Severance']],
  ['Frequently used when describing plants.', ['Green', 'Mint', 'Olive', 'Sage', 'Lime']],
  ['Usually carries more than one passenger.', ['Bus', 'Train', 'Tram', 'Ferry', 'Subway']],
  ['You might use it while reading.', ['Armchair', 'Sofa', 'Recliner', 'Lamp', 'Bench']],
  ['Can make driving harder.', ['Foggy', 'Snowy', 'Hail', 'Sleet', 'Freezing Rain']],
  ['Water plays a part in forming it.', ['Canyon', 'Waterfall', 'Valley', 'Delta', 'Glacier']],
  ['Involves thinking ahead several turns.', ['Chess', 'Checkers', 'Risk', 'Catan', 'Backgammon']],
  ['Often kept in a pencil case.', ['Pencil', 'Eraser', 'Highlighter', 'Markers', 'Pencil Sharpener']],
  ['Often used while baking.', ['Whisk', 'Mixing Bowl', 'Measuring Cup', 'Rolling Pin', 'Oven Mitt']],
  ['You might hear people scream.', ['Roller Coaster', 'Drop Tower', 'Haunted House', 'Log Flume']],
  ['Comes in handy after sunset.', ['Lantern', 'Headlamp', 'Sleeping Bag', 'Tent', 'Sleeping Pad']],
]

const hints = new Map(hintGroups.flatMap(([hint, words]) => words.map(word => [word, hint])))

export function getWordHint(word) {
  return hints.get(word)
}
