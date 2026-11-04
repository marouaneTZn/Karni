import { creerDemo } from "./demo.js";

const data = creerDemo();


export function calculerSolde(clientId, operations) {
    const operationsClient = operations.filter((operation) => {
        return operation.clientId === clientId;
    });

    console.log(operationsClient.nom)

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




export function calculerStatut(clientId, operations){
    const solde = calculerSolde(clientId, operations)
    if(solde === 0){
        return "À jour"
    }
    else if(solde > 0){
        return "En dette"
    }
}

console.log("Solde:  ", calculerSolde("c-demo-6", data.operations));
console.log(calculerStatut("c-demo-6", data.operations));
