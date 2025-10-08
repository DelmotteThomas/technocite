const isPair = (n) => n % 2 === 0;

document.getElementById("test").onclick=()=>{
    const n = Number(document.getElementById("val").value);
    document.getElementById("res").textContent = isPair(n) ? "Pair" : "Impair";
};