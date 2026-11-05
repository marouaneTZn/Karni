import { creerDemo } from "./demo.js";

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

    if (dateReference) {
    
    const aujourdHui = new Date();
    const dateOperation = new Date(dateReference);

    const difference = aujourdHui - dateOperation;

    const nombreJours = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

        console.log("Nombre de jours:", nombreJours);
    }
    if (solde === 0) {
        return "À jour";
    } else if (solde > 0) {
        return "En dette";
    }
}

console.log("Solde:", calculerSolde("c-demo-1", data.operations));
console.log("Statut:", calculerStatut("c-demo-1", data.operations));