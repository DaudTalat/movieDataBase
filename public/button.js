
console.log("Test");


let bs = document.getElementsByClassName("removeReview")

console.log(bs);

for(let i = 0; i < bs.length;i++){
    bs[i].addEventListener("click",sendReviewDelete,false);
}



function sendReviewDelete(){
    let req = new XMLHttpRequest();
    let id = this.id
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log("ok!");
            console.log(this.response);
            getProfile();
        }
    }

    req.open("DELETE", "//localhost:3000/reviews/"+id, true);
    req.send();

}

function getProfile(){
    let getProfile = new XMLHttpRequest();
            
    getProfile.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            updateDisplay(this.response);
        }
    }
    getProfile.open("GET","//localhost:3000/users/profile", true);
    getProfile.send();
}


function updateDisplay(data){
    document.documentElement.innerHTML = "";
    document.documentElement.innerHTML = data;
    console.log("Updated Data");
}