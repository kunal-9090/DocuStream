import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting seed process...");

    // Check if we already have data
    const existingContent = await db.select().from(schema.content).limit(1);
    
    if (existingContent.length > 0) {
      console.log("Database already has content data, skipping content seed");
    } else {
      console.log("Seeding content data...");
      
      // Content Seed Data
      const contentData = [
        {
          title: "Our Planet: Wonders of Life",
          description: "Explore the most extraordinary places and creatures on Earth in this groundbreaking series from the team behind Planet Earth.",
          shortDescription: "Explore Earth's most extraordinary creatures and places.",
          thumbnailUrl: "https://images.unsplash.com/photo-1551419762-4a3d998f6292?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1551419762-4a3d998f6292?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          duration: 45,
          type: "Documentary",
          releaseYear: 2023,
          genres: ["Nature", "Wildlife", "Educational"],
          director: "Alastair Fothergill",
          cast: ["David Attenborough"],
          ageRating: "TV-PG",
          contentRating: 4.9,
          language: "English",
          isFeatured: true,
          points: 50,
          hasChallenge: true,
          hasQuiz: true
        },
        {
          title: "Nature Unveiled",
          description: "An intimate look at the hidden wonders of our natural world, revealing secrets of ecosystems across the globe.",
          shortDescription: "Discover the hidden wonders of our natural world.",
          thumbnailUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: 55,
          type: "Documentary",
          releaseYear: 2022,
          genres: ["Nature", "Wildlife", "Science"],
          director: "Jennifer Wu",
          cast: ["Emma Thompson"],
          ageRating: "TV-G",
          contentRating: 4.7,
          language: "English",
          isFeatured: false,
          points: 10,
          hasChallenge: false,
          hasQuiz: false
        },
        {
          title: "Cosmic Journeys",
          description: "Venture beyond our planet to explore distant galaxies and understand the vastness of the universe.",
          shortDescription: "Explore the cosmos and distant galaxies.",
          thumbnailUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          duration: 60,
          type: "Documentary",
          releaseYear: 2022,
          genres: ["Space", "Science", "Educational"],
          director: "Robert Chen",
          cast: ["Neil deGrasse Tyson"],
          ageRating: "TV-G",
          contentRating: 4.8,
          language: "English",
          isFeatured: false,
          points: 15,
          hasChallenge: false,
          hasQuiz: true
        },
        {
          title: "Deep Blue: Ocean Frontiers",
          description: "Dive into the mysterious depths of our oceans and discover magnificent coral kingdoms and their inhabitants.",
          shortDescription: "Explore the mysterious depths of our oceans.",
          thumbnailUrl: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          duration: 50,
          type: "Documentary",
          releaseYear: 2021,
          genres: ["Ocean", "Wildlife", "Nature"],
          director: "James Cameron",
          cast: ["Sylvia Earle"],
          ageRating: "TV-G",
          contentRating: 4.9,
          language: "English",
          isFeatured: false,
          points: 20,
          hasChallenge: true,
          hasQuiz: false
        },
        {
          title: "Human Mind",
          description: "Explore the fascinating world of human psychology, consciousness, dreams, and the reality we perceive.",
          shortDescription: "Explore human psychology and consciousness.",
          thumbnailUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          duration: 65,
          type: "Documentary",
          releaseYear: 2020,
          genres: ["Psychology", "Science", "Educational"],
          director: "Maria Rodriguez",
          cast: ["Steven Pinker"],
          ageRating: "TV-PG",
          contentRating: 4.6,
          language: "English",
          isFeatured: false,
          points: 15,
          hasChallenge: false,
          hasQuiz: true
        },
        {
          title: "Wonders of the Deep",
          description: "Discover the incredible biodiversity of the ocean's deepest regions, from bioluminescent creatures to massive underwater ecosystems.",
          shortDescription: "Explore the mysterious deep ocean ecosystems.",
          thumbnailUrl: "https://images.unsplash.com/photo-1568438350562-2cae6d919a3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1568438350562-2cae6d919a3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          duration: 82,
          type: "Documentary",
          releaseYear: 2023,
          genres: ["Ocean", "Wildlife", "Science"],
          director: "Jacques Cousteau",
          cast: ["Sylvia Earle"],
          ageRating: "TV-G",
          contentRating: 4.8,
          language: "English",
          isFeatured: false,
          points: 30,
          hasChallenge: false,
          hasQuiz: false
        },
        {
          title: "Apex Predators",
          description: "An in-depth look at the world's most efficient hunters, from big cats to sharks and everything in between.",
          shortDescription: "Explore the world's most efficient predators.",
          thumbnailUrl: "https://images.unsplash.com/photo-1579033385971-a7bc8c5aad3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1579033385971-a7bc8c5aad3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          duration: 105,
          type: "Documentary",
          releaseYear: 2022,
          genres: ["Wildlife", "Nature", "Educational"],
          director: "Steve Irwin",
          cast: ["David Attenborough"],
          ageRating: "TV-PG",
          contentRating: 4.6,
          language: "English",
          isFeatured: false,
          points: 25,
          hasChallenge: true,
          hasQuiz: false
        },
        {
          title: "Universe Explained",
          description: "From the Big Bang to the future of our cosmos, this comprehensive documentary explores the greatest mysteries of our universe.",
          shortDescription: "Explore the greatest mysteries of our universe.",
          thumbnailUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          duration: 130,
          type: "Documentary",
          releaseYear: 2023,
          genres: ["Space", "Science", "Educational"],
          director: "Ann Druyan",
          cast: ["Neil deGrasse Tyson"],
          ageRating: "TV-G",
          contentRating: 4.9,
          language: "English",
          isFeatured: false,
          points: 35,
          hasChallenge: false,
          hasQuiz: true
        },
        {
          title: "Human Evolution",
          description: "Trace the remarkable journey of human development from early hominids to modern society and technological advancement.",
          shortDescription: "Trace the remarkable journey of human evolution.",
          thumbnailUrl: "https://images.unsplash.com/photo-1597671440656-8f16cc4dc8d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1597671440656-8f16cc4dc8d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          duration: 115,
          type: "Documentary",
          releaseYear: 2021,
          genres: ["History", "Science", "Evolution"],
          director: "Richard Dawkins",
          cast: ["Jane Goodall"],
          ageRating: "TV-PG",
          contentRating: 4.5,
          language: "English",
          isFeatured: false,
          points: 20,
          hasChallenge: false,
          hasQuiz: true
        },
        {
          title: "Wilderness Survival",
          description: "Learn essential skills and strategies for surviving in the world's most extreme environments, from deserts to arctic tundra.",
          shortDescription: "Learn survival skills for extreme environments.",
          thumbnailUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          duration: 98,
          type: "Documentary",
          releaseYear: 2023,
          genres: ["Adventure", "Educational", "Nature"],
          director: "Bear Grylls",
          cast: ["Les Stroud"],
          ageRating: "TV-14",
          contentRating: 4.7,
          language: "English",
          isFeatured: false,
          points: 25,
          hasChallenge: true,
          hasQuiz: false
        }
      ];

      // Insert content data
      await db.insert(schema.content).values(contentData);
      console.log(`Inserted ${contentData.length} content items`);

      // Series Seed Data
      const seriesData = [
        {
          title: "Planet Explorers",
          description: "Join a team of scientists as they explore the most remote and fascinating ecosystems on our planet.",
          thumbnailUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          seasons: 3,
          totalEpisodes: 18,
          releaseYearStart: 2020,
          releaseYearEnd: 2023,
          genres: ["Nature", "Wildlife", "Adventure"],
          creator: "National Geographic",
          ageRating: "TV-G",
          language: "English",
          isFeatured: true
        },
        {
          title: "Mind Matters",
          description: "Delve into the complex workings of the human brain, exploring topics like memory, emotion, and consciousness.",
          thumbnailUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          seasons: 2,
          totalEpisodes: 16,
          releaseYearStart: 2021,
          releaseYearEnd: 2022,
          genres: ["Psychology", "Science", "Educational"],
          creator: "PBS",
          ageRating: "TV-PG",
          language: "English",
          isFeatured: false
        },
        {
          title: "Cosmic Wonders",
          description: "A visual journey through the cosmos, featuring the latest scientific discoveries about our universe.",
          thumbnailUrl: "https://images.unsplash.com/photo-1501471984908-815b996dc0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1501471984908-815b996dc0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          seasons: 1,
          totalEpisodes: 8,
          releaseYearStart: 2023,
          genres: ["Space", "Science", "Educational"],
          creator: "NASA",
          ageRating: "TV-G",
          language: "English",
          isFeatured: false
        },
        {
          title: "Tech Revolution",
          description: "Explore the cutting-edge technologies shaping our future, from AI to quantum computing and beyond.",
          thumbnailUrl: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          bannerImageUrl: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
          seasons: 3,
          totalEpisodes: 24,
          releaseYearStart: 2020,
          releaseYearEnd: 2022,
          genres: ["Technology", "Science", "Innovation"],
          creator: "WIRED",
          ageRating: "TV-G",
          language: "English",
          isFeatured: false
        }
      ];

      // Insert series data
      await db.insert(schema.series).values(seriesData);
      console.log(`Inserted ${seriesData.length} series`);

      // Challenges Seed Data
      const challengesData = [
        {
          title: "Space Explorer",
          description: "Watch 3 documentaries about space exploration",
          imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          requirementType: "watch",
          requirementValue: 3,
          requirementGenre: "Space",
          pointReward: 150,
          difficulty: "Medium",
          isRecurring: false
        },
        {
          title: "Ocean Depths",
          description: "Watch the complete \"Deep Blue\" series",
          imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          requirementType: "watch",
          requirementValue: 6,
          requirementGenre: "Ocean",
          pointReward: 200,
          difficulty: "Hard",
          isRecurring: false
        },
        {
          title: "Knowledge Seeker",
          description: "Complete 3 documentary quizzes with 80% or better",
          imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          requirementType: "quiz",
          requirementValue: 3,
          pointReward: 100,
          difficulty: "Easy",
          isRecurring: true
        },
        {
          title: "Weekly Watcher",
          description: "Watch at least 5 documentaries in a week",
          imageUrl: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          requirementType: "watch",
          requirementValue: 5,
          pointReward: 50,
          difficulty: "Easy",
          isRecurring: true
        }
      ];

      // Insert challenges data
      await db.insert(schema.challenges).values(challengesData);
      console.log(`Inserted ${challengesData.length} challenges`);

      // Badges Seed Data
      const badgesData = [
        {
          name: "Nature Explorer",
          description: "Watch 5 nature documentaries",
          imageUrl: "mountain",
          category: "Watching",
          tier: "Bronze",
          requirementType: "genre",
          requirementValue: 5,
          requirementGenre: "Nature",
          pointValue: 50,
          rarity: "Common"
        },
        {
          name: "Binge Watcher",
          description: "Watch more than 10 hours of content",
          imageUrl: "clock",
          category: "Watching",
          tier: "Silver",
          requirementType: "time",
          requirementValue: 600, // minutes
          pointValue: 100,
          rarity: "Uncommon"
        },
        {
          name: "Space Pioneer",
          description: "Watch 3 space documentaries",
          imageUrl: "rocket",
          category: "Explorer",
          tier: "Gold",
          requirementType: "genre",
          requirementValue: 3,
          requirementGenre: "Space",
          pointValue: 150,
          rarity: "Rare"
        },
        {
          name: "History Buff",
          description: "Watch 5 history documentaries",
          imageUrl: "book",
          category: "Explorer",
          tier: "Bronze",
          requirementType: "genre",
          requirementValue: 5,
          requirementGenre: "History",
          pointValue: 50,
          rarity: "Common"
        },
        {
          name: "Ocean Master",
          description: "Watch 7 ocean documentaries",
          imageUrl: "anchor",
          category: "Explorer",
          tier: "Silver",
          requirementType: "genre",
          requirementValue: 7,
          requirementGenre: "Ocean",
          pointValue: 100,
          rarity: "Uncommon"
        },
        {
          name: "Quiz Master",
          description: "Complete 5 quizzes with 100% score",
          imageUrl: "award",
          category: "Knowledge",
          tier: "Platinum",
          requirementType: "quiz",
          requirementValue: 5,
          pointValue: 200,
          rarity: "Epic"
        }
      ];

      // Insert badges data
      await db.insert(schema.badges).values(badgesData);
      console.log(`Inserted ${badgesData.length} badges`);
    }

    // Check if we already have user data
    const existingUsers = await db.select().from(schema.users).limit(1);
    
    if (existingUsers.length > 0) {
      console.log("Database already has user data, skipping user seed");
    } else {
      console.log("No existing users found. You can register new users through the application.");
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
