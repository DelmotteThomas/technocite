let allUsers = []; // Variable pour stocker tous les utilisateurs

const afficherUtilisateur = (u) => {
  // On crée une fonction pour afficher les utilisateurs
  const li = document.createElement("li"); // On crée un élément li
  li.className = "p-4 hover:bg-gray-50 transition duration-200"; // On ajoute les classes Tailwind
  
  li.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            ${u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-lg">${u.name}</h3>
            <p class="text-gray-600 text-sm">@${u.username}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          <p><span class="font-medium">📧 Email:</span> ${u.email}</p>
          <p><span class="font-medium">🏠 Ville:</span> ${u.address.city}</p>
          <p><span class="font-medium">📍 Adresse:</span> ${u.address.street}, ${u.address.suite}</p>
          <p><span class="font-medium">📮 Code postal:</span> ${u.address.zipcode}</p>
        </div>
      </div>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Lat: ${u.address.geo.lat} | Lng: ${u.address.geo.lng}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("users").appendChild(li); // On ajoute l'élément li à l'élément ul
};
document.getElementById("load").onclick = async () => {
  // On crée une fonction pour charger les utilisateurs
  const ul = document.getElementById("users");
  ul.innerHTML = "";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users"); // On fetch les utilisateurs
    console.log(res);
    if (!res.ok) throw new Error("HTTP " + res.status); // Si la réponse n'est pas ok, on throw une erreur
    const data = await res.json(); // On récupère les données
    allUsers = data; // On stocke tous les utilisateurs
    data.forEach(afficherUtilisateur); // On affiche les utilisateurs
  } catch (e) {
    afficherErreur(e); // On affiche l'erreur
  }
};
const afficherErreur = (e) => {
  const li = document.createElement("li"); // On crée un élément li
  li.className = "p-4 bg-red-50 border-l-4 border-red-400"; // On ajoute les classes Tailwind pour l'erreur
  
  li.innerHTML = `
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-red-600 text-sm">⚠️</span>
        </div>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">Erreur de chargement</h3>
        <p class="text-sm text-red-600">${e.message}</p>
      </div>
    </div>
  `;
  
  document.getElementById("users").appendChild(li); // On ajoute l'élément li à l'élément ul
};

const afficherMessageAucunResultat = () => {
  const li = document.createElement("li");
  li.className = "p-8 text-center";
  li.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span class="text-gray-400 text-2xl">🔍</span>
      </div>
      <h3 class="text-lg font-medium text-gray-600 mb-2">Aucun utilisateur trouvé</h3>
      <p class="text-gray-500">Essayez avec un autre terme de recherche</p>
    </div>
  `;
  document.getElementById("users").appendChild(li);
};

const filtrerUtilisateurs = (terme) => {
  // Fonction pour filtrer les utilisateurs selon le terme de recherche
  const ul = document.getElementById("users");
  ul.innerHTML = ""; // On vide la liste
  
  const utilisateursFiltres = allUsers.filter(user => {
    // On cherche dans le nom, email, username et ville
    const recherche = terme.toLowerCase();
    return user.name.toLowerCase().includes(recherche) ||
           user.email.toLowerCase().includes(recherche) ||
           user.address.city.toLowerCase().includes(recherche);

  });
  
  if (utilisateursFiltres.length === 0) {
    afficherMessageAucunResultat(); // On affiche un message si aucun résultat
  } else {
    utilisateursFiltres.forEach(afficherUtilisateur); // On affiche les utilisateurs filtrés
  }
};

const afficherTousUtilisateurs = () => {
  // Fonction pour afficher tous les utilisateurs
  const ul = document.getElementById("users");
  ul.innerHTML = ""; // On vide la liste
  allUsers.forEach(afficherUtilisateur); // On affiche tous les utilisateurs
};



// Événement pour la recherche en temps réel
document.getElementById("search").addEventListener("input", (e) => {
  const terme = e.target.value.trim();
  if (terme === "") {
    afficherTousUtilisateurs(); // Si le champ est vide, on affiche tous les utilisateurs
  } else {
    filtrerUtilisateurs(terme); // Sinon on filtre
  }
});
