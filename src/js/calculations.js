import { creerDemo } from "./demo.js";

const data = creerDemo();



export function calculerSolde(clientId, operations) {
    const operationsClient = operations.filter((operation) => {
        return operation.clientId === clientId;
    });
    
    

    const solde = operationsClient.reduce((total, operations) => {
        if (operations.type === "achat") {
            return total + operations.montant;
        }

        if (operations.type === "remboursement") {
            return total - operations.montant;
        }

        return total;
    }, 0);

    return solde;
}




export function calculerStatut(clientId, operations){
    const solde = calculerSolde(clientId, operations)
    const remboursement = operations.filter((operation) => {
        return operation.clientId === clientId && 
        operation.type === "remboursement"
    })

    const dernierRemboursement = remboursement.sort((a, b) => {
        return b.date.localeCompare(a.date);
    })[0];

    const achats = operations.filter((operation) => {
        return operation.clientId === clientId &&
           operation.type === "achat";
    });

    const premierAchat = achats.sort((a, b) => {
        return a.date.localeCompare(b.date);
    })[0];

    console.log("Premier achat:", premierAchat);

    console.log("Dernier remboursement:", dernierRemboursement);
    console.log("remboursement", remboursement)


    if(solde === 0){
        return "À jour"
    }
    else if(solde > 0){
        return "En dette"
    }
}

console.log("Solde:  ", calculerSolde("c-demo-1", data.operations));

console.log("this is : ",calculerStatut("c-demo-1", data.operations));
