import { operations } from "./state.js";
import { creerDemo } from "./demo.js";

const demo = creerDemo();
const clientId = demo.clients[4].id;






const formOperation = document.getElementById("form-operation");
const dateOperation = document.getElementById("operation-date");
const inputMontant = document.getElementById("operation-montant");
const operationmontanterreur = document.getElementById("operation-montant-erreur");
const operationdateerreur = document.getElementById("operation-date-erreur");
const inputlibelle = document.getElementById("operation-libelle");
const operationlibelleerreur = document.getElementById("operation-libelle-erreur");


const ficheclient = document.getElementById("fiche-client")
const fichenom = document.getElementById("fiche-nom")
const fichetelephone = document.getElementById("fiche-telephone")
const fichebadges = document.getElementById("fiche-badges")

const fichesolde = document.getElementById("fiche-solde")
const ficheplafond = document.getElementById("fiche-plafond")
const fichedisponible = document.getElementById("fiche-disponible")
const titrehistorique = document.getElementById("titre-historique")
const historiquevide = document.getElementById("historique-vide")
const historique =document.getElementById("historique")
const modeleOperation = document.getElementById("modele-operation")



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


    const libelleValide  = valideLibelle();
    if(libelleValide){
        operationlibelleerreur.classList.add("hidden")
        operationlibelleerreur.textContent="";
        }else{
            operationlibelleerreur.textContent="libelle Invalide";
            operationlibelleerreur.classList.remove("hidden")

        }



    if (!validemontant || !valideDate || !libelleValide  ) {
    return;
}


const montantCentimes = convertCentime()


const typeOperation = formOperation.querySelector('input[name="operation-type"]:checked').value;
const libelle = inputlibelle.value.trim();
const date = dateOperation.value;

const Operation = creerOperation (clientId,typeOperation,montantCentimes,libelle,date) 
operations.push(Operation);
afficherOperation(Operation);
actualiserFiche();
formOperation.reset();
initialiserDateOperation();
historiquevide.classList.add("hidden");
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


function valideLibelle(){
    const libelle = inputlibelle.value.trim();
    if(libelle ===""){
        return false
    }
    return true
}


function convertCentime(){
    const valeur = inputMontant.value.trim();
    const  valeurNormalisee = valeur.replace(",", ".");
    const nombre = Number(valeurNormalisee)

    const centime = Math.round(nombre * 100);
    return centime;
}


function creerOperation(clientId, typeOperation, montantCentimes, libelle, date){
    const id = crypto.randomUUID();

    const Operation = {
        id,
        clientId  ,
        type : typeOperation ,
        montant : montantCentimes,
        libelle : libelle,
        date : date
    };
    return Operation
}



export function afficherOperation(operation) {
    const copie = modeleOperation.content.cloneNode(true);
    const ligne = copie.querySelector("li");
    ligne.dataset.operationId = operation.id;

    const elementLibelle = ligne.querySelector(".operation-libelle");
    elementLibelle.textContent= operation.libelle;

    const elementDate = ligne.querySelector(".operation-date");
    elementDate.textContent=operation.date;

    const elementMontant = ligne.querySelector(".operation-montant")
    elementMontant.textContent=(operation.montant / 100 ).toFixed(2)+" DH ";

    if (operation.type === "achat"){
        ligne.classList.add("operation-achat");
    }else{
        ligne.classList.add("operation-remboursement");
    }

    historique.appendChild(copie)

}






const plafond = demo.clients.find((client) =>{
    if(client.id === clientId){
        return client
    }
}

)

let plaf = plafond.plafond;






function actualiserFiche() {
    let newopera = [...demo.operations, ...operations];

    const operaClient = newopera.filter((operation) => {
        return operation.clientId === clientId;
    });


    let totalAchats=0;
    let totalRemboursements=0;
    operaClient.forEach((operation) => {
        if(operation.type ===  "achat"){
            totalAchats+=operation.montant;
        }else{
            totalRemboursements+=operation.montant;
        }
});

    let solde = totalAchats - totalRemboursements;
    fichesolde.textContent = (solde / 100).toFixed(2) + " DH";
    ficheplafond.textContent = (plaf / 100).toFixed(2) + " DH";

    let creditDispo = (plaf - solde) / 100;
    fichedisponible.textContent = creditDispo.toFixed(2) + " DH";


}
actualiserFiche();