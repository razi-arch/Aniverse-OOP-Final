// renderer/recommend.js

document.addEventListener("DOMContentLoaded", loadRecommendations);

document.getElementById("refreshBtn").addEventListener("click", () => {
  loadRecommendations(true);
});

async function loadRecommendations(forceRefresh = false) {
  const container = document.getElementById("recommendations");
  container.innerHTML = "<p style='text-align:center;'>Loading recommendations...</p>";

  try {
    // Fetch top anime (randomize page slightly for variation)
    const randomPage = forceRefresh ? Math.floor(Math.random() * 5) + 1 : 1;
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${randomPage}`);
    const data = await response.json();

    container.innerHTML = "";

    data.data.slice(0, 12).forEach((anime) => {
      const card = document.createElement("div");
      card.classList.add("anime-card");

      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
        <p>${anime.synopsis ? anime.synopsis.substring(0, 120) + "..." : "No synopsis available."}</p>
        <button class="addBtn">➕ Add to Watchlist</button>
      `;

      // Add to watchlist functionality
      card.querySelector(".addBtn").addEventListener("click", () => {
        addToWatchlist(anime);
      });

      container.appendChild(card);
    });

    if (forceRefresh) {
      alert("🔄 Recommendations refreshed!");
    }

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p style='text-align:center; color:red;'>Failed to load recommendations. Please try again.</p>";
  }
}

function addToWatchlist(anime) {
  const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
  const exists = stored.some((a) => a.title === anime.title);

  if (exists) {
    alert("⚠️ This anime is already in your watchlist!");
    return;
  }

  const newAnime = {
    title: anime.title,
    image: anime.images.jpg.image_url,
    url: anime.url,
    score: anime.score,
    synopsis: anime.synopsis,
    watched: false,
    review: ""
  };

  stored.push(newAnime);
  localStorage.setItem("watchlist", JSON.stringify(stored));
  alert(`✅ "${anime.title}" has been added to your watchlist!`);
}
