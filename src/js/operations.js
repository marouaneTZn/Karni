const dateOperation = document.getElementById("operation-date");
const formOperation = document.getElementById("form-operation");
const inputMontant = document.getElementById("operation-montant");
const operationmontanterreur = document.getElementById("operation-montant-erreur");
const operationdateerreur = document.getElementById("operation-date-erreur");


function initialiserDateOperation(){
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const monthFormat = String(month).padStart(2, "0");
const dayFormat = String(day).padStart(2, "0");

const fulldate = year +"-"+monthFormat+"-"+dayFormat

dateOperation.value = fulldate;
dateOperation.max = fulldate;

console.log(fulldate)
}
initialiserDateOperation();

formOperation.addEventListener("submit",function(e){
    e.preventDefault();
    const validemontant = validerMontant()
    if(validemontant){
        operationmontanterreur.classList.add("hidden");
        operationmontanterreur.textContent=""
    }else{
        operationmontanterreur.textContent = "Montant Invalide";
        operationmontanterreur.classList.remove("hidden");
    }
    const valideDate = validerDate();
    if(valideDate){
        operationdateerreur.classList.add("hidden");
        operationdateerreur.textContent="";
    }else{
        operationdateerreur.textContent="Date Invalide";
        operationdateerreur.classList.remove("hidden")
    }

    if (!validemontant || !valideDate) {
    return;
}
})


function validerMontant(){
    const regexMontant = /^\d+([.,]\d{1,2})?$/;
    const valeur = inputMontant.value.trim();
    const  valeurNormalisee = valeur.replace(",", ".");

    if (!regexMontant.test(valeur)) {
        return false;
    }

        const montant = Number(valeurNormalisee);


    if(montant>=0.01 && montant<=10000){
        return true
    }
    return false
}




function validerDate(){
    let dateSaisie = dateOperation.value;
    let fulldate = dateOperation.max ;
    if(dateSaisie === ""){
        return false
    }else if(dateSaisie > fulldate ){
        return false
    }
    return true
}




