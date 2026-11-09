
export function afficherClients(clients) {
  const liste = document.querySelector('#liste-clients');
  const etatVide = document.querySelector('#etat-vide');
  const modele = document.querySelector('#modele-client');
  liste.replaceChildren();
  etatVide.classList.toggle('hidden', clients.length > 0);

  for (const client of [...clients].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))) {
    const fragment = modele.content.cloneNode(true);
    const ligne = fragment.querySelector('li');
    ligne.dataset.clientId = client.id;
    fragment.querySelector('.client-nom').textContent = client.nom;
    fragment.querySelector('.client-telephone').textContent = client.telephone || 'Aucun téléphone';
    fragment.querySelector('.client-solde').textContent = '';
    fragment.querySelector('.client-badges').replaceChildren();
    fragment.querySelectorAll('.nom-sr').forEach(element => {
      element.textContent = ` ${client.nom}`;
    });
    liste.append(fragment);
  }
}