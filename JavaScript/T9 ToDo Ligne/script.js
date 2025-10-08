const todos = [
  { id: 1, titre: "Acheter du pain", description: "Aller à la boulangerie avant 18h", termine: false, dateFin: "2025-10-06" },
  { id: 2, titre: "Envoyer un e-mail à Jean", description: "Répondre au sujet du projet web", termine: true, dateFin: "2025-10-05" },
  { id: 3, titre: "Faire du sport", description: "30 minutes de course à pied", termine: false, dateFin: "2025-10-07" },
  { id: 4, titre: "Payer la facture d’électricité", description: "Avant le 10 octobre", termine: false, dateFin: "2025-10-10" },
  { id: 5, titre: "Nettoyer la voiture", description: "Laver l’extérieur et passer l’aspirateur", termine: true, dateFin: "2025-10-03" },
  { id: 6, titre: "Réviser le cours de JavaScript", description: "Relire les boucles et fonctions", termine: false, dateFin: "2025-10-08" },
  { id: 7, titre: "Appeler maman", description: "Demander des nouvelles et fixer un repas", termine: false, dateFin: "2025-10-06" },
  { id: 8, titre: "Préparer la présentation", description: "Slides pour la réunion de lundi", termine: true, dateFin: "2025-10-05" },
  { id: 9, titre: "Faire les courses", description: "Lait, œufs, fruits, légumes", termine: false, dateFin: "2025-10-09" },
  { id: 10, titre: "Planifier le week-end", description: "Choisir une destination et réserver", termine: false, dateFin: "2025-10-11" }
];


// --- Fonctions ---

function clearList() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  return ul;
}

function showList() {
  const ul = clearList();
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "p-2 my-1 border rounded bg-gray-100 flex justify-between items-center";

    const status = todo.termine ? "✅ Fait" : "⏳ À faire";
    const span = document.createElement("span");
    span.textContent = `Tâche : ${todo.titre} | Note : ${todo.description} | Statut : ${status} | Échéance : ${todo.dateFin}`;

    const btn = document.createElement("button");
    btn.textContent = todo.termine ? "Refaire ❌" : "Valider ✅";
    btn.className = "ml-4 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600";
    btn.addEventListener("click", () => {
      todo.termine = !todo.termine;
      showList();
    });
    // on passe le span au li ( lecture de droite a gauche)
    li.appendChild(span);
    // on passe le btn au li
    li.appendChild(btn);
    // on passe le li au ul
    ul.appendChild(li);
  });
}


function showToDo() {
  const ul = clearList();
  todos.forEach((todo) => {
    if (!todo.termine) { // Affiche les choses à faire si pas terminée
      const li = document.createElement("li");
      li.className = "p-2 my-1 border rounded bg-red-100 flex justify-between items-center";

      const status = "⏳ À faire";
      const span = document.createElement("span");
      span.textContent = `Tâche : ${todo.titre} | Note : ${todo.description} | Statut : ${status} | Échéance : ${todo.dateFin}`;

      // Bouton toggle
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.className = "ml-4 px-2 py-1 rounded bg-red-50 hover:bg-red-600";
      btn.addEventListener("click", () => {
        todo.termine = true; 
        showToDo();            // réaffiche seulement les "à faire"
      });

      li.appendChild(span);
      li.appendChild(btn);
      ul.appendChild(li);
    }
  });
}




// Liste d'evenement 

document.getElementById("showList").addEventListener("click", showList);
document.getElementById("showToDo").addEventListener("click", showToDo);