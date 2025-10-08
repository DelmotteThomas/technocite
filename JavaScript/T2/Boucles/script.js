const prenoms = ["Alice","Bob","Charlie","Dianne"];

document.getElementById("show").addEventListener("click", ()=>{
    const ul = document.getElementById("list");
        ul.innerHTML ="" // vider la liste
    prenoms.forEach((prenom)=>{
        const li = document.createElement("li");
        li.textContent = prenom;
        ul.appendChild(li);
    } );
});

//prenoms.forEach(n=> console.log(n));
// Affiche en console tous les prénoms de la liste

