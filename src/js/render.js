import { calculerTableauBord } from "./calculations.js";

const totalDuElement = document.getElementById("total-du");
const nbClientsElement = document.getElementById("nb-clients");
const nbEnDetteElement = document.getElementById("nb-en-dette");
const nbEnRetardElement = document.getElementById("nb-en-retard");

export function afficherTableauBord(clients, operations) {
    const stats = calculerTableauBord(clients, operations);

    totalDuElement.textContent = (stats.totalDu / 100).toFixed(2) + " MAD";
    nbClientsElement.textContent = stats.nbClients;
    nbEnDetteElement.textContent = stats.nbEnDette;
    nbEnRetardElement.textContent = stats.nbEnRetard;
}


