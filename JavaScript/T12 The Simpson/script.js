// Déclaration des variables
let allUsers = {};
let nextPageUrl = null;
let prevPageUrl = null;
let currentPage = 1;
let totalPages = 1;
const apiUrl = "https://thesimpsonsapi.com/api";

// Function

// Affichage d'un personnage dans une "card"
function showList(u) {
  const container = document.getElementById("characters");
  const card = document.createElement("div");
  card.className =
    " min-h-[300px] w-full max-w-[260px] hover:scale-105 hover:text-yellow-700 flex flex-col items-center text-center bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg hover:bg-yellow-100 hover:border-yellow-300 transition duration-200";
  const name = u.name;
  let occupation = u.occupation;
  if (occupation.length > 60) {
  // Tronque à 62 caractères sans couper un mot  | Recherche la dernière espace avant 62
    occupation =
      occupation.substring(0, occupation.lastIndexOf(" ", 62)) + "...";
  }
  const status = u.status;
  let age = u.age === null || u.age === "unknown" ? "Inconnu" : u.age;
  // Gestion de l'image
  const portrait = u.portrait_path
    ? `https://cdn.thesimpsonsapi.com/500${u.portrait_path}`
    : null;
  // Gestion des phrases célèbres
  let firstPhrases = "";
  if (Array.isArray(u.phrases) && u.phrases.length > 0) {
    // Prend la première phrase
    firstPhrases = u.phrases[0];
    // Si la première phrase est trop longue, prend la deuxième && si elle existe
    if (firstPhrases.length > 10 && u.phrases[1]) {
      firstPhrases = u.phrases[1];
    }
  } // Si aucune phrase n'est trouvée
  if (!firstPhrases) {
    firstPhrases = "Pas de phrase célèbre répertoriée.";
  }

  // insertion du contenu dans la carte

  card.innerHTML = `
    ${
      portrait
        ? `<img src="${portrait}" alt="${name}" class="w-32 h-32 object-contain mb-3 rounded-lg transition-transform duration-300 hover:scale-105">`
        : ""
    }
    <h2 class="text-lg font-bold">${name}</h2>
    <p class="text-gray-500 text-sm mb-2 hover:text-yellow-500">${occupation}</p>

    <div class="flex flex-wrap justify-center gap-2 mb-3">
      <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
        Âge : ${age}
      </span>
      <span class="text-xs px-3 py-1 rounded-full font-semibold ${
        status.toLowerCase() === "alive" ? "bg-green-50 text-green-800": "bg-red-50 text-red-800 font-bold"
      }">
        ${status.toLowerCase() === "alive" ? "En vie" : "Décédé"}
      </span>
    </div>
    <p class=" mt-auto italic text-gray-700 text-[12px] line-clamp-3 overflow-hidden max-h-[4.5rem]">"${firstPhrases}"</p>
  `;
  container.appendChild(card);
}

// Gestion d’erreur
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

// Evenements

// Fonction pour charger une page donnée (URL complète)
async function fetchPage(pageOrUrl) {
  let url;
  if (typeof pageOrUrl === "number") {
    url = `${apiUrl}/characters?page=${pageOrUrl}`;
  } else {
    url = pageOrUrl;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    allUsers = data;
    nextPageUrl = data.next;
    prevPageUrl = data.prev;
    totalPages = data.pages;

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
  await fetchPage(`${apiUrl}/characters?page=1`);
});


// Fonction supplémentaire pour afficher une citation aléatoire
async function randomQuote() {
  const quoteSpan = document.getElementById("quoteInfo");
  quoteSpan.textContent = "Chargement d'une citation...";

  try {
    let found = false;
    let randomCharacter;
    let randomPhrase = "";
    let attempts = 0;

    while (!found && attempts < 10) {
      attempts++;

      // Récupère une page aléatoire de personnages
      const randomPage = Math.floor(Math.random() * 60) + 1;
      const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${randomPage}`);
      const data = await res.json();

      // Tire un personnage au hasard
      randomCharacter = data.results[Math.floor(Math.random() * data.results.length)];

      // Vérifie qu’il a bien des phrases
      if (Array.isArray(randomCharacter.phrases) && randomCharacter.phrases.length > 0) {
        found = true;
        randomPhrase = randomCharacter.phrases[Math.floor(Math.random() * randomCharacter.phrases.length)];
      }
    }

    // Si après 5 tentatives rien trouvé
    if (!found) {
      quoteSpan.textContent = "😅 Impossible de trouver une citation après plusieurs essais.";
      return;
    }

    // Affiche le résultat
    quoteSpan.innerHTML = `
      <div class="text-center flex items-center">
        <p>
          <span class="font-semibold text-yellow-600">${randomCharacter.name}</span> :
          "<span class="italic text-gray-800">${randomPhrase}</span>"
        </p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    quoteSpan.textContent = "⚠️ Impossible de charger une citation.";
  }
}
//Evenement bouton citation
document.getElementById("btnQuote").addEventListener("click", randomQuote);



// // Au chargement de la page
// window.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const res = await fetch(`${apiUrl}/characters`);
//     if (!res.ok) throw new Error("HTTP " + res.status);
//     const data = await res.json();
//     console.log(data);
//     allUsers = data.results;
//     data.results.forEach(showList);
//   } catch (error) {
//     showError(error);
//   }
// });
