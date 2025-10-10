const GRAPHQL_URL = "https://corsproxy.io/?https://onepieceql.com/api/graphql";

async function fetchCharacters() {
  const query = `
    query {
      characters(filter: { limit: 1500 }) {
        results {
            name
            image
            bounty
            origin
            affiliations
        }
      }
    }
  `;
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    // Vérification sécurisée
    if (!json.data || !json.data.characters) {
      console.error("❌ Structure inattendue :", json);
      return [];
    }

    return json.data.characters.results;
  } catch (error) {
    console.error("Erreur GraphQL :", error);
    return [];
  }
}

function showList(characters) {
  const container = document.getElementById("characters");
  container.innerHTML = "";

  characters.forEach((c) => {
    const bounty =
      c.bounty && c.bounty !== "Unknown"
        ? `${c.bounty} ฿`
        : "Unknown";
    const affiliations = c.affiliations ? c.affiliations : "No affiliations";

    const card = document.createElement("div");
    card.className =
      "w-64 h-[420px] rounded-xl shadow-md p-4 flex flex-col justify-between border-[3px] border-yellow-900 hover:scale-105 transition-transform";

    card.innerHTML = `
      <h2 class="text-3xl font-bold text-yellow-900 text-center tracking-wider">WANTED</h2>
<h3 class="text-xl text-center font-bold uppercase mt-1">${c.name}</h3>
      <img 
        src="${c.image}" 
        alt="${c.name}" 
        class="w-40 h-40 object-cover mx-auto border-4 border-yellow-900 shadow-md"
      />

      <div class="text-center text-yellow-900 font-serif">
        <p class="text-sm mt-2">DEAD OR ALIVE</p>
        
        <p class="text-lg mt-2 font-semibold tracking-widest">${bounty}</p>
      </div>

      <div class="text-center text-yellow-900 font-bold text-sm tracking-wide">
        ${affiliations}
      </div>
    `;
    container.appendChild(card);
    card.classList.add("burned");
  });
}


// Initialisation au chargement de la page
window.addEventListener("DOMContentLoaded", async () => {
  const characters = await fetchCharacters();
  showList(characters);
});