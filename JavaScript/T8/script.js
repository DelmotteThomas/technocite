const voitures = [
  { marque: "Tesla", modele: "Model 3", carburant: "Électrique", annee: 2023, couleur: "Blanc nacré", prix: 45900 },
  { marque: "BMW", modele: "320d", carburant: "Diesel", annee: 2019, couleur: "Noir métallisé", prix: 32900 },
  { marque: "Audi", modele: "A4", carburant: "Essence", annee: 2020, couleur: "Gris argent", prix: 33900 },
  { marque: "Mercedes-Benz", modele: "C200", carburant: "Hybride", annee: 2022, couleur: "Bleu nuit", prix: 41900 },
  { marque: "Peugeot", modele: "208", carburant: "Essence", annee: 2021, couleur: "Jaune Faro", prix: 19900 },
  { marque: "Volkswagen", modele: "Golf 8", carburant: "Diesel", annee: 2020, couleur: "Rouge Tornado", prix: 23900 },
  { marque: "Renault", modele: "Clio V", carburant: "Essence", annee: 2019, couleur: "Orange Valencia", prix: 16900 },
  { marque: "Toyota", modele: "Yaris Hybrid", carburant: "Hybride", annee: 2023, couleur: "Bleu Électrique", prix: 23900 },
  { marque: "Ford", modele: "Focus", carburant: "Essence", annee: 2018, couleur: "Gris magnétique", prix: 15400 },
  { marque: "Opel", modele: "Corsa-e", carburant: "Électrique", annee: 2021, couleur: "Jaune Power", prix: 24900 },
  { marque: "Volvo", modele: "XC40 Recharge", carburant: "Électrique", annee: 2024, couleur: "Blanc glacier", prix: 51900 },
  { marque: "Kia", modele: "Sportage", carburant: "Hybride", annee: 2022, couleur: "Vert camouflage", prix: 29900 },
  { marque: "Hyundai", modele: "Ioniq 5", carburant: "Électrique", annee: 2023, couleur: "Gris cyber", prix: 45900 },
  { marque: "Fiat", modele: "500e", carburant: "Électrique", annee: 2022, couleur: "Rose gold", prix: 26900 },
  { marque: "Nissan", modele: "Qashqai", carburant: "Essence", annee: 2021, couleur: "Bleu céramique", prix: 28900 },
  { marque: "Mazda", modele: "CX-30", carburant: "Essence", annee: 2020, couleur: "Rouge Soul", prix: 25900 },
  { marque: "Skoda", modele: "Octavia", carburant: "Diesel", annee: 2019, couleur: "Blanc lunaire", prix: 21900 },
  { marque: "Citroën", modele: "C5 Aircross", carburant: "Hybride", annee: 2022, couleur: "Gris platinium", prix: 30900 },
  { marque: "Seat", modele: "Leon", carburant: "Essence", annee: 2020, couleur: "Rouge désir", prix: 22900 },
  { marque: "Dacia", modele: "Spring", carburant: "Électrique", annee: 2023, couleur: "Gris pierre", prix: 16900 }
];



function clearList() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  return ul;
}

function showCars() {
  const ul = clearList();
  voitures.forEach(voiture => {
    const li = document.createElement("li");
    li.textContent = `Marque : ${voiture.marque}, Modèle : ${voiture.modele}`;
    ul.appendChild(li);
  });
}

document.getElementById("showCars").addEventListener("click", showCars);


// // 1 Affichage Marques + Modèles
// document.getElementById("showCars").addEventListener("click", ()=>{
//     const ul = document.getElementById("list");
//         ul.innerHTML ="" // vider la liste
//     voitures.forEach((voitures)=>{
//         const li = document.createElement("li");
//         li.textContent = `Marques : ${voitures.marque}, Modèles : ${voitures.modele};`
//         ul.appendChild(li);
//     } );
//     });

// 2 Affichage uniquement des electirques.
document.getElementById("isElec").addEventListener("click",()=> {
    const ul = document.getElementById("list");
    ul.innerHTML =""; // vider la liste
    voitures.forEach((voiture)=>{
        if(voiture.carburant=="Électrique"){
            const li = document.createElement("li");
            li.textContent = voiture.marque;
            ul.appendChild(li);   
        }
    });
});

// 3 Voitures la plus chers !

document.getElementById("moreExpensive").addEventListener("click",()=> {
    const ul = document.getElementById('list');
    ul.innerHTML =""; // vider
     // On part de la première voiture comme référence
    let moreExpensiveCar = [0];

    voitures.forEach((voiture)=>{
        if( moreExpensiveCar == 0 || voiture.prix > moreExpensiveCar.prix){
            moreExpensiveCar = voiture;
        }
    });
    const li = document.createElement("li");
        li.textContent = `${moreExpensiveCar.marque} ${moreExpensiveCar.modele} - ${moreExpensiveCar.prix} €`;
        ul.appendChild(li);
    });

// 4.Moyenne des voitures

document.getElementById("moy").addEventListener("click",()=> {
    const ul = document.getElementById("list");
    ul.innerHTML = ""; // vider

    // Addition les voitures

    let total = 0;
    voitures.forEach((voiture) => {
    total += voiture.prix;
    });

    // moyenne avec length
    
    const moyenne = total / voitures.length;
    // Afficher 
    const li = document.createElement("li");
    li.textContent = `Prix moyen des voitures : ${moyenne} €`;
    ul.appendChild(li);
    });

//5.Afficher les voitures récentes

document.getElementById('recentCar').addEventListener("click",()=> {
    const ul = document.getElementById("list");
    ul.innerHTML ="";
    // on part de la 1er voitures comme ref
    let mostRecentCar = voitures[0];
    voitures.forEach((voiture)=>{
        if (voiture.annee > mostRecentCar.annee){
            mostRecentCar = voiture;
        }
    });
    const li = document.createElement('li');
    li.textContent =`${mostRecentCar.marque} ${mostRecentCar.modele} - sortie en ${mostRecentCar.annee}`;
     ul.appendChild(li);
});

// Trier les voitures par ordre croissant

document.getElementById("sortAsc").addEventListener("click", () => {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  // copie triée pour ne pas modifier l'original
  const sorted = [...voitures].sort((a, b) => a.prix - b.prix);

  sorted.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `${v.marque} ${v.modele} - ${v.prix} €`;
    ul.appendChild(li);
  });
});