// Déclaration des variables
const BASE_URL = "https://rickandmortyapi.com/api";
let allCharacters = {};
let currentPage = 1;
let totalPages = 1;
let nextPageUrl = null;
let prevPageUrl = null;

///////////////
///Fonction///
//////////////

// Gestion des erreurs
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

// Chargement d’une page
async function fetchPage(pageOrUrl) {
  let url;
  if (typeof pageOrUrl === "number") {
    url = `${BASE_URL}/character?page=${pageOrUrl}`;
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

    // Numéro de page
    const params = new URL(url).searchParams;
    if (params.has("page")) currentPage = parseInt(params.get("page"), 10);

    // Affichage des personnages
    const container = document.getElementById("characters");
    container.innerHTML = "";
    data.results.forEach(showList);

    // Pagination
    document.getElementById("btnNext").disabled = !nextPageUrl;
    document.getElementById("btnPrev").disabled = !prevPageUrl;
    document.getElementById(
      "pageIndicator"
    ).textContent = `Page ${currentPage} / ${totalPages}`;
  } catch (error) {
    showError(error);
  }
}

// Récupération des épisodes
async function fetchEpisodes(episodeUrls, limit = 10) {
  const ids = episodeUrls.slice(0, limit).map((ep) => ep.split("/").pop());
  const results = await Promise.all(
    ids.map((id) =>
      fetch(`${BASE_URL}/episode/${id}`).then((r) => {
        if (!r.ok) throw new Error(`Erreur épisode ${id}`);
        return r.json();
      })
    )
  );
  return results;
}

// function d’affichage
function showList(c) {
  const container = document.getElementById("characters");
  const card = document.createElement("div");

  // Création des éléments un par un
  const nameEl = document.createElement("h2");
  nameEl.className =
    "text-lg font-bold hover:text-orange-500 cursor-pointer mb-2";
  nameEl.textContent = c.name;
  nameEl.addEventListener("click", () => showDetails(c));

  const imgEl = document.createElement("img");
  imgEl.src = c.image;
  imgEl.alt = c.name;
  imgEl.className = "w-32 h-32 object-contain mb-3 rounded-lg";

  const speciesEl = document.createElement("p");
  speciesEl.className = "text-gray-500 text-sm mb-1";
  speciesEl.textContent = `${c.species}${c.type ? ` (${c.type})` : ""}`;

  const statusEl = document.createElement("p");
  const statusColor =
    c.status === "Alive"
      ? "text-green-600"
      : c.status === "Dead"
      ? "text-red-600"
      : "text-gray-500";
  statusEl.className = `text-sm font-semibold ${statusColor}`;
  statusEl.textContent = c.status === "unknown" ? "Inconnu" : c.status;

  const originEl = document.createElement("p");
  originEl.className =
    "text-xs text-gray-600 mt-2 italic hover:text-orange-500 cursor-pointer";
  originEl.textContent = `Origine : ${c.origin.name}`;

  const locationEl = document.createElement("p");
  locationEl.className =
    "text-xs text-gray-600 italic hover:text-orange-500 cursor-pointer";
  locationEl.textContent = `Dernière apparition : ${c.location.name}`;

  if (c.origin.name) {
    originEl.addEventListener("click", () => filterByOrigin(c.origin.name));
  }

  if (c.location.name) {
    locationEl.addEventListener("click", () =>
      filterByLocation(c.location.name)
    );
  }

  // 💡 Assemblage
  card.className =
    "w-full max-w-[260px] hover:scale-105 transition-transform flex flex-col items-center text-center bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg hover:bg-green-50";

  card.appendChild(nameEl);
  card.appendChild(imgEl);
  card.appendChild(speciesEl);
  card.appendChild(statusEl);
  card.appendChild(originEl);
  card.appendChild(locationEl);

  container.appendChild(card);
}
// Détails (modal)

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

  species.textContent = `Espèce : ${c.species}${c.type}`;
  gender.textContent = `Genre : ${c.gender}`;
  origin.textContent = `Origine : ${c.origin.name}`;
  location.textContent = `Dernière apparition : ${c.location.name}`;

  try {
    const episodeData = await fetchEpisodes(c.episode);
    episodes.innerHTML =
      '<span class="font-bold">Épisodes :</span> ' +
      episodeData.map((e) => `<span class="flex-col">${e.name}</span>`).join(", ") +
      (c.episode.length > 10 ? "..." : "");
  } catch (err) {
    episodes.textContent = "Erreur de chargement des épisodes";
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}


function filterByOrigin(originName) {
  document.getElementById("btnBack").classList.remove("hidden");
  document.getElementById("pagination").classList.add("hidden");
  const container = document.getElementById("characters");
  container.innerHTML = "";

  // Filtrer les personnages déjà chargés
  const filtered = allCharacters.results.filter(
    (char) => char.origin.name === originName
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 italic">Aucun personnage originaire de ${originName} trouvé.</p>`;
    return;
  }

  const title = document.createElement("h2");
  title.className =
    "text-2xl font-bold text-center w-full col-span-full text-orange-600 mb-6";
  title.textContent = `Personnages originaires de : ${originName}`;
  container.appendChild(title);
  filtered.forEach(showList);
}

function filterByLocation(locationName) {
  document.getElementById("btnBack").classList.remove("hidden");
  document.getElementById("pagination").classList.add("hidden");
  const container = document.getElementById("characters");
  container.innerHTML = "";

  const filtered = allCharacters.results.filter(
    (char) => char.location.name === locationName
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 italic">Aucun personnage trouvé dans ${locationName}.</p>`;
    return;
  }

  const title = document.createElement("h2");
  title.className =
    "text-2xl font-bold text-center w-full col-span-full text-orange-600 mb-6";
  title.textContent = `Personnages présents à : ${locationName}`;
  container.appendChild(title);
  filtered.forEach(showList);
}
///////////////
//Evénements//
/////////////
// Chargement de la page

window.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("btnNext")
    .addEventListener("click", () => nextPageUrl && fetchPage(nextPageUrl));
  document
    .getElementById("btnPrev")
    .addEventListener("click", () => prevPageUrl && fetchPage(prevPageUrl));
  await fetchPage(`${BASE_URL}/character?page=1`);
});
// Click sur le bouton retour

document.getElementById("btnBack").addEventListener("click", () => {
  document.getElementById("btnBack").classList.add("hidden");
  fetchPage(`${BASE_URL}/character?page=1`);
  document.getElementById("pagination").classList.remove("hidden");
});

// Fermeture du modal
// Bouton de fermeture
document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("characterModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});
// Fermeture en cliquant en dehors
document.getElementById("characterModal").addEventListener("click", (e) => {
  if (e.target.id === "characterModal") {
    e.currentTarget.classList.add("hidden");
    e.currentTarget.classList.remove("flex");
  }
});
// Fermeture avec la touche Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("characterModal");
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }
});
