import fs from 'fs';
import path from 'path';

// Load credentials from environment
const DUPR_EMAIL = process.env.DUPR_EMAIL;
const DUPR_PASSWORD = process.env.DUPR_PASSWORD;
const DUPR_ID = process.env.DUPR_ID || 'DUPR-893-XKL'; // Custom DUPR ID

// Path to data file
const DATA_FILE_PATH = path.resolve('src/data/dupr.json');

async function updateDUPRStats() {
  console.log("Starting DUPR Stats update process...");

  // Validate environment variables
  if (!DUPR_EMAIL || !DUPR_PASSWORD) {
    console.warn("WARNING: DUPR_EMAIL and/or DUPR_PASSWORD environment variables are not set.");
    console.warn("Skipping API fetch. Local fallback data in 'src/data/dupr.json' will remain unchanged.");
    return;
  }

  try {
    // 1. Authenticate with DUPR Private API
    console.log("Authenticating with DUPR Private API...");
    const loginResponse = await fetch("https://api.dupr.gg/auth/v1.0/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: DUPR_EMAIL,
        password: DUPR_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Authentication failed with status: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.accessToken;
    
    if (!accessToken) {
      throw new Error("No accessToken returned in login response.");
    }
    console.log("Authentication successful! Token acquired.");

    // 2. Fetch Player Profiles & Stats
    // Querying the private API endpoint (based on Swagger/private API docs)
    console.log(`Fetching DUPR stats for player ID: ${DUPR_ID}...`);
    const playerResponse = await fetch(`https://api.dupr.gg/player/v1.0/${DUPR_ID}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      }
    });

    if (!playerResponse.ok) {
      throw new Error(`Failed to fetch player profile. Status: ${playerResponse.status}`);
    }
    
    const playerData = await playerResponse.json();
    console.log("Player profile data retrieved successfully.");

    // 3. Fetch Match History
    console.log("Fetching player match history...");
    const matchesResponse = await fetch(`https://api.dupr.gg/player/match/v1.0/history?duprId=${DUPR_ID}&limit=10`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      }
    });

    let matchesData = [];
    if (matchesResponse.ok) {
      const matchResult = await matchesResponse.json();
      matchesData = matchResult.matches || [];
      console.log(`Retrieved ${matchesData.length} recent match records.`);
    } else {
      console.warn(`WARNING: Failed to fetch match history (Status: ${matchesResponse.status}). Using fallback/empty matches.`);
    }

    // 4. Read Existing File for Mock Fallbacks
    let existingData = {};
    if (fs.existsSync(DATA_FILE_PATH)) {
      try {
        existingData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
      } catch (e) {
        console.warn("Could not read or parse existing dupr.json file, starting fresh.");
      }
    }

    // 5. Structure & Map retrieved data to our format
    const updatedStats = {
      player: {
        name: playerData.name || playerData.fullName || existingData.player?.name || "Melvin Viado",
        duprId: DUPR_ID,
        duprRating: playerData.duprRating || playerData.rating || existingData.player?.duprRating || "4.32",
        duprChange: playerData.ratingChange || existingData.player?.duprChange || "+0.00",
        winRate: playerData.winRate ? `${(playerData.winRate * 100).toFixed(1)}%` : existingData.player?.winRate || "70.0%",
        winCount: playerData.wins || existingData.player?.winCount || 0,
        lossCount: playerData.losses || existingData.player?.lossCount || 0,
        matchesCount: playerData.totalMatches || existingData.player?.matchesCount || "0",
        tournamentWins: playerData.tournamentWins || existingData.player?.tournamentWins || "0",
        homeCourt: playerData.homeCourt || existingData.player?.homeCourt || "Local Courts",
        playStyle: playerData.playStyle || existingData.player?.playStyle || "All-court player",
        currentPaddle: playerData.paddle || existingData.player?.currentPaddle || "Raw Carbon Fiber Paddle",
        nextTournament: playerData.nextTournament || existingData.player?.nextTournament || "None scheduled"
      },
      // Map API match format to our UI match list format
      recentMatches: matchesData.length > 0 ? matchesData.map((m, idx) => ({
        id: idx + 1,
        partner: m.partnerName || "None (Singles)",
        opponents: m.opponentsName || "Opponents",
        score: m.score || "11-0",
        result: m.result || "Win",
        date: m.date || new Date().toLocaleDateString(),
        type: m.matchType || "Rec"
      })) : existingData.recentMatches || [],
      // Retain manual skill/rating history profiles if not supplied by basic API
      ratingHistory: existingData.ratingHistory || [],
      skillsBreakdown: existingData.skillsBreakdown || [],
      matchStats: existingData.matchStats || []
    };

    // Ensure the folder exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write updated JSON
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedStats, null, 2));
    console.log(`Successfully updated DUPR stats in: ${DATA_FILE_PATH}`);

  } catch (error) {
    console.error("FATAL ERROR: Failed to run DUPR update script:");
    console.error(error.message || error);
    console.log("Restoring existing local file to prevent web application crash.");
  }
}

// Execute
updateDUPRStats();
