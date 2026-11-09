import { state } from './state.js';
import { ajouterClient, modifierClient, supprimerClient } from './clients.js';
import { validerClient } from './validation.js';
import { afficherClients } from './render.js';

const $ = selecteur => document.querySelector(selecteur);
const dialogueClient = $('#dialog-client');
const formulaireClient = $('#form-client');
let actionApresConfirmation = null;

function afficherNotification(message) {
  $('#notification').textContent = message;
}

function effacerErreursClient() {
  for (const champ of ['nom', 'telephone', 'plafond']) {
    const input = $(`#client-${champ}`);
    const erreur = $(`#client-${champ}-erreur`);
    input.classList.remove('champ-invalide');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    erreur.textContent = '';
    erreur.classList.add('hidden');
  }
}

function afficherErreursClient(erreurs) {
  let premierChamp = null;
  for (const [champ, message] of Object.entries(erreurs)) {
    const input = $(`#client-${champ}`);
    const erreur = $(`#client-${champ}-erreur`);
    input.classList.add('champ-invalide');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', erreur.id);
    erreur.textContent = message;
    erreur.classList.remove('hidden');
    premierChamp ||= input;
  }
  premierChamp?.focus();
}

function ouvrirFormulaire(client = null) {
  effacerErreursClient();
  formulaireClient.reset();
  $('#client-id').value = client?.id ?? '';
  $('#dialog-client-titre').textContent = client ? 'Modifier le client' : 'Nouveau client';
  if (client) {
    $('#client-nom').value = client.nom;
    $('#client-telephone').value = client.telephone;
    $('#client-plafond').value = (client.plafond / 100).toFixed(2);
  }
  dialogueClient.showModal();
  $('#client-nom').focus();
}

function demanderConfirmation({ titre, message, libelle }) {
  return new Promise(resolve => {
    actionApresConfirmation = resolve;
    $('#confirmation-titre').textContent = titre;
    $('#confirmation-message').textContent = message;
    $('#confirmation-details').replaceChildren();
    $('#confirmation-valider').textContent = libelle;
    $('#dialog-confirmation').showModal();
  });
}

$('#dialog-confirmation').addEventListener('close', () => {
  const resolve = actionApresConfirmation;
  actionApresConfirmation = null;
  resolve?.($('#dialog-confirmation').returnValue === 'valider');
});

$('#nouveau-client').addEventListener('click', () => ouvrirFormulaire());
$('#client-annuler').addEventListener('click', () => dialogueClient.close());

formulaireClient.addEventListener('submit', event => {
  event.preventDefault();
  effacerErreursClient();
  const resultat = validerClient({
    nom: $('#client-nom').value,
    telephone: $('#client-telephone').value,
    plafond: $('#client-plafond').value,
  });
  if (!resultat.valide) {
    afficherErreursClient(resultat.erreurs);
    return;
  }

  const id = $('#client-id').value;
  if (id) {
    modifierClient(state.clients, id, resultat.client);
    afficherNotification('Client modifié.');
  } else {
    ajouterClient(state.clients, resultat.client);
    afficherNotification('Client ajouté.');
  }
  afficherClients(state.clients);
  dialogueClient.close();
});

$('#liste-clients').addEventListener('click', async event => {
  const bouton = event.target.closest('[data-action]');
  const ligne = bouton?.closest('[data-client-id]');
  if (!bouton || !ligne) return;
  const client = state.clients.find(element => element.id === ligne.dataset.clientId);
  if (!client) return;

  if (bouton.dataset.action === 'modifier-client') {
    ouvrirFormulaire(client);
  } else if (bouton.dataset.action === 'supprimer-client') {
    const confirme = await demanderConfirmation({
      titre: 'Supprimer ce client ?',
      message: `Le client ${client.nom} sera supprimé du carnet.`,
      libelle: 'Supprimer',
    });
    if (!confirme) return;
    supprimerClient(state.clients, client.id);
    afficherClients(state.clients);
    afficherNotification('Client supprimé.');
  }
});

afficherClients(state.clients);
