
document.getElementById("searchBtn").addEventListener("click", searchAnime);

async function searchAnime() {
  const query = document.getElementById("searchInput").value.trim();

  if (query === "") {
    alert("⚠️ Please enter an anime title before searching!");
    return;
  }

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();

    resultsDiv.innerHTML = ""; // clear old results

    if (!data.data.length) {
      alert("❌ No results found for your search.");
      resultsDiv.innerHTML = "<p>No results found!</p>";
      return;
    }

    alert(`✅ Found ${data.data.length} anime result(s) for "${query}"`);

    // Display search results dynamically
    data.data.forEach((anime) => {
      const card = document.createElement("div");
      card.classList.add("anime-card");

      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
        <h3>${anime.title}</h3>
        <p><strong>Score:</strong> ${anime.score || "N/A"} | <strong>Rank:</strong> ${anime.rank || "N/A"}</p>
        <p>${anime.synopsis ? anime.synopsis.substring(0, 150) + "..." : "No synopsis available."}</p>
        <button class="addBtn">Add to Watchlist</button>
      `;

      // When "Add to Watchlist" is clicked
      card.querySelector(".addBtn").addEventListener("click", () => {
        addToWatchlist({
          title: anime.title,
          image: anime.images.jpg.image_url,
          url: anime.url,
          score: anime.score,
          synopsis: anime.synopsis
        });
      });

      resultsDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert("🚫 Failed to fetch data. Please check your internet connection and try again.");
    resultsDiv.innerHTML = "<p>Failed to fetch data. Please try again.</p>";
  }
}

// Save anime to localStorage (CREATE)
function addToWatchlist(anime) {
  try {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const exists = watchlist.some((a) => a.title === anime.title);

    if (exists) {
      alert("⚠️ This anime is already in your watchlist!");
      return;
    }

    watchlist.push(anime);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert(`✅ ${anime.title} was successfully added to your watchlist!`);
  } catch (error) {
    console.error(error);
    alert("❌ Failed to save anime to your watchlist.");
  }
}

