export function exportBook(state) {
  const payload = {
    app: "karni",
    version: 1,
    exporteLe: new Date().toISOString(),
    clients: state.clients,
    operations: state.operations,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `karni-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}