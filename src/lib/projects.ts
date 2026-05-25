export type Project = {
  title: string;
  description: string;
  details?: string;
  url: string;
  thumbnail: string;
  tag: string;
  seizureWarning?: boolean;
};

export const tagColors: Record<string, string> = {
  Game: 'rgb(38, 95, 52)',
  Art:  'rgb(158, 88, 12)',
  Math: 'rgb(22, 78, 155)'
};

export const projects: Project[] = [
  {
    title: "Quick Sets",
    description: "A web implementation of the game SET",
    url: "https://ariymarkowitz.github.io/quick-sets/",
    thumbnail: "/thumbnails/quicksets.png",
    tag: "Game"
  },
  {
    title: "Apeirogon",
    description: "Mathematical art",
    url: "/images/apeirogon.jpg",
    thumbnail: "/thumbnails/apeirogon.png",
    tag: "Art"
  },
  {
    title: "Ripple",
    description: "Abstract interactive art",
    url: "https://ariymarkowitz.github.io/art/ripple/",
    thumbnail: "/thumbnails/ripple.png",
    tag: "Art",
    seizureWarning: true
  },
  {
    title: "Voidpool",
    description: "Enter the void",
    url: "https://ariymarkowitz.github.io/art/voidpool/",
    thumbnail: "/thumbnails/voidpool.png",
    tag: "Art",
    seizureWarning: true
  },
  {
    title: "Hyperbolic space visualiser",
    description: "Visualisation of isometry groups of hyperbolic space",
    url: "https://ariymarkowitz.github.io/H3-Visualiser/",
    thumbnail: "/thumbnails/h3.png",
    tag: "Maths"
  },
  {
    title: "Bruhat-Tits tree visualiser",
    description: "Visualisation of isometry groups of Bruhat-Tits trees",
    url: "https://ariymarkowitz.github.io/Bruhat-Tits-Tree-Visualiser/",
    thumbnail: "/thumbnails/btt.png",
    tag: "Maths"
  }
];
