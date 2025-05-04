import { db } from "@db";
import * as schema from "@shared/schema";
import { eq } from 'drizzle-orm';

async function seedAvengersMovies() {
  console.log("Starting Avengers movies seed process...");

  try {
    // Add Avengers movies to content table
    const avengersMovies = [
      {
        title: "The Avengers",
        description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
        type: "Movie",
        genres: ["Action", "Adventure", "Superhero"],
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        videoUrl: "https://example.com/videos/avengers.mp4",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8",
        releaseYear: 2012,
        duration: 143,
        contentRating: 8.0,
        addedDate: new Date(),
        isFeatured: true,
        points: 50,
        hasChallenge: true,
        hasQuiz: true
      },
      {
        title: "Avengers: Age of Ultron",
        description: "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
        type: "Movie",
        genres: ["Action", "Adventure", "Superhero"],
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_.jpg",
        videoUrl: "https://example.com/videos/age-of-ultron.mp4",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=tmeOjFno6Do",
        releaseYear: 2015,
        duration: 141,
        contentRating: 7.3,
        addedDate: new Date(),
        isFeatured: false,
        points: 50,
        hasChallenge: false,
        hasQuiz: true
      },
      {
        title: "Avengers: Infinity War",
        description: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
        type: "Movie",
        genres: ["Action", "Adventure", "Superhero"],
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg",
        videoUrl: "https://example.com/videos/infinity-war.mp4",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
        releaseYear: 2018,
        duration: 149,
        contentRating: 8.4,
        addedDate: new Date(),
        isFeatured: true,
        points: 75,
        hasChallenge: true,
        hasQuiz: true
      },
      {
        title: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        type: "Movie",
        genres: ["Action", "Adventure", "Superhero"],
        thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        videoUrl: "https://example.com/videos/endgame.mp4",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
        releaseYear: 2019,
        duration: 181,
        contentRating: 8.4,
        addedDate: new Date(),
        isFeatured: true,
        points: 100,
        hasChallenge: true,
        hasQuiz: true
      }
    ];

    // Insert the Avengers movies
    for (const movie of avengersMovies) {
      // Check if movie already exists
      const existingMovie = await db.select()
        .from(schema.content)
        .where(eq(schema.content.title, movie.title))
        .limit(1);

      if (existingMovie.length === 0) {
        await db.insert(schema.content).values(movie);
      }
    }
    console.log(`Inserted ${avengersMovies.length} Avengers movies`);

    // Add Avengers challenge
    const avengersChallenge = {
      title: "Avengers Marathon",
      description: "Watch all 4 Avengers movies to earn exclusive rewards and badges!",
      imageUrl: "https://cdn.marvel.com/content/1x/avengersendgame_lob_crd_05.jpg",
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      requirementType: "Count",
      requirementValue: 4,
      requirementGenre: "Superhero",
      pointReward: 500,
      difficulty: "Medium",
      isRecurring: false
    };

    // Check if challenge already exists
    const existingChallenge = await db.select()
      .from(schema.challenges)
      .where(eq(schema.challenges.title, avengersChallenge.title))
      .limit(1);

    if (existingChallenge.length === 0) {
      await db.insert(schema.challenges).values(avengersChallenge);
      console.log("Inserted Avengers Marathon challenge");
    }

    // Add Avengers badge
    const avengersBadge = {
      name: "Avengers Assembled",
      description: "Completed the Avengers Marathon Challenge",
      imageUrl: "https://cdn.marvel.com/content/1x/avengersendgame_lob_log_02.png",
      category: "Movies",
      tier: "Gold",
      requirementType: "Challenge",
      requirementValue: 1,
      requirementGenre: "Superhero",
      pointValue: 200,
      rarity: "Rare"
    };

    // Check if badge already exists
    const existingBadge = await db.select()
      .from(schema.badges)
      .where(eq(schema.badges.name, avengersBadge.name))
      .limit(1);

    if (existingBadge.length === 0) {
      await db.insert(schema.badges).values([avengersBadge]);
      console.log("Inserted Avengers Assembled badge");
    }

    console.log("Avengers seed completed successfully!");
  } catch (error) {
    console.error("Error seeding Avengers content:", error);
  }
}

seedAvengersMovies()
  .then(() => {
    console.log("Seed process completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed process failed:", err);
    process.exit(1);
  });