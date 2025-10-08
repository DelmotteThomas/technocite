const personnes = [
    {nom: "Alice", age:25, ville:"Paris"},
    {nom: "Bob", age:17, ville:"Lille"},
    {nom: "Charlies", age:30, ville:"Bordeau"},
    {nom: "Diane", age:16, ville:"Dijon"},
    {nom: "Jean", age:45, ville:"Nantes"}
];

document.getElementById("showSimple").addEventListener("click", ()=>{
    const ul = document.getElementById("list");
        ul.innerHTML ="" // vider la liste
    personnes.forEach((personnes)=>{
        const li = document.createElement("li");
        li.textContent = personnes.nom;
        ul.appendChild(li);
    } );
    });

 // Affichage détaillé - Toutes les infos

document.getElementById("showDetailed").addEventListener("click", () => {
    const ul = document.getElementById("list");
    ul.innerHTML =""; // vider la liste

    personnes.forEach((personnes) => {
        const li = document.createElement("li");
        li.className ="personne";
        li.innerHTML = `
                <span class="nom"> ${personnes.nom}
                <span class="age"> ${personnes.age}
                <span class="ville"> ${personnes.ville}
        `;
        ul.appendChild(li);
    });
});

document.getElementById("showFiltered").addEventListener("click", ()=>{
    const ul= document.getElementById("list");
    ul.innerHTML ="";

    personnes.forEach((personnes) => {
        if(personnes.age >=18){
            const li = document.createElement("li");
            li.className = "personne";
             li.innerHTML = `
                <span class="nom"> ${personnes.nom}
                <span class="age"> ${personnes.age}
                <span class="ville"> ${personnes.ville}
        `;
        ul.appendChild(li);
        }
    })
})
