// Fonction 

function addition(x,y){
    return x+y;
}

const soustraction = (x,y)=> {
    return x-y;
}

const multiplication = (x,y)=> x*y;

const division = (x,y)=> (y !== 0 ? x/y : "Erreur (division par 0");

// Récupération des données
const a = document.getElementById('a');
const b = document.getElementById('b');
const res = document.getElementById('res');

// Gestion des clics

document.getElementById("add").onclick = () =>
(res.textContent = addition(parseInt(a.value),parseInt(b.value)));

//Méthode : Opérateur
//Méthode : parseInt()
document.getElementById("sub").onclick = () =>
(res.textContent = soustraction(parseInt(a.value),parseInt(b.value))); 
//Méthode : parseFloat()
document.getElementById("mul").onclick = () =>
(res.textContent = multiplication(parseFloat(a.value),parseFloat(b.value)));
//Méthode : Number()
document.getElementById('div').onclick=() =>
(res.textContent = division(Number(a.value), Number(b.value)));
