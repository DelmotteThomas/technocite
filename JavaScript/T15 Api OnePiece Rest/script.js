const apiBase = "https://api.api-onepiece.com/v2";

function toNumber(value) {
  if (typeof value !== "string") return Number(value);
  const cleaned = value.replace(/\./g, ""); // supprime tous les points
  return Number(cleaned);
}

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

async function fetchCharacters() {
  try{
    const url = `${apiBase}/characters/en`
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
    const data = await res.json();

    return data; // on retourne les personnages
  } catch (error) {
    showError(error);
    console.error(error);
    return [];
  }
}


function showList(characters) {
  const container = document.getElementById("characters");
  container.innerHTML = "";
  if (!characters.length) {
    container.innerHTML =
      "<p class='text-gray-500 text-center'>Aucun personnage trouvé 😔</p>";
    return;
  }
  
  characters.forEach((c) => {
    const card = document.createElement("div");
  card.className =
      "w-full bg-white rounded-lg shadow p-4 cursor-pointer hover:scale-105 transition-transform text-center";

    card.innerHTML = `
      
      <h3 class="text-white font-bold text-lg">${c.name}</h3>
      <p class="text-gray-200 text-sm">${c.crew?.name || "Crew inconnu"}</p>
      <p class="text-grey-500 text-xl">${c.bounty || "0" }</p>
      <p class="text-grey-500 text-sm">${c.fruit?.name || "Aucun fruit du demon" }</p>

    `;
    boutnyNumber = toNumber(c.bounty);
    if(boutnyNumber >= 300000000){
        card.style.backgroundColor = '#d62332ff'; // Couleur rouge pour les primes > 3 milliards
        card.style.fontColor = 'white';
    } else{
        card.style.backgroundColor = '#dfd8b0ff'; // Couleur jaune pour les primes > 3 milliards
    }
    
    container.appendChild(card);
  });
}

// 🔹 Récupération des personnages d’un équipage
async function fetchCrewMembers(crewId) {
  try {
    const url = `${apiBase}/characters/fr/crew/${crewId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
    const data = await res.json();
    console.log("✅ Personnages récupérés :", data);
    return data;
  } catch (error) {
    showError(error);
    console.error(error);
    return [];
  }
}
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const characters = await fetchCharacters();

    showList(characters);
    } catch (error) {
    showError(error);
    }
});
