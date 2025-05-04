import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedIndianPersonalities() {
  try {
    console.log("Starting Indian personalities seed process...");

    // Check if we already have Indian personality content
    const existingContent = await db.select().from(schema.content)
      .where(eq(schema.content.type, "Biography"))
      .limit(1);
    
    if (existingContent.length > 0) {
      console.log("Database already has Indian personality content, skipping seed");
      return;
    }

    // Indian Personalities Biographical Documentaries
    const biographicalContent = [
      {
        title: "Mahatma Gandhi: The Power of Truth",
        description: "An in-depth exploration of Mahatma Gandhi's life, philosophy of non-violence, and his profound impact on India's independence movement and global civil rights.",
        shortDescription: "The life and legacy of India's Father of the Nation.",
        thumbnailUrl: "https://images.unsplash.com/photo-1552084117-56a987666449?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bannerImageUrl: "https://images.unsplash.com/photo-1552084117-56a987666449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 120,
        type: "Biography",
        releaseYear: 2022,
        genres: ["Biography", "History", "Indian Personalities"],
        director: "Ravi Kumar",
        cast: ["Historical Footage", "Rajmohan Gandhi"],
        ageRating: "TV-PG",
        contentRating: 4.9,
        language: "English",
        isFeatured: true,
        points: 50,
        hasChallenge: true,
        hasQuiz: true
      },
      {
        title: "Dr. APJ Abdul Kalam: Missile Man of India",
        description: "The inspiring journey of Dr. A.P.J. Abdul Kalam from humble beginnings to becoming India's most beloved President and a pioneer in aerospace science and missile technology.",
        shortDescription: "The extraordinary life of India's People's President.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551018612-9715965c6742?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bannerImageUrl: "https://images.unsplash.com/photo-1551018612-9715965c6742?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: 95,
        type: "Biography",
        releaseYear: 2022,
        genres: ["Biography", "Science", "Indian Personalities"],
        director: "Anil Sharma",
        cast: ["Historical Footage", "Former Colleagues"],
        ageRating: "TV-G",
        contentRating: 4.8,
        language: "English",
        isFeatured: true,
        points: 45,
        hasChallenge: true,
        hasQuiz: true
      },
      {
        title: "Rabindranath Tagore: The Poet of Universality",
        description: "Discover the multifaceted genius of Rabindranath Tagore - Nobel laureate, poet, painter, philosopher, and the creator of India's national anthem.",
        shortDescription: "The life and works of India's literary genius.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bannerImageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: 105,
        type: "Biography",
        releaseYear: 2021,
        genres: ["Biography", "Arts", "Literature", "Indian Personalities"],
        director: "Amitava Roy",
        cast: ["Historical Footage", "Literary Scholars"],
        ageRating: "TV-G",
        contentRating: 4.7,
        language: "English",
        isFeatured: false,
        points: 40,
        hasChallenge: false,
        hasQuiz: true
      },
      {
        title: "Sardar Vallabhbhai Patel: The Iron Man",
        description: "The definitive account of Sardar Vallabhbhai Patel's crucial role in unifying India's princely states and establishing a unified, independent nation.",
        shortDescription: "The visionary who united India's 562 princely states.",
        thumbnailUrl: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bannerImageUrl: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        duration: 110,
        type: "Biography",
        releaseYear: 2022,
        genres: ["Biography", "History", "Politics", "Indian Personalities"],
        director: "Prakash Jha",
        cast: ["Historical Footage", "Historians"],
        ageRating: "TV-PG",
        contentRating: 4.8,
        language: "English",
        isFeatured: false,
        points: 35,
        hasChallenge: true,
        hasQuiz: false
      },
      {
        title: "Satyajit Ray: The Visionary Filmmaker",
        description: "A profound look at the life and artistic journey of Satyajit Ray, India's most celebrated filmmaker whose work transformed world cinema.",
        shortDescription: "The master filmmaker who brought Indian cinema to the world.",
        thumbnailUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bannerImageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        duration: 125,
        type: "Biography",
        releaseYear: 2023,
        genres: ["Biography", "Film", "Arts", "Indian Personalities"],
        director: "Shyam Benegal",
        cast: ["Film Critics", "Actors", "Family Members"],
        ageRating: "TV-G",
        contentRating: 4.9,
        language: "English",
        isFeatured: false,
        points: 45,
        hasChallenge: false,
        hasQuiz: true
      }
    ];

    // Podcast Series about renowned personalities
    const podcastSeries = {
      title: "Visionaries & Trailblazers",
      description: "An engaging podcast series featuring in-depth discussions about influential figures from India and around the world who have made significant contributions to science, arts, business, and social change.",
      thumbnailUrl: "https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bannerImageUrl: "https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      seasons: 2,
      totalEpisodes: 24,
      releaseYearStart: 2022,
      releaseYearEnd: 2023,
      genres: ["Podcast", "Biography", "Interview"],
      creator: "Shekhar Gupta",
      ageRating: "TV-G",
      language: "English",
      isFeatured: true
    };

    // Podcast episodes
    const podcastEpisodes = [
      {
        title: "Dr. Vikram Sarabhai: Father of Indian Space Program",
        description: "An exploration of Dr. Vikram Sarabhai's visionary leadership in establishing India's space program and his contributions to science education.",
        seasonNumber: 1,
        episodeNumber: 1,
        duration: 45,
        thumbnailUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        releaseDate: new Date("2022-01-15"),
        points: 15
      },
      {
        title: "Homi Bhabha: Architect of Nuclear India",
        description: "The life and scientific contributions of Homi Bhabha, the brilliant physicist who spearheaded India's nuclear program and founded multiple scientific institutions.",
        seasonNumber: 1,
        episodeNumber: 2,
        duration: 47,
        thumbnailUrl: "https://images.unsplash.com/photo-1576319155264-99536e0be1ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        releaseDate: new Date("2022-01-29"),
        points: 15
      },
      {
        title: "C.V. Raman: India's First Nobel Laureate in Science",
        description: "The groundbreaking work and scientific legacy of Sir C.V. Raman, whose discovery of the 'Raman Effect' revolutionized our understanding of light and earned him the Nobel Prize.",
        seasonNumber: 1,
        episodeNumber: 3,
        duration: 50,
        thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        releaseDate: new Date("2022-02-12"),
        points: 15
      },
      {
        title: "Mother Teresa: Saint of the Streets",
        description: "A deep dive into the life of Mother Teresa, her humanitarian work in Kolkata, and the global impact of her Missionaries of Charity.",
        seasonNumber: 1,
        episodeNumber: 4,
        duration: 55,
        thumbnailUrl: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        releaseDate: new Date("2022-02-26"),
        points: 15
      },
      {
        title: "J.R.D. Tata: The Visionary Industrialist",
        description: "The remarkable journey of J.R.D. Tata, who transformed Indian industry, pioneered civil aviation, and created a blueprint for ethical business leadership.",
        seasonNumber: 1,
        episodeNumber: 5,
        duration: 48,
        thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        releaseDate: new Date("2022-03-12"),
        points: 15
      },
      {
        title: "Ratan Tata: Legacy of Leadership",
        description: "A conversation about Ratan Tata's transformative leadership of the Tata Group, his philanthropic vision, and his impact on modern Indian industry.",
        seasonNumber: 2,
        episodeNumber: 1,
        duration: 52,
        thumbnailUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        releaseDate: new Date("2023-01-14"),
        points: 20
      }
    ];

    // Insert biographical content
    await db.insert(schema.content).values(biographicalContent);
    console.log(`Inserted ${biographicalContent.length} biographical documentaries about Indian personalities`);

    // Insert podcast series
    const [seriesInserted] = await db.insert(schema.series).values(podcastSeries).returning({ id: schema.series.id });
    console.log(`Inserted podcast series: ${podcastSeries.title}`);

    // Insert podcast episodes
    const episodesWithSeriesId = podcastEpisodes.map(episode => ({
      ...episode,
      seriesId: seriesInserted.id
    }));
    
    await db.insert(schema.episodes).values(episodesWithSeriesId);
    console.log(`Inserted ${podcastEpisodes.length} podcast episodes about renowned personalities`);

    // Create a new challenge for Indian personalities
    const indianPersonalitiesChallenge = {
      title: "Indian Icons Explorer",
      description: "Watch 3 documentaries about influential Indian personalities",
      imageUrl: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      requirementType: "watch",
      requirementValue: 3,
      requirementGenre: "Indian Personalities",
      pointReward: 100,
      difficulty: "Medium",
      isRecurring: false
    };

    await db.insert(schema.challenges).values(indianPersonalitiesChallenge);
    console.log("Inserted new challenge: Indian Icons Explorer");

    // Create a new badge for Indian history enthusiasts
    const indianHistoryBadge = {
      name: "Indian History Enthusiast",
      description: "Awarded for watching 5 documentaries about Indian personalities and history",
      imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Knowledge",
      tier: "Gold",
      requirementType: "watch_genre",
      requirementValue: 5,
      requirementGenre: "Indian Personalities",
      pointValue: 50,
      rarity: "Rare"
    };

    await db.insert(schema.badges).values(indianHistoryBadge);
    console.log("Inserted new badge: Indian History Enthusiast");

    console.log("Indian personalities seed completed successfully!");
  } catch (error) {
    console.error("Error seeding Indian personalities data:", error);
    throw error;
  }
}

// Run the seed function
seedIndianPersonalities()
  .then(() => {
    console.log("Seed process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  });