

document.getElementById("gen").onclick = ()=>
{
    const n = Number(document.getElementById('max').value);
    const res = forpair(n);
document.getElementById('out').textContent = res.join(", ");
};

const forpair =(n) => {
    let res = [];
    for (let i=0 ; i< n; i++){
        if (i%2===0) res.push(i);
    }
    return res;
};





