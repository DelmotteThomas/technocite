const baseUrl = "https://pokeapi.co/api/v2";
let allPokemonList = [];
let currentPage = 1;
let totalPages = 1;
let nextPageUrl = null;
let prevPageUrl = null;
let currentPokemonId = null;


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
//Capitalize first letter
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
// Récupération des infos d’une espèce (nom FR, description)
async function fetchPokemonSpecies(id) {
  const res = await fetch(`${baseUrl}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Erreur lors du chargement de la fiche espèce");
  const data = await res.json();

  // Nom FR
  const nameFR =
    data.names.find((n) => n.language.name === "fr")?.name || "Nom inconnu";

  // Description FR (flavor text)
  const flavorFR =
    data.flavor_text_entries
      .find((entry) => entry.language.name === "fr")
      ?.flavor_text.replace(/\n|\f/g, " ") || "Description non disponible.";

  return { nameFR, flavorFR };
}

// --- Préchargement rapide des Pokémon avec nom FR ---
async function preloadAllPokemon() {
  const res = await fetch(`${baseUrl}/pokemon?limit=1000`);
  const data = await res.json();

  allPokemonList = await Promise.all(
    data.results.map(async (p) => {
      const id = p.url.split("/").filter(Boolean).pop();
      const species = await fetch(`${baseUrl}/pokemon-species/${id}`).then((r) =>
        r.json()
      );
      const nameFR =
        species.names.find((n) => n.language.name === "fr")?.name ||
        p.name;

      return { id: Number(id), name: p.name, nameFR, url: p.url };
    })
  );

  console.log("✅ Pokémon FR chargés :", allPokemonList.length);
}

// Affichage Pokémons
async function showList(pokemon) {
  const container = document.getElementById("characters");
  const card = document.createElement("div");

  // Récupération des détails du Pokémon
  const res = await fetch(pokemon.url);
  const detailsPokemon = await res.json();

  const speciesData = await fetchPokemonSpecies(detailsPokemon.id);
  const nameFR = speciesData.nameFR;

  // Type principal (pour couleur de fond)
  const mainType = detailsPokemon.types[0].type.name;
  const mainColor = THEME.typeColors[mainType] || THEME.secondary;

  // Conteneur principal
  card.className =
    "relative bg-white rounded-3xl shadow-md p-4 w-64 h-64 flex flex-col items-center justify-end hover:scale-105 transition-transform hover:shadow-xl overflow-hidden";

  // ID
  const idEl = document.createElement("p");
  idEl.textContent = `#${detailsPokemon.id.toString().padStart(3, "0")}`;
  idEl.className = "absolute top-3 right-4 text-lg text-gray-400";

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
  nameEl.textContent = capitalizeFirst(nameFR);
  nameEl.className =
    "absolute bottom-6 left-0 w-full text-center text-xl font-semibold capitalize text-gray-800 z-30";

  card.addEventListener("click", () => showDetails(pokemon));

  // Assemblage
  card.appendChild(idEl);
  card.appendChild(bgBottom);
  card.appendChild(typesContainer);
  card.appendChild(imgEl);
  card.appendChild(nameEl);
  container.appendChild(card);
}
// Détails d’un Pokémon
async function showDetails(pokemon) {
  const modal = document.getElementById("pokemonModal");
  const modalHeader = document.getElementById("modalHeader");

  // Récupération des données détaillées
  let details;
  if (pokemon.url) {
    // Si c’est un objet léger avec une URL
    const res = await fetch(pokemon.url);
    details = await res.json();
  } else {
    // Si c’est déjà un objet complet
    details = pokemon;
  }

  const { nameFR, flavorFR } = await fetchPokemonSpecies(details.id);

  // Couleur principale selon le type
  const mainType = details.types[0].type.name;
  const mainColor = THEME.typeColors[mainType] || THEME.secondary;

  // --- Header ---
  modalHeader.style.backgroundColor = mainColor;
  document.getElementById("modalName").textContent = capitalizeFirst(nameFR);
  document.getElementById("modalId").textContent = `#${details.id
    .toString()
    .padStart(3, "0")}`;
  document.getElementById("modalImage").src =
    details.sprites.other["official-artwork"].front_default;

  // --- Types ---
  const typesContainer = document.getElementById("modalTypes");
  typesContainer.innerHTML = "";
  details.types.forEach((typeInfo) => {
    const badge = document.createElement("span");
    badge.textContent = capitalizeFirst(typeInfo.type.name);
    badge.className = "px-3 py-1 text-sm rounded-full text-white shadow-md";
    badge.style.backgroundColor = THEME.typeColors[typeInfo.type.name];
    typesContainer.appendChild(badge);
  });

  document.getElementById("modalAboutTitle").style.color = mainColor;

  // --- About ---
  document.getElementById("modalWeight").textContent = `${
    details.weight / 10
  } kg`;
  document.getElementById("modalHeight").textContent = `${
    details.height / 10
  } m`;
  document.getElementById("modalAbilities").textContent = details.abilities
    .map((a) => capitalizeFirst(a.ability.name))
    .join(", ");

  document.getElementById("modalDescription").textContent = flavorFR;
  document.getElementById("modalBaseStatTitle").style.color = mainColor;
  // --- Base stats ---
  const statsContainer = document.getElementById("modalStats");
  statsContainer.innerHTML = "";
  details.stats.forEach((s) => {
    const line = document.createElement("div");
    line.className = "flex items-center gap-2 text-sm";

    const label = document.createElement("span");
    label.className = "w-16 uppercase";
    label.style.color = mainColor;
    label.textContent = s.stat.name.slice(0, 3);

    const value = document.createElement("span");
    value.className = `w-10`;
    value.textContent = s.base_stat.toString().padStart(3, "0");

    const bar = document.createElement("div");
    bar.className = "flex-1 bg-gray-200 h-2 rounded overflow-hidden";
    const fill = document.createElement("div");
    fill.style.backgroundColor = mainColor;
    fill.className = "h-full bg-green-500";
    fill.style.width = `${(s.base_stat / 150) * 100}%`;
    bar.appendChild(fill);

    line.append(label, value, bar);
    statsContainer.appendChild(line);
  });

  // Sauvegarde de l’ID pour navigation
  currentPokemonId = details.id;

  // --- Navigation boutons ---
  document.getElementById("modalPrev").onclick = async () => {
    if (currentPokemonId > 1) {
      const res = await fetch(`${baseUrl}/pokemon/${currentPokemonId - 1}`);
      const data = await res.json();
      showDetails(data);
    }
  };

  document.getElementById("modalNext").onclick = async () => {
    const res = await fetch(`${baseUrl}/pokemon/${currentPokemonId + 1}`);
    if (!res.ok) return;
    const data = await res.json();
    showDetails(data);
  };

  // --- Navigation clavier ---
  window.onkeydown = async (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft" && currentPokemonId > 1) {
      const res = await fetch(`${baseUrl}/pokemon/${currentPokemonId - 1}`);
      const data = await res.json();
      showDetails(data);
    }
    if (e.key === "ArrowRight") {
      const res = await fetch(`${baseUrl}/pokemon/${currentPokemonId + 1}`);
      if (res.ok) {
        const data = await res.json();
        showDetails(data);
      }
    }
    if (e.key === "Escape") {
      modal.classList.add("hidden");
    }
  };

  // --- Affichage ---
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// Fermeture
document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("pokemonModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

document.getElementById("pokemonModal").addEventListener("click", (e) => {
  if (e.target.id === "pokemonModal") {
    e.currentTarget.classList.add("hidden");
    e.currentTarget.classList.remove("flex");
  }
});

// --- Chargement liste de carte + pagination ---


window.addEventListener("DOMContentLoaded", async () => {
  // 🔹 On récupère *tous* les Pokémon au démarrage
  const allRes = await fetch(`${baseUrl}/pokemon?limit=1000`);
  const allData = await allRes.json();

  // 🧠 On ajoute les noms français (species endpoint)
  allPokemonList = await Promise.all(
    allData.results.map(async (p) => {
      const id = p.url.split("/").filter(Boolean).pop();
      const speciesRes = await fetch(`${baseUrl}/pokemon-species/${id}`);
      const speciesData = await speciesRes.json();
      const nameFR =
        speciesData.names.find((n) => n.language.name === "fr")?.name ||
        p.name;

      return { id: Number(id), name: p.name, nameFR, url: p.url };
    })
  );


  // --- Chargement initial de la première page ---
  await fetchPage(1);

  // --- Pagination ---
  document.getElementById("btnNext").addEventListener("click", () => {
    if (nextPageUrl) fetchPage(currentPage + 1);
  });

  document.getElementById("btnPrev").addEventListener("click", () => {
    if (prevPageUrl && currentPage > 1) fetchPage(currentPage - 1);
  });

  // --- Recherche ---
  document.getElementById("searchInput").addEventListener("input", async (e) => {
    const term = e.target.value.toLowerCase().trim();
    const container = document.getElementById("characters");
    container.innerHTML = "";

    if (!term) {
      const start = (currentPage - 1) * 20;
      const pageSlice = allPokemonList.slice(start, start + 20);
      for (const p of pageSlice) {
        await showList(p);
      }
      return;
    }

    const filtered = allPokemonList.filter((p) =>
      p.nameFR.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500'>Aucun Pokémon trouvé 😔</p>";
      return;
    }

    for (const p of filtered.slice(0, 20)) {
      await showList(p);
    }
  });
});

