const button = document.getElementById("Location");
const b = document.getElementById("divo");
// async function gotLocation(position){
//     console.log(position);
// }
function failedToGet(){
    console.log("Some issue");
}
button.addEventListener('click',async()=>{
    // navigator.geolocation.getCurrentPosition(gotLocation,failedToGet);
    b.style.display='flex';
});