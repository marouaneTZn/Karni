import { operations } from "./state.js";
import { creerDemo } from "./demo.js";

const demo = creerDemo();
const clientId = demo.clients[0].id;







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

const notification = document.getElementById("notification"); 

const dialogconfirmation = document.getElementById("dialog-confirmation");
const confirmationtitre = document.getElementById("confirmation-titre");
const confirmationmessage = document.getElementById("confirmation-message");
const confirmationdetails = document.getElementById("confirmation-details");
const confirmationvalider = document.getElementById("confirmation-valider");
const fichefermer = document.getElementById("fiche-fermer");



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
const { solde, creditdisponible } = actualiserFiche();

const libelle = inputlibelle.value.trim();
const date = dateOperation.value;

notification.textContent = "";
if (!verifierOperation(typeOperation, montantCentimes, solde, creditdisponible)) {
    return;
}

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

    ligne.querySelector(".operation-libelle").textContent = operation.libelle;
    ligne.querySelector(".operation-date").textContent = operation.date;
    ligne.querySelector(".operation-montant").textContent = (operation.montant / 100).toFixed(2) + " DH";

    if (operation.type === "achat") {
        ligne.classList.add("operation-achat");
    } else {
        ligne.classList.add("operation-remboursement");
    }

    historique.appendChild(copie);

    const lignes = Array.from(historique.children);

    lignes.sort(function(a, b) {
        const dateA = a.querySelector(".operation-date").textContent;
        const dateB = b.querySelector(".operation-date").textContent;

        return dateB.localeCompare(dateA);
    });

    lignes.forEach(function(ligne) {
        historique.appendChild(ligne);
    });
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

    return {
        solde,
        creditdisponible:creditDispo
    }
    

}
actualiserFiche();


function verifierOperation(typeOperation,montantCentimes,solde,creditdisponible){

    if( typeOperation === "achat" && montantCentimes/100 > creditdisponible){
    notification.textContent = `Erreur : le montant dépasse le crédit disponible (${creditdisponible.toFixed(2)} DH).`;
    return false
    }
    if(typeOperation ==="remboursement" && montantCentimes/100 > solde/100){
        notification.textContent = `Erreur : le remboursement depasse le solde actuel (${(solde / 100).toFixed(2)} DH).`;
            return false
    }
    return true
}

    let operationId  ;
historique.addEventListener("click",function(e){
    if(e.target.matches('[data-action="supprimer-operation"]')){
        const ligne= e.target.closest("li")
        operationId = ligne.dataset.operationId;   
        const resultat = operations.find(function(operation) {
        return operation.id === operationId ;
        
        
}); 
    confirmationtitre.textContent="Confirmer la suppression"
    confirmationmessage.textContent = "Êtes-vous sûr de vouloir supprimer cette opération ?";
    confirmationdetails.textContent=resultat.libelle+", "+resultat.montant/100 +" DH"
    dialogconfirmation.showModal();
    }
    

})

confirmationvalider.addEventListener("click",function(e){
const resultat = operations.findIndex(function(operation){
return operation.id === operationId;
})
if(resultat>=0){
    operations.splice(resultat, 1);
    const ligne = historique.querySelector(`[data-operation-id="${operationId}"]`);
    ligne.remove();
    actualiserFiche();
    
}

})

fichefermer.addEventListener("click", function() {
    ficheclient.close();
});

