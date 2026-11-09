
const btnNouveau = document.querySelector("#nouveau-client");

const dialog = document.querySelector("#dialog-client");

const form = document.querySelector("#form-client");

const nomInput = document.querySelector("#client-nom");

const telephoneInput = document.querySelector("#client-telephone");

const plafondInput = document.querySelector("#client-plafond");



// =====================================================================
// US-01 · Personne 1 — Ajouter un client
// À coller dans src/js/main.js.
// Cherche « ADAPTER » (Ctrl+F) : ces lignes dépendent de ton state et de
// tes fonctions, garde les noms qui existent déjà dans ton projet.
// =====================================================================

// ---------- Éléments du DOM ----------

// ADAPTER : ne redéclare pas une constante qui existe déjà dans main.js.
const dialogClient = document.querySelector("#dialog-client");
const formClient = document.querySelector("#form-client");

// ---------- Règles de validation ----------
// À comparer avec les critères d'acceptation de US-01.
const NOM_MIN = 2;
const NOM_MAX = 50;
// Numéro marocain, fixe ou mobile : 0612345678, +212612345678, 00212612345678.
// Espaces, points et tirets sont retirés avant le test.
const REGEX_TELEPHONE = /^(?:\+212|00212|0)[5-7]\d{8}$/;
const CHAMPS_CLIENT = ["nom", "telephone", "plafond"];

// ---------- Petits outils ----------

// Clé de comparaison : "  Fâtima " et "fatima" donnent la même clé.
function cleNom(nom) {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
addEventListener.showModal(dialog-client)

// "1 500,50" -> 1500.5 ; texte invalide -> NaN
function lireMontant(texte) {
  const propre = texte.replace(/\s/g, "").replace(",", ".");
  return /^\d+(\.\d{1,2})?$/.test(propre) ? Number(propre) : NaN;
}

// crypto.randomUUID n'existe pas en HTTP hors localhost : on prévoit un plan B.
function nouvelId() {
  return (
    crypto.randomUUID?.() ??
    `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  );
}

// ADAPTER : utilise ta fonction de notification si elle existe déjà.
function notifier(message) {
  document.querySelector("#notification").textContent = message;
}

// ---------- Formulaire : lecture, validation, erreurs ----------

function lireFormulaireClient() {
  return {
    nom: document.querySelector("#client-nom").value.replace(/\s+/g, " ").trim(),
    telephone: document.querySelector("#client-telephone").value.replace(/[\s.-]/g, ""),
    plafond: document.querySelector("#client-plafond").value.trim(),
  };
}

// Retourne { nom?, telephone?, plafond? } : un message par champ en erreur,
// objet vide si tout est valide.
// Partagée avec Personne 2 : editClient() peut l'appeler avec idIgnore = id du
// client modifié, pour ne pas refuser son propre nom.
function validerClient({ nom, telephone, plafond }, idIgnore = null) {
  const erreurs = {};

  if (nom === "") {
    erreurs.nom = "Le nom est obligatoire.";
  } else if (nom.length < NOM_MIN || nom.length > NOM_MAX) {
    erreurs.nom = `Le nom doit contenir entre ${NOM_MIN} et ${NOM_MAX} caractères.`;
  } else if (
    // ADAPTER : state.clients
    state.clients.some((c) => c.id !== idIgnore && cleNom(c.nom) === cleNom(nom))
  ) {
    erreurs.nom = "Un client porte déjà ce nom.";
  }

  // Téléphone facultatif, mais valide s'il est rempli.
  if (telephone !== "" && !REGEX_TELEPHONE.test(telephone)) {
    erreurs.telephone = "Numéro invalide (ex. 0612345678 ou +212612345678).";
  }

  const montant = lireMontant(plafond);
  if (plafond === "") {
    erreurs.plafond = "Le plafond est obligatoire.";
  } else if (Number.isNaN(montant)) {
    erreurs.plafond = "Montant invalide (ex. 500 ou 500,50).";
  } else if (montant <= 0) { // ADAPTER : si 0 est accepté, mets « < 0 »
    erreurs.plafond = "Le plafond doit être supérieur à 0.";
  }

  return erreurs;
}

function effacerErreursClient() {
  for (const champ of CHAMPS_CLIENT) {
    const input = document.querySelector(`#client-${champ}`);
    const message = document.querySelector(`#client-${champ}-erreur`);
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    message.textContent = "";
    message.classList.add("hidden");
  }
}

function afficherErreursClient(erreurs) {
  for (const [champ, texte] of Object.entries(erreurs)) {
    const input = document.querySelector(`#client-${champ}`);
    const message = document.querySelector(`#client-${champ}-erreur`);
    message.textContent = texte;
    message.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", message.id);
  }
  // Le curseur va sur le premier champ à corriger.
  const premier = CHAMPS_CLIENT.find((champ) => erreurs[champ]);
  document.querySelector(`#client-${premier}`).focus();
}

// ---------- addClient() ----------

function addClient() {
  effacerErreursClient();

  const saisie = lireFormulaireClient();
  const erreurs = validerClient(saisie);

  if (Object.keys(erreurs).length > 0) {
    afficherErreursClient(erreurs);
    notifier("Client non ajouté : corrigez les champs signalés.");
    return false;
  }

  const client = {
    id: nouvelId(),
    nom: saisie.nom,
    telephone: saisie.telephone,
    plafond: lireMontant(saisie.plafond), // ADAPTER : en centimes ? -> Math.round(lireMontant(saisie.plafond) * 100)
    operations: [], // ADAPTER : retire cette ligne si tes opérations sont dans un tableau à part
  };

  state.clients.push(client); // ADAPTER : le nom de ton state
  saveState(); // ADAPTER : ta sauvegarde (localStorage)
  render(); // ADAPTER : ton affichage (liste + tableau de bord)

  formClient.reset();
  dialogClient.close();
  notifier(`Client « ${client.nom} » ajouté.`);
  return true;
}

// ---------- Branchements ----------
// ADAPTER : si ton main.js branche déjà ces événements, supprime cette section
// (sinon addClient() s'exécute deux fois et le 2e appel signale un doublon).

document.querySelector("#nouveau-client").addEventListener("click", () => {
  formClient.reset();
  effacerErreursClient();
  document.querySelector("#client-id").value = ""; // vide = mode ajout
  document.querySelector("#dialog-client-titre").textContent = "Nouveau client";
  dialogClient.showModal();
});

document.querySelector("#client-annuler").addEventListener("click", () => {
  dialogClient.close();
});

// Un seul listener pour les deux personnes : à brancher ensemble.
formClient.addEventListener("submit", (event) => {
  event.preventDefault(); // sans ça, le formulaire recharge la page
  const id = document.querySelector("#client-id").value;
  if (id === "") {
    addClient(); // champ caché vide = ajout
  } else {
    editClient(id); // Personne 2
  }
});

// ---------- Tests à faire à la main avant de pousser ----------
// 1. Tout vide -> erreurs sur Nom et Plafond (le téléphone est facultatif).
// 2. Nom "Ahmed", puis "  ahmed " -> le 2e est refusé (doublon).
// 3. Téléphone "123" -> refusé ; "06 12 34 56 78" -> accepté.
// 4. Plafond "abc", "-5", "0" -> refusés ; "1 500,50" -> accepté.
// 5. Après un ajout réussi : la fenêtre se ferme, le client apparaît, F5 le garde.