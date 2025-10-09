const baseUrl = "https://pokeapi.co/api/v2";
let allPokemon = {};
let currentPage = 1;
let totalPages = 1;
let nextPageUrl = null;
let prevPageUrl = null;

// 🎨 Palette de couleurs globales
const THEME = {
  primary: "#DC0A2D",
  secondary: "#28AAFD",
  accent: "#FFD700",
  textDark: "#1F2937",
  textLight: "#FFFFFF",
  typeColors: {
    bug: "#A7B723",
    dark: "#75574C",
    dragon: "#7037FF",
    electric: "#F9CF30",
    fairy: "#E69EAC",
    fighting: "#C12239",
    fire: "#F57D31",
    flying: "#A891EC",
    ghost: "#70559B",
    grass: "#74CB48",
    ground: "#DEC16B",
    ice: "#9AD6DF",
    normal: "#AAA67F",
    poison: "#A43E9E",
    psychic: "#FB5584",
    rock: "#B69E31",
    steel: "#B7B9D0",
    water: "#6493EB",
  },
};

// Gestion des erreurs
function showError(error) {
  const div = document.createElement("div");
  div.className = "p-4 bg-red-50 border-l-4 border-red-400 rounded";
  div.innerHTML = `
    <div class='flex items-center'>
      <div class='flex-shrink-0'>
        <div class='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
          <span class='text-red-600 text-sm'>⚠️</span>
        </div>
      </div>
      <div class='ml-3'>
        <h3 class='text-sm font-medium text-red-800'>Erreur de chargement</h3>
        <p class='text-sm text-red-600'>${error.message}</p>
      </div>
    </div>
  `;
  document.getElementById("characters").appendChild(div);
}
function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Récupération d’une page ---
async function fetchPage(page = 1) {
  const url = `${baseUrl}/pokemon?limit=20&offset=${(page - 1) * 20}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    allPokemon = data.results;
    nextPageUrl = data.next;
    prevPageUrl = data.previous;
    totalPages = Math.ceil(data.count / 20);
    currentPage = page;

    const container = document.getElementById("characters");
    container.innerHTML = "";

    for (const pokemon of data.results) {
      await showList(pokemon);
    }

    document.getElementById(
      "pageIndicator"
    ).textContent = `Page ${currentPage} / ${totalPages}`;
    document.getElementById("btnPrev").disabled = !prevPageUrl;
    document.getElementById("btnNext").disabled = !nextPageUrl;
  } catch (error) {
    showError(error);
    console.error(error);
  }
}

// --- Affichage d’un Pokémon ---
async function showList(pokemon) {
  const container = document.getElementById("characters");
  const card = document.createElement("div");

  // Récupération des détails du Pokémon
  const res = await fetch(pokemon.url);
  const detailsPokemon = await res.json();

  
  // Type principal (pour couleur de fond)
  const mainType = detailsPokemon.types[0].type.name;
  const mainColor = THEME.typeColors[mainType] || THEME.secondary;

  // Conteneur principal
  card.className =
    "relative bg-white rounded-3xl shadow-md p-4 w-64 h-64 flex flex-col items-center justify-end hover:scale-105 transition-transform hover:shadow-xl overflow-hidden";
    
  // ID
  const idEl = document.createElement("p");
  idEl.textContent = `#${detailsPokemon.id.toString().padStart(3, "0")}`;
  idEl.className = "text-white absolute top-3 right-4 text-sm text-gray-400";

  // Image
  const imgEl = document.createElement("img");
  imgEl.src = detailsPokemon.sprites.other["official-artwork"].front_default;
  imgEl.alt = pokemon.name;
  imgEl.className =
    "absolute bottom-20 w-40 h-40 object-contain z-1000 transition-transform duration-300 hover:scale-130";

  // Bande grise arrondie
  const bgBottom = document.createElement("div");
  bgBottom.className =
    "absolute bottom-0 left-0 w-full h-20 bg-gray-100 rounded-t-3xl";

  //Badge pour les types
  const typesContainer = document.createElement("div");
  typesContainer.className =
    "absolute bottom-16 flex justify-center gap-2 z-30";
  detailsPokemon.types.forEach((typeInfo) => {
    const typeName = typeInfo.type.name;
    const color = THEME.typeColors[typeName] || THEME.secondary;

    const typeSpan = document.createElement("span");
    typeSpan.textContent = typeName;
    typeSpan.className =
      "text-xs text-white font-medium rounded-full px-3 py-1 capitalize shadow-md";
    typeSpan.style.backgroundColor = color;
    typesContainer.appendChild(typeSpan);
  });
  // Nom
  const nameEl = document.createElement("h2");
  nameEl.textContent = capitalizeFirst(pokemon.name) ;
  nameEl.className =
    "absolute bottom-8 left-0 w-full text-center text-xl font-semibold capitalize text-gray-800 z-30";

  // Assemblage
  card.appendChild(idEl);
  card.appendChild(bgBottom);
  card.appendChild(typesContainer);
  card.appendChild(imgEl);
  card.appendChild(nameEl);
  container.appendChild(card);
}

// --- Chargement initial + pagination ---
window.addEventListener("DOMContentLoaded", () => {
  fetchPage(1);

  document.getElementById("btnNext").addEventListener("click", () => {
    if (nextPageUrl) fetchPage(currentPage + 1);
  });

  document.getElementById("btnPrev").addEventListener("click", () => {
    if (prevPageUrl && currentPage > 1) fetchPage(currentPage - 1);
  });

  // 🔍 Recherche dynamique
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll("#characters > div");
    cards.forEach((card) => {
      const name = card.querySelector("h2").textContent.toLowerCase();
      card.style.display = name.includes(term) ? "block" : "none";
    });
  });
});
