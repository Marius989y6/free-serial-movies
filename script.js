const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const suggestionsContainer = document.getElementById("suggestions");
const resultsContainer = document.getElementById("results");
const videoContainer = document.getElementById("video-container");
const videoPlayer = document.getElementById("video-player");
const corsProxy = "https://cors-anywhere.pulkitpareekofficial.workers.dev/?url=";

// Funcție pentru generarea sugestiilor
searchInput.addEventListener("input", function () {
    const query = encodeURIComponent(searchInput.value);
    if (query.length < 1) {
        suggestionsContainer.classList.add("hidden");
        return;
    }
    
    const url = `${corsProxy}https://v3.sg.media-imdb.com/suggestion/x/${query}.json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = "";
            data.d.forEach(result => {
                if (result.i) {
                    const suggestionItem = document.createElement("div");
                    suggestionItem.classList.add("suggestion-item");
                    suggestionItem.textContent = result.l;
                    suggestionItem.addEventListener("click", function () {
                        searchInput.value = result.l;
                        suggestionsContainer.classList.add("hidden");
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                }
            });
            suggestionsContainer.classList.remove("hidden");
        });
});

// Funcție pentru afișarea rezultatelor
searchButton.addEventListener("click", function () {
    fetchAndShow();
});

function fetchAndShow() {
    const query = encodeURIComponent(searchInput.value);
    const url = `${corsProxy}https://v3.sg.media-imdb.com/suggestion/x/${query}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = "";
            data.d.forEach(result => {
                if (result.i && (result.qid === "movie" || result.qid === "tvSeries")) {
                    const resultElem = document.createElement("div");
                    resultElem.classList.add("result");
                    resultElem.innerHTML = `
                        <img src="${result.i.imageUrl}" alt="${result.l}">
                        <div class="info">
                            <h3>${result.l}</h3>
                            <p>${result.s}</p>
                        </div>
                    `;
                    resultElem.addEventListener("click", function () {
                        playVideo(result.id, result.qid);
                    });
                    resultsContainer.appendChild(resultElem);
                }
            });
        });
}

// Funcție pentru redare video pe aceeași pagină
function playVideo(imdbId, type) {
    videoContainer.classList.remove("hidden");
    if (type === "movie") {
        videoPlayer.src = `https://www.2embed.cc/embed/${imdbId}`;
    } else if (type === "tvSeries") {
        videoPlayer.src = `https://www.2embed.cc/embedtv/${imdbId}&s=1&e=1`;
    }
}
