const play =document.getElementById("play")

play.addEventListener("click",(e)=> {
    e.preventDefault();

    const nameval=document.getElementById("nickname").value
    const namevalue= document.getElementById("name").value

    console.log(nameval.length,namevalue)

    if(nameval.length===0 || namevalue.length===0){
        alert("Please enter your name and nickname")
    }
    else{
        localStorage.setItem("nickname",nameval)
        window.location.href="./index.html"
    }
});
