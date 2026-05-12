const base = "https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/odata";
const url = `${base}/ExchangeRateDate(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=%27USD%27&@dataCotacao=%2705-11-2026%27&%24top=100&%24format=json`;

const response = await fetch(url, { headers: { Accept: "application/json" } });
if (!response.ok) {
  throw new Error(`BACEN respondeu com HTTP ${response.status}`);
}

const data = await response.json();
const closing = data.value?.find((item) => item.tipoBoletim === "Fechamento PTAX");
if (!closing) {
  throw new Error("Fechamento PTAX não encontrado no endpoint oficial do BACEN.");
}

console.log(`${closing.dataHoraCotacao} | ${closing.cotacaoVenda.toFixed(4)}`);
