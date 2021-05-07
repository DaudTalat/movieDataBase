
console.log("Test");

document.getElementsByClassName("removeReview").addEventListener("click",sendReviewDelete)


function sendReviewDelete(){
    console.log(this);
    console.log("text");
}