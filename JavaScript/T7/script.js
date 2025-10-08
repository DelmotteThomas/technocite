// Selection des elements du DOM
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let scoreCount = document.querySelector(".gameInfoValue");
let timeCount = document.querySelector(".gameTimeValue");
let bestScore = document.querySelector(".bestScoreValue");

// Display the best score from the local storage

bestScore.innerHTML = localStorage.getItem("bestScore") || 0;

// Evenement au click sur le bouton
btn.addEventListener("click", function (){
    let score = 0;
    let time = 10;
    container.innerHTML = "";

// Va permettre de créer une cible tts les secondes et de la supprimer au bout de 2 secondes
let interval = setInterval(()=>{
    let target = document.createElement("img");
    target.classList.add("target");
    target.src = "target.png";
    container.appendChild(target);
    target.style.top = Math.random() * (500 - target.offsetHeight) + "px"; // on positionne la cible alé sur Y
    target.style.left = Math.random() * (600 - target.offsetWidth) + "px"; // sur l'axe X

    setTimeout(()=>{ // on supprimer la cible au bout de 2sec
        target.remove();
},2000); // 2000 = 2sec

target.addEventListener("click", function (){
    score++;
    target.remove();
    scoreCount.innerHTML = score ;
});

time -= 1 ; // On décremente le temps de 1sec
timeCount.innerHTML = time;

// quand le temps est écoulé on arrête le jeu

if (time === 0){
    clearInterval(interval);
    container.innerHTML = `End of the game | Score: ${score}` ;

    if(
        score > localStorage.getItem("bestScore") ||
        localStorage.getItem("bestScore") === null
    ){
        saveBestScore(score);
    }
    }
},1000);

});

// On sauve le meilleur score 

const saveBestScore = (score) => {
    localStorage.setItem("bestScore",score);
    bestScore.textContent = score;
}