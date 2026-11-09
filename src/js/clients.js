export function creerClientId() {
  return `c-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

export function ajouterClient(clients, donnees) {
  const client = { id: creerClientId(), ...donnees };
  clients.push(client);
  return client;
}

export function modifierClient(clients, id, donnees) {
  const client = clients.find(element => element.id === id);
  if (client) Object.assign(client, donnees);
  return client;
}

export function supprimerClient(clients, id) {
  const index = clients.findIndex(element => element.id === id);
  if (index < 0) return false;
  clients.splice(index, 1);
  return true;
}