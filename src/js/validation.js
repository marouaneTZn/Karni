const NOM = /^[\p{L}][\p{L} '\u2019-]{0,39}$/u;
const TELEPHONE = /^0[567]\d{8}$/;

function convertirMontantEnCentimes(valeur) {
  const texte = String(valeur ?? '').trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(texte)) return null;
  const centimes = Math.round(Number(texte) * 100);
  return Number.isSafeInteger(centimes) ? centimes : null;
}

export function validerClient(formulaire) {
  const erreurs = {};
  const nom = String(formulaire.nom ?? '').trim().replace(/\s+/g, ' ');
  const telephone = String(formulaire.telephone ?? '').trim();
  const plafond = convertirMontantEnCentimes(formulaire.plafond);

  if (nom.length < 2 || nom.length > 40 || !NOM.test(nom)) {
    erreurs.nom = 'Saisissez un nom de 2 à 40 caractères : lettres, espaces, apostrophe ou tiret.';
  }
  if (telephone && !TELEPHONE.test(telephone)) {
    erreurs.telephone = 'Saisissez 10 chiffres commençant par 05, 06 ou 07.';
  }
  if (plafond === null || plafond < 5000 || plafond > 1000000) {
    erreurs.plafond = 'Le plafond doit être entre 50 et 10 000 MAD, avec au plus deux décimales.';
  }

  return {
    valide: Object.keys(erreurs).length === 0,
    erreurs,
    client: { nom, telephone, plafond },
  };
}