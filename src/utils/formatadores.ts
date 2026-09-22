const doisDigitos = (numero: number): string => numero.toString().padStart(2, '0');

const formatarNumero = (numero: number): string =>
  Number.isInteger(numero) ? numero.toString() : numero.toFixed(2).replace('.', ',');

/** "2026-09-21T21:40:00" (ISO vindo da API) -> "21/09/2026 21:40" */
export const formatarData = (iso: string): string => {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;

  const dia = `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;
  const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
  return `${dia} ${hora}`;
};

/** 12.345 + "cm" -> "12,35 cm" */
export const formatarValor = (valor: number, unidade: string): string =>
  `${valor.toFixed(2).replace('.', ',')} ${unidade}`;

/** Faixa ideal do sensor: "5 a 30 cm". Retorna null quando o sensor não tem limites cadastrados. */
export const formatarFaixa = (
  minimo?: number | null,
  maximo?: number | null,
  unidade = '',
): string | null => {
  if (minimo == null || maximo == null) return null;
  return `${formatarNumero(minimo)} a ${formatarNumero(maximo)} ${unidade}`.trim();
};
