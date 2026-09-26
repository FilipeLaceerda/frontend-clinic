export function moeda(valor) {
  return valor == null
    ? "—"
    : Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
}

export function dataBR(valor) {
  return valor ? valor.split("-").reverse().join("/") : "—";
}
