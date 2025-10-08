//Déclaration des variables
let allCharacters = {};
const url= "https://rickandmortyapi.com/"
const apiUrl = `${url}api`;
let currentPage = 1;
let totalPages = 1;
let nextPageUrl = null;
let prevPageUrl = null;

function showError(error) {
  const div = document.createElement("div");
  div.className = "p-4 bg-red-50 border-l-4 border-red-400 rounded";

  div.innerHTML = `
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-red-600 text-sm">⚠️</span>
        </div>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">Erreur de chargement</h3>
        <p class="text-sm text-red-600">${error.message}</p>
      </div>
    </div>
  `;
  document.getElementById("characters").appendChild(div);
}


async function fetchPage(pageOrUrl) {
  let url;
  if (typeof pageOrUrl === "number") {
    url = `${apiUrl}/character?page=${pageOrUrl}`;
  } else {
    url = pageOrUrl;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    allCharacters = data;
    nextPageUrl = data.info.next;
    prevPageUrl = data.info.prev;
    totalPages = data.info.pages;

    // Extraire le numéro de page depuis l’URL
    const params = new URL(url).searchParams;
    if (params.has("page")) {
      currentPage = parseInt(params.get("page"), 10);
    }

    const container = document.getElementById("characters");
    container.innerHTML = "";
    data.results.forEach(showList);

    const btnNext = document.getElementById("btnNext");
    const btnPrev = document.getElementById("btnPrev");
    btnNext.disabled = nextPageUrl === null;
    btnPrev.disabled = prevPageUrl === null;

    const pageIndicator = document.getElementById("pageIndicator");
    pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
  } catch (error) {
    showError(error);
  }
}

// Au chargement de la page
window.addEventListener("DOMContentLoaded", async () => {
// Récupérer les éléments des boutons
  const btnNext = document.getElementById("btnNext");
  const btnPrev = document.getElementById("btnPrev");

  btnNext.addEventListener("click", () => {
    if (nextPageUrl) {
      fetchPage(nextPageUrl);
    }
  });
  btnPrev.addEventListener("click", () => {
    if (prevPageUrl) {
      fetchPage(prevPageUrl);
    }
  });

// Charger la page 1 par défaut
  await fetchPage(`${apiUrl}/character?page=1`);
});


function showList(c) {
  const container = document.getElementById("characters");
  const card = document.createElement("div");
  const nameEl = document.createElement("h2");
    nameEl.className = "text-lg font-bold hover:text-orange-500 cursor-pointer hover:underline";
    nameEl.textContent = c.name;
    nameEl.addEventListener("click", () => showDetails(c));
  card.className =
    "w-full max-w-[260px] hover:scale-105 transition-transform flex flex-col items-center text-center bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg hover:bg-green-50";

  const statusColor =
    c.status === "Alive"? "text-green-600": c.status === "Dead"? "text-red-600"
      : "text-gray-500";
    if (c.status === "unknown") c.status = "Inconnu";

  card.innerHTML = `
    <img src="${c.image}" alt="${c.name}" class="w-32 h-32 object-contain mb-3 rounded-lg">
    <p class="text-gray-500 text-sm mb-1">${c.species}${
    c.type
  }</p>
    <p class="text-sm ${statusColor} font-semibold">${c.status}</p>
    <p class="text-xs text-gray-600 mt-2 italic hover:text-orange-500"> Origine : ${
      c.origin.name
    }</p>
    <p class="text-xs text-gray-600 italic hover:text-orange-500">Dernier lieu connu : ${
      c.location.name
    }</p>
  `;
  card.prepend(nameEl);
  container.appendChild(card);
}

async function showDetails(c) {
  const modal = document.getElementById("characterModal");
  const img = document.getElementById("modalImage");
  const name = document.getElementById("modalName");
  const status = document.getElementById("modalStatus");
  const species = document.getElementById("modalSpecies");
  const gender = document.getElementById("modalGender");
  const origin = document.getElementById("modalOrigin");
  const location = document.getElementById("modalLocation");
  const episodes = document.getElementById("modalEpisodes");

  img.src = c.image;
  name.textContent = c.name;

  const statusColor =
    c.status === "Alive"
      ? "text-green-600"
      : c.status === "Dead"
      ? "text-red-600"
      : "text-gray-500";
  status.innerHTML = `<span class="${statusColor} font-semibold">${c.status}</span>`;

  species.textContent = `Espèce : ${c.species}${c.type ? " (" + c.type + ")" : ""}`;
  gender.textContent = `Genre : ${c.gender}`;
  origin.textContent = `Origine : ${c.origin.name}`;
  location.textContent = `Dernier lieu connu : ${c.location.name}`;

  // Charger les épisodes (limite à 3 pour éviter la surcharge)
  const episodeIds = c.episode.slice(0, 3).map((ep) => ep.split("/").pop());
  const episodeData = await Promise.all(
    episodeIds.map((id) =>
      fetch(`https://rickandmortyapi.com/api/episode/${id}`).then((r) => r.json())
    )
  );

  episodes.textContent =
    "Épisodes : " + episodeData.map((e) => e.name).join(", ") + (c.episode.length > 3 ? "..." : "");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("characterModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Fermer aussi si on clique sur le fond noir
document.getElementById("characterModal").addEventListener("click", (e) => {
  if (e.target.id === "characterModal") {
    e.currentTarget.classList.add("hidden");
    e.currentTarget.classList.remove("flex");
  }
});

// Fermer avec la touche Échape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("characterModal");
    if (!modal.classList.contains("hidden")) {
        modal.classList.add("hidden"); 
        modal.classList.remove("flex");
    }
    }
});

// Fin du script