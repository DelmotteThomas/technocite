   // --- Données ---
    const todos = [
      { id: 1, titre: "Acheter du pain", description: "Aller à la boulangerie avant 18h", termine: false, dateFin: "2025-10-06" },
      { id: 2, titre: "Envoyer un e-mail à Jean", description: "Répondre au sujet du projet web", termine: true,  dateFin: "2025-10-05" },
      { id: 3, titre: "Faire du sport", description: "30 minutes de course à pied", termine: false, dateFin: "2025-10-07" },
      { id: 4, titre: "Payer la facture d’électricité", description: "Avant le 10 octobre", termine: false, dateFin: "2025-10-10" },
      { id: 5, titre: "Nettoyer la voiture", description: "Laver l’extérieur et passer l’aspirateur", termine: true,  dateFin: "2025-10-03" },
      { id: 6, titre: "Réviser le cours de JavaScript", description: "Relire les boucles et fonctions", termine: false, dateFin: "2025-10-08" },
      { id: 7, titre: "Appeler maman", description: "Demander des nouvelles et fixer un repas", termine: false, dateFin: "2025-10-06" },
      { id: 8, titre: "Préparer la présentation", description: "Slides pour la réunion de lundi", termine: true,  dateFin: "2025-10-05" },
      { id: 9, titre: "Faire les courses", description: "Lait, œufs, fruits, légumes", termine: false, dateFin: "2025-10-09" },
      { id: 10, titre: "Planifier le week-end", description: "Choisir une destination et réserver", termine: false, dateFin: "2025-10-11" }
    ];

    function mountTable(rows) {
      const container = document.getElementById("list");
      container.innerHTML = ""; // vider le container

      const table = document.createElement("table");
      table.className = "min-w-full border border-gray-300 text-sm";

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr class="bg-gray-100">
          <th class="border px-3 py-2 text-center">Tâche</th>
          <th class="border px-3 py-2 text-center">Description</th>
          <th class="border px-3 py-2 text-center">Statut</th>
          <th class="border px-3 py-2 text-center">Échéance</th>
          <th class="border px-3 py-2 text-center">Action</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      rows.forEach(todo => {
        const tr = document.createElement("tr");

        const tdTitre = document.createElement("td");
        tdTitre.className = "border px-3 py-2 text-center";
        tdTitre.textContent = todo.titre;

        const tdDesc = document.createElement("td");
        tdDesc.className = "border px-3 py-2 text-center";
        tdDesc.textContent = todo.description;

        const tdStatut = document.createElement("td");
        tdStatut.className = "border px-3 py-2 text-center";
        tdStatut.textContent = todo.termine ? "✅" : "❌";

        const tdDate = document.createElement("td");
        tdDate.className = "border px-3 py-2";
        tdDate.textContent = todo.dateFin;

        const tdAction = document.createElement("td");
        tdAction.className = "border px-3 py-2 text-right";
        const btn = document.createElement("button");
        btn.className = "px-2 py-1 rounded text-white " + (todo.termine ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700");
        btn.textContent = todo.termine ? "Revenir à faire" : "Marquer fait";
        btn.addEventListener("click", () => {
          todo.termine = !todo.termine;   // toggle
          // On rappelle le dernier filtre actif pour garder la vue
          lastRender();
        });
        tdAction.appendChild(btn);

        tr.appendChild(tdTitre);
        tr.appendChild(tdDesc);
        tr.appendChild(tdStatut);
        tr.appendChild(tdDate);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    }

    // --- Vues ---
    function showAll() {
      mountTable(todos);
      lastRender = showAll;
    }
    function showToDo() {
      mountTable(todos.filter(t => !t.termine));
      lastRender = showToDo;
    }
    function showDone() {
      mountTable(todos.filter(t => t.termine));
      lastRender = showDone;
    }

    // mémorise la dernière vue pour refresh après toggle
    let lastRender = showAll;

    // --- Bind après que le DOM soit prêt ---
    window.addEventListener("DOMContentLoaded", () => {
      document.getElementById("showList").addEventListener("click", showAll);
      document.getElementById("showToDo").addEventListener("click", showToDo);
      document.getElementById("showDone").addEventListener("click", showDone);

      // rendu initial
      showAll();
    });