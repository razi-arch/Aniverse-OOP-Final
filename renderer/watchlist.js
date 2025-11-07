// renderer/watchlist.js

// Load watchlist data on page load
window.addEventListener("DOMContentLoaded", loadWatchlist);

function loadWatchlist() {
  const container = document.getElementById("watchlist");
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  container.innerHTML = ""; // clear previous content

  if (watchlist.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:#aaa;'>No anime saved in your watchlist yet!</p>";
    return;
  }

  watchlist.forEach((anime, index) => {
    const card = document.createElement("div");
    card.classList.add("anime-card");

    // Add a 'watched' class if anime is marked watched
    if (anime.watched) card.classList.add("watched");

    card.innerHTML = `
      <div class="anime-header">
        <h3>${anime.title}</h3>
        ${anime.watched ? '<span class="checkmark">✅</span>' : ""}
      </div>
      <img src="${anime.image}" alt="${anime.title}">
      <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
      <p>${anime.synopsis ? anime.synopsis.substring(0, 120) + "..." : "No synopsis available."}</p>

      <label>
        <input type="checkbox" ${anime.watched ? "checked" : ""} onchange="markWatched(${index}, this.checked)">
        Mark as Watched
      </label>
      <textarea placeholder="Add your review..." oninput="addReview(${index}, this.value)">${anime.review || ""}</textarea>

      <button class="deleteBtn" onclick="deleteAnime(${index})">🗑 Delete</button>
    `;

    container.appendChild(card);
  });
}


// UPDATE — Mark anime as watched
function markWatched(index, watched) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist[index].watched = watched;
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  alert(watched ? "✅ Marked as watched!" : "❌ Unmarked as watched!");
  loadWatchlist(); // Refresh visuals immediately
}

// UPDATE — Add or edit review
function addReview(index, reviewText) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist[index].review = reviewText;
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  console.log(`✍️ Review updated for ${watchlist[index].title}`);
}

// DELETE — Remove anime from watchlist
function deleteAnime(index) {
  if (!confirm("Are you sure you want to remove this anime?")) return;

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const deletedAnime = watchlist[index].title;

  watchlist.splice(index, 1);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  alert(`🗑️ Removed ${deletedAnime} from your watchlist.`);
  loadWatchlist(); // refresh list
}

