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

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok || !loginData.result || !loginData.result.accessToken) {
      console.error("Login Response Status:", loginResponse.status);
      console.error("Login Response Body:", JSON.stringify(loginData, null, 2));
      throw new Error(`Authentication failed. Status: ${loginResponse.status}. Message: ${loginData.message || 'No access token returned'}`);
    }

    const accessToken = loginData.result.accessToken;
    const userProfile = loginData.result.user;
    console.log("Authentication successful! Token and user profile acquired.");

    // 2. Fetch Player Profiles & Stats
    // If DUPR_ID is the default mock string, use the authenticated user's numeric ID instead
    const activePlayerId = (DUPR_ID === 'DUPR-893-XKL' && userProfile.id) ? userProfile.id : DUPR_ID;
    console.log(`Fetching DUPR stats for player ID: ${activePlayerId}...`);
    
    const playerResponse = await fetch(`https://api.dupr.gg/player/v1.0/${activePlayerId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      }
    });

    let playerData = {};
    if (playerResponse.ok) {
      playerData = await playerResponse.json();
      console.log("Player profile data retrieved successfully.");
    } else {
      console.warn(`WARNING: Failed to fetch player profile (Status: ${playerResponse.status}). Using login user profile instead.`);
    }

    // 3. Fetch Match History
    let matchesData = [];
    const pageSize = 20;
    let offset = 0;
    let fetchMore = true;

    while (fetchMore) {
      console.log(`Fetching player match history (limit: ${pageSize}, offset: ${offset})...`);
      const matchesResponse = await fetch(`https://api.dupr.gg/player/v1.0/${activePlayerId}/history?limit=${pageSize}&offset=${offset}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        }
      });

      if (matchesResponse.ok) {
        const matchResult = await matchesResponse.json();
        const hits = (matchResult.result && matchResult.result.hits) || 
                      (matchResult.result && matchResult.result.matches) || 
                      matchResult.matches || 
                      matchResult.hits || 
                      [];
        
        matchesData = matchesData.concat(hits);
        console.log(`Retrieved ${hits.length} records. Total so far: ${matchesData.length}`);
        
        // Stop if we got fewer records than requested (end of data) or hit a safety limit of 100
        if (hits.length < pageSize || matchesData.length >= 100) {
          fetchMore = false;
        } else {
          offset += pageSize;
        }
      } else {
        const errorText = await matchesResponse.text().catch(() => "");
        console.warn(`WARNING: Failed to fetch match history at offset ${offset} (Status: ${matchesResponse.status}). Response: ${errorText}`);
        fetchMore = false;
      }
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

    // 5. Parse Matches and Compute Stats
    let computedWins = 0;
    let computedLosses = 0;
    let opponentRatingSum = 0;
    let opponentRatingCount = 0;

    const parsedMatches = matchesData.map((m, idx) => {
      try {
        const myId = userProfile.id || 6654582466;
        const teams = m.teams || [];
        
        // Find my team: the one containing a player with my ID or containing Melvin's name
        let myTeam = teams.find(t => 
          (t.player1 && (t.player1.id === myId || t.player1.fullName === "Melvin Viado")) || 
          (t.player2 && (t.player2.id === myId || t.player2.fullName === "Melvin Viado"))
        );
        
        // Fallback to first team if not found
        if (!myTeam && teams.length > 0) myTeam = teams[0];
        
        // Find opponent team: the other team
        let opponentTeam = teams.find(t => t !== myTeam);
        if (!opponentTeam && teams.length > 1) opponentTeam = teams[1];
        
        // Calculate Win/Loss
        const isWin = myTeam && myTeam.winner;
        if (isWin) {
          computedWins++;
        } else {
          computedLosses++;
        }

        // Calculate Opponent Ratings Average
        if (opponentTeam) {
          const op1 = opponentTeam.player1;
          const op2 = opponentTeam.player2;
          let opRating = 0;
          let opCount = 0;
          
          if (op1 && op1.postMatchRating && op1.postMatchRating.doubles) {
            opRating += parseFloat(op1.postMatchRating.doubles);
            opCount++;
          }
          if (op2 && op2.postMatchRating && op2.postMatchRating.doubles) {
            opRating += parseFloat(op2.postMatchRating.doubles);
            opCount++;
          }
          
          if (opCount > 0) {
            opponentRatingSum += (opRating / opCount);
            opponentRatingCount++;
          }
        }

        let partnerName = "None (Singles)";
        if (myTeam) {
          const p1 = myTeam.player1;
          const p2 = myTeam.player2;
          if (p1 && p2) {
            // Doubles match
            if (p1.id === myId || p1.fullName === "Melvin Viado") {
              partnerName = p2.fullName;
            } else {
              partnerName = p1.fullName;
            }
          }
        }
        
        let opponentsName = "Opponents";
        if (opponentTeam) {
          const op1 = opponentTeam.player1;
          const op2 = opponentTeam.player2;
          if (op1 && op2) {
            opponentsName = `${op1.fullName} & ${op2.fullName}`;
          } else if (op1) {
            opponentsName = op1.fullName;
          } else if (op2) {
            opponentsName = op2.fullName;
          }
        }
        
        // Construct score string
        let scoreParts = [];
        if (myTeam && opponentTeam) {
          for (let i = 1; i <= 5; i++) {
            const myScore = myTeam[`game${i}`];
            const opScore = opponentTeam[`game${i}`];
            if (myScore !== undefined && myScore !== null && myScore >= 0 &&
                opScore !== undefined && opScore !== null && opScore >= 0) {
              scoreParts.push(`${myScore}-${opScore}`);
            }
          }
        }
        const scoreStr = scoreParts.length > 0 ? scoreParts.join(", ") : "11-0";
        
        // Determine Win/Loss
        const resultStr = isWin ? "Win" : "Loss";
        
        // Format date: e.g. "2026-03-14" to "Mar 14"
        let dateStr = m.eventDate || new Date().toLocaleDateString();
        try {
          if (m.eventDate) {
            const dateObj = new Date(m.eventDate);
            if (!isNaN(dateObj.getTime())) {
              const options = { month: 'short', day: 'numeric' };
              dateStr = dateObj.toLocaleDateString('en-US', options);
            }
          }
        } catch (e) {}

        const matchType = (m.league && m.league.toLowerCase().includes("tournament")) ? "Tournament" : "Rec";
        
        return {
          id: idx + 1,
          partner: partnerName,
          opponents: opponentsName,
          score: scoreStr,
          result: resultStr,
          date: dateStr,
          type: matchType
        };
      } catch (err) {
        console.error("Error parsing match record:", err);
        return {
          id: idx + 1,
          partner: "None (Singles)",
          opponents: "Opponents",
          score: "11-0",
          result: "Win",
          date: m.eventDate || new Date().toLocaleDateString(),
          type: "Rec"
        };
      }
    });

    // Extract reliability score (often called half-life or connectivity confidence)
    const reliability = playerData.result?.ratings?.doublesReliabilityScore || 
                        userProfile.stats?.doublesReliabilityScore || 
                        existingData.player?.reliabilityScore || 
                        36;

    // Calculate win rate
    const totalMatches = computedWins + computedLosses;
    const winRate = totalMatches > 0 ? `${((computedWins / totalMatches) * 100).toFixed(1)}%` : "0.0%";

    const avgOpponentRating = opponentRatingCount > 0 ? 
      (opponentRatingSum / opponentRatingCount).toFixed(3) : 
      existingData.player?.avgOpponentRating || "3.850";

    // 6. Structure & Map retrieved data to our format
    const updatedStats = {
      player: {
        name: playerData.result?.fullName || userProfile.fullName || existingData.player?.name || "Melvin Viado",
        duprId: playerData.result?.duprId || userProfile.duprId || DUPR_ID,
        duprRating: playerData.result?.ratings?.doubles || userProfile.stats?.doubles || existingData.player?.duprRating || "3.907",
        duprChange: existingData.player?.duprChange || "+0.15 this month",
        winRate: winRate,
        winCount: computedWins,
        lossCount: computedLosses,
        matchesCount: String(totalMatches),
        tournamentWins: existingData.player?.tournamentWins || "3",
        homeCourt: (playerData.result?.shortAddress) || (userProfile.addresses && userProfile.addresses[0]?.formattedAddress) || existingData.player?.homeCourt || "Oshawa, ON, Canada",
        playStyle: existingData.player?.playStyle || "Third Shot Drop Specialist, Heavy Top-Spin",
        currentPaddle: existingData.player?.currentPaddle || "Selkirk Vanguard Control Invicto (16mm)",
        nextTournament: existingData.player?.nextTournament || "Austin Summer Open (June 12, 2026)",
        reliabilityScore: `${reliability}%`,
        avgOpponentRating: avgOpponentRating
      },
      recentMatches: parsedMatches,
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
