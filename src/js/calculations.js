import { creerDemo } from "./demo.js";

const totalDuElement = document.getElementById("total-du");
const nbClientsElement = document.getElementById("nb-clients");
const nbEnDetteElement = document.getElementById("nb-en-dette");
const nbEnRetardElement = document.getElementById("nb-en-retard");

const data = creerDemo();

export function calculerSolde(clientId, operations) {
    const operationsClient = operations.filter((operation) => {
        return operation.clientId === clientId;
    });

    const solde = operationsClient.reduce((total, operation) => {
        if (operation.type === "achat") {
            return total + operation.montant;
        }

        if (operation.type === "remboursement") {
            return total - operation.montant;
        }

        return total;
    }, 0);

    return solde;
}

export function calculerStatut(clientId, operations) {
    const solde = calculerSolde(clientId, operations);

    const remboursements = operations.filter((operation) => {
        return operation.clientId === clientId &&
               operation.type === "remboursement";
    });

    const dernierRemboursement = remboursements.sort((a, b) => {
        return b.date.localeCompare(a.date);
    })[0];

    const achats = operations.filter((operation) => {
        return operation.clientId === clientId &&
               operation.type === "achat";
    });

    const premierAchat = achats.sort((a, b) => {
        return a.date.localeCompare(b.date);
    })[0];

    let dateReference;

    if (dernierRemboursement) {
        dateReference = dernierRemboursement.date;
    } else {
        dateReference = premierAchat?.date;
    }

    console.log("Date de référence:", dateReference);

    let nombreJours = 0;

    if (dateReference) {
        const aujourdHui = new Date();
        const dateOperation = new Date(dateReference);

        const difference = aujourdHui - dateOperation;

        nombreJours = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );
    }



    if (solde === 0) {
        return "À jour";
    }

    else if (solde > 0 && nombreJours > 30){
        return "En retard"
    }
    
    else if (solde > 0) {
        return "En dette";
    }
}

export function plafondAtteint(client, operations) {
    const solde = calculerSolde(client.id, operations);
    return solde >= client.plafond;
}

const client = data.clients.find((client) => {
    return client.id === "c-demo-4";
});


export function calculerTableauBord(clients, operations) {
    const nbClients = clients.length


    const  clientEnDette = clients.filter((client) => {
        return calculerSolde(client.id, operations) 
    })
    const nbEnDette = clientEnDette.length

    const clientsEnRetard = clients.filter((client) => {
        return calculerStatut(client.id, operations) === "En retard"
    })
    const nbEnRetard = clientsEnRetard.length

    const totalDu = clients.reduce((total, client) => {
        return total + calculerSolde(client.id, operations)
    },0)
    
    return {
        nbClients,
        nbEnDette,
        nbEnRetard,
        totalDu
    } 
}





console.log("Solde:", calculerSolde(client.id, data.operations));
console.log("Statut:", calculerStatut(client.id, data.operations));
console.log("Plafond atteint:", plafondAtteint(client, data.operations));


console.log(calculerTableauBord(data.clients, data.operations));


/*
    totalDu: 0,
    nbClients: 0,
    nbEnDette: 0,
    nbEnRetard: 0
*/