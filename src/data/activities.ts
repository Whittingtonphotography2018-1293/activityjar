export type AgeGroup = '2-4' | '5-7' | '8-10' | '11-13';
export type Location = 'indoor' | 'outdoor' | 'kitchen' | 'travel';
export type Duration = '5min' | '15min' | '30min';
export type Materials = 'none' | 'household' | 'craft';

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  locations: Location[];
  duration: Duration;
  materials: Materials;
  emoji: string;
}

export const activities: Activity[] = [
  // Indoor activities
  {
    id: '1',
    title: 'Blanket Fort Adventure',
    description: 'Build an epic blanket fort and see if you can fit your entire family inside! Bring flashlights and books for extra fun.',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '30min',
    materials: 'household',
    emoji: '🏕️',
  },
  {
    id: '2',
    title: 'Sock Puppet Show',
    description: 'Turn old socks into silly puppets! Use markers, buttons, or yarn for faces, then put on a show for the family.',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '30min',
    materials: 'craft',
    emoji: '🧦',
  },
  {
    id: '3',
    title: 'Indoor Treasure Hunt',
    description: 'Hide a small toy or treat somewhere in the house. Give clues like "It\'s near something cold" or "Look where we eat!"',
    ageGroups: ['2-4', '5-7'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'none',
    emoji: '🗺️',
  },
  {
    id: '4',
    title: 'Dance Party Freeze',
    description: 'Put on your favorite music and dance! When the music stops, everyone has to freeze like a statue. Last one moving is out!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'none',
    emoji: '💃',
  },
  {
    id: '5',
    title: 'Paper Airplane Championship',
    description: 'Fold different paper airplane designs and have a flying contest! See whose plane goes the farthest or does the coolest tricks.',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'household',
    emoji: '✈️',
  },
  {
    id: '6',
    title: 'Chore Race Challenge',
    description: 'Who can pick up the most toys in 2 minutes? Set a timer and race to clean up — winner picks the next activity!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '5min',
    materials: 'none',
    emoji: '🏆',
  },
  
  // Outdoor activities
  {
    id: '7',
    title: 'Nature Shape Hunt',
    description: 'Find 5 things in nature that are shaped like circles, 3 like triangles, and 2 like squares. Take photos of your discoveries!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['outdoor'],
    duration: '15min',
    materials: 'none',
    emoji: '🔍',
  },
  {
    id: '8',
    title: 'Bubble Olympics',
    description: 'Have a bubble-blowing competition! Who can blow the biggest bubble? The most bubbles at once? Catch bubbles without popping them!',
    ageGroups: ['2-4', '5-7'],
    locations: ['outdoor'],
    duration: '15min',
    materials: 'household',
    emoji: '🫧',
  },
  {
    id: '9',
    title: 'Cloud Story Time',
    description: 'Lie on a blanket and watch the clouds. What shapes do you see? Make up a story about the cloud characters you spot!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['outdoor'],
    duration: '15min',
    materials: 'none',
    emoji: '☁️',
  },
  {
    id: '10',
    title: 'Bug Safari',
    description: 'Go on a bug hunt! How many different insects can you find? Draw pictures of the bugs you discover in a nature journal.',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['outdoor'],
    duration: '30min',
    materials: 'household',
    emoji: '🐛',
  },
  {
    id: '11',
    title: 'Shadow Tag',
    description: 'Play tag but you have to step on someone\'s shadow to catch them! Works best in the morning or late afternoon.',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['outdoor'],
    duration: '15min',
    materials: 'none',
    emoji: '👥',
  },
  
  // Kitchen activities
  {
    id: '12',
    title: 'Funny Face Pancakes',
    description: 'Bake funny face pancakes! Use pancake batter to draw shapes, then decorate with fruit, whipped cream, and chocolate chips.',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['kitchen'],
    duration: '30min',
    materials: 'household',
    emoji: '🥞',
  },
  {
    id: '13',
    title: 'Rainbow Fruit Art',
    description: 'Arrange fruit slices to make a colorful picture or rainbow on a plate. Then eat your masterpiece!',
    ageGroups: ['2-4', '5-7'],
    locations: ['kitchen'],
    duration: '15min',
    materials: 'household',
    emoji: '🌈',
  },
  {
    id: '14',
    title: 'Cookie Decorating',
    description: 'Decorate plain cookies or graham crackers with frosting and sprinkles. Make silly faces or holiday designs!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['kitchen'],
    duration: '15min',
    materials: 'household',
    emoji: '🍪',
  },
  {
    id: '15',
    title: 'Smoothie Scientists',
    description: 'Invent your own smoothie recipe! Pick fruits, add yogurt, and blend. Give your creation a silly name!',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['kitchen'],
    duration: '15min',
    materials: 'household',
    emoji: '🧪',
  },
  {
    id: '16',
    title: 'Playdough Kitchen',
    description: 'Make homemade playdough with flour, salt, and water. Add food coloring and let imaginations run wild!',
    ageGroups: ['2-4', '5-7'],
    locations: ['kitchen'],
    duration: '30min',
    materials: 'household',
    emoji: '🎨',
  },
  
  // Travel activities
  {
    id: '17',
    title: 'License Plate Bingo',
    description: 'Look for license plates from different states or with specific letters. First one to find 5 wins!',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['travel'],
    duration: '30min',
    materials: 'none',
    emoji: '🚗',
  },
  {
    id: '18',
    title: 'Story Chain',
    description: 'One person starts a story with one sentence. Each person adds another sentence. See how silly it gets!',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['travel'],
    duration: '15min',
    materials: 'none',
    emoji: '📖',
  },
  {
    id: '19',
    title: 'I Spy Colors',
    description: 'Take turns saying "I spy something..." and name a color. Others guess what you see out the window!',
    ageGroups: ['2-4', '5-7'],
    locations: ['travel'],
    duration: '15min',
    materials: 'none',
    emoji: '👀',
  },
  {
    id: '20',
    title: 'Animal Alphabet',
    description: 'Take turns naming animals for each letter of the alphabet. A is for Alligator, B is for Bear... can you get to Z?',
    ageGroups: ['5-7', '8-10'],
    locations: ['travel'],
    duration: '15min',
    materials: 'none',
    emoji: '🦒',
  },
  {
    id: '21',
    title: 'Would You Rather',
    description: 'Take turns asking "Would you rather..." questions. Would you rather fly or be invisible? Have a pet dragon or a pet unicorn?',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['travel'],
    duration: '15min',
    materials: 'none',
    emoji: '🤔',
  },
  {
    id: '22',
    title: 'Color Counting',
    description: 'Pick a color and count how many things of that color you see in 2 minutes. Red cars? Blue signs? Green trees?',
    ageGroups: ['2-4', '5-7'],
    locations: ['travel'],
    duration: '5min',
    materials: 'none',
    emoji: '🔢',
  },
  
  // More indoor activities
  {
    id: '23',
    title: 'Cardboard Box Castle',
    description: 'Turn a big cardboard box into a castle, spaceship, or race car! Cut windows and doors, then decorate it.',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '30min',
    materials: 'household',
    emoji: '📦',
  },
  {
    id: '24',
    title: 'Balloon Keep-Up',
    description: 'Blow up a balloon and try to keep it from touching the ground! How many times can you tap it up? Try using only your head!',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '5min',
    materials: 'household',
    emoji: '🎈',
  },
  {
    id: '25',
    title: 'Floor is Lava',
    description: 'The floor is lava! Use pillows, cushions, and blankets as safe islands. Get from the couch to the kitchen without touching the floor!',
    ageGroups: ['5-7', '8-10'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'household',
    emoji: '🌋',
  },
  {
    id: '26',
    title: 'Simon Says Champion',
    description: 'Play Simon Says! "Simon says touch your nose." "Simon says hop on one foot." Trick them to move without saying "Simon says!"',
    ageGroups: ['2-4', '5-7'],
    locations: ['indoor'],
    duration: '5min',
    materials: 'none',
    emoji: '🎭',
  },
  {
    id: '27',
    title: 'Indoor Bowling',
    description: 'Set up empty plastic bottles as bowling pins. Roll a soft ball to knock them down! Keep score and crown a champion.',
    ageGroups: ['2-4', '5-7', '8-10'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'household',
    emoji: '🎳',
  },
  {
    id: '28',
    title: 'Mystery Drawing',
    description: 'Close your eyes and draw something! Then open your eyes and see what silly creation you made. Take turns guessing what it is!',
    ageGroups: ['5-7', '8-10', '11-13'],
    locations: ['indoor'],
    duration: '15min',
    materials: 'household',
    emoji: '✏️',
  },
];

export interface Filters {
  ageGroup: AgeGroup | null;
  location: Location | null;
  duration: Duration | null;
  materials: Materials | null;
}

export const filterActivities = (filters: Filters): Activity[] => {
  return activities.filter(activity => {
    if (filters.ageGroup && !activity.ageGroups.includes(filters.ageGroup)) {
      return false;
    }
    if (filters.location && !activity.locations.includes(filters.location)) {
      return false;
    }
    if (filters.duration && activity.duration !== filters.duration) {
      return false;
    }
    if (filters.materials && activity.materials !== filters.materials) {
      return false;
    }
    return true;
  });
};

export const getRandomActivity = (filters: Filters, excludeIds: string[] = []): Activity | null => {
  const filtered = filterActivities(filters).filter(a => !excludeIds.includes(a.id));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};
