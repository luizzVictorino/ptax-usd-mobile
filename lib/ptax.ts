export type QueryMode = "single" | "range";

export type PtaxLine = {
  requestedDate: string;
  sourceDate: string;
  buyValue: number;
  sellValue: number;
  formatted: string;
  isPartial: boolean;
  time?: string;
};

type BacenRate = {
  cotacaoCompra: number;
  cotacaoVenda: number;
  dataHoraCotacao: string;
  tipoBoletim?: string;
};

type BacenResponse = {
  value?: BacenRate[];
};

const BACEN_BASE_URL = "https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/odata";
const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function parseBrazilianDate(input: string): Date | null {
  const match = input.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatBrazilianDate(date: Date) {
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

function formatBacenDate(date: Date) {
  return `${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}-${date.getUTCFullYear()}`;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromBacenDateTime(value: string) {
  const [datePart, timePart = "00:00:00"] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":");
  return new Date(Date.UTC(year, month - 1, day, Number(hour), Number(minute), Number.parseFloat(second) || 0));
}

function formatPtaxValue(value: number) {
  return value.toFixed(4).replace(".", ",");
}

function formatTimeFromBacen(value: string) {
  const time = value.split(" ")[1] ?? "";
  const [hour = "00", minute = "00"] = time.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function buildLine(requestedDate: Date, rate: BacenRate, isPartial: boolean): PtaxLine {
  const sourceDate = fromBacenDateTime(rate.dataHoraCotacao);
  const requested = formatBrazilianDate(requestedDate);
  const time = isPartial ? formatTimeFromBacen(rate.dataHoraCotacao) : undefined;
  const buyFormatted = formatPtaxValue(rate.cotacaoCompra);
  const sellFormatted = formatPtaxValue(rate.cotacaoVenda);
  const formatted = `${requested} - C: ${buyFormatted} / V: ${sellFormatted}${time ? ` (${time})` : ""}`;

  return {
    requestedDate: requested,
    sourceDate: formatBrazilianDate(sourceDate),
    buyValue: rate.cotacaoCompra,
    sellValue: rate.cotacaoVenda,
    formatted,
    isPartial,
    time,
  };
}

async function fetchJson(url: string): Promise<BacenResponse> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`BACEN respondeu com HTTP ${response.status}.`);
  }

  return response.json() as Promise<BacenResponse>;
}

async function getDailyDollarRate(date: Date): Promise<BacenRate | null> {
  const bacenDate = encodeURIComponent(`'${formatBacenDate(date)}'`);
  const url = `${BACEN_BASE_URL}/DollarRateDate(dataCotacao=@dataCotacao)?@dataCotacao=${bacenDate}&%24top=100&%24format=json`;
  const data = await fetchJson(url);
  const rates = data.value ?? [];
  return rates[0] ?? null;
}

async function getUsdBulletins(date: Date): Promise<BacenRate[]> {
  const bacenDate = encodeURIComponent(`'${formatBacenDate(date)}'`);
  const usd = encodeURIComponent("'USD'");
  const url = `${BACEN_BASE_URL}/ExchangeRateDate(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=${usd}&@dataCotacao=${bacenDate}&%24top=100&%24format=json`;
  const data = await fetchJson(url);
  return (data.value ?? []).sort(
    (a, b) => fromBacenDateTime(a.dataHoraCotacao).getTime() - fromBacenDateTime(b.dataHoraCotacao).getTime(),
  );
}

function isSameUtcDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

function todayUtcMidday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0));
}

async function getLatestPreviousClosedRate(date: Date): Promise<BacenRate> {
  const cursor = new Date(date.getTime());

  for (let attempts = 0; attempts < 15; attempts += 1) {
    const rate = await getDailyDollarRate(cursor);
    if (rate) return rate;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  throw new Error("Não foi encontrada PTAX anterior disponível no BACEN para a data informada.");
}

export async function queryPtaxForDate(date: Date): Promise<PtaxLine[]> {
  const today = todayUtcMidday();
  const bulletins = await getUsdBulletins(date);
  const closing = bulletins.find((rate) => rate.tipoBoletim === "Fechamento PTAX");
  const results: PtaxLine[] = [];
  const isToday = isSameUtcDay(date, today);

  // Se encontrou fechamento PTAX, adiciona à lista
  if (closing) {
    results.push(buildLine(date, closing, false));
  }

  // Se é hoje, procura por boletim intermediário (mais recente que não seja fechamento)
  if (isToday && bulletins.length > 0) {
    // Encontra o boletim intermediário mais recente
    const intermediate = [...bulletins].reverse().find((rate) => rate.tipoBoletim !== "Fechamento PTAX");
    if (intermediate) {
      results.push(buildLine(date, intermediate, true));
    }
  }

  // Se não encontrou nada, usa fallback
  if (results.length === 0) {
    const fallback = await getLatestPreviousClosedRate(date);
    results.push(buildLine(date, fallback, false));
  }

  return results;
}

export async function queryPtaxRange(start: Date, end: Date): Promise<PtaxLine[]> {
  if (start.getTime() > end.getTime()) {
    throw new Error("A data inicial deve ser anterior ou igual à data final.");
  }

  const results: PtaxLine[] = [];
  const cursor = new Date(start.getTime());

  while (cursor.getTime() <= end.getTime()) {
    const dayOfWeek = cursor.getUTCDay();
    const shouldInclude = dayOfWeek !== 0 && dayOfWeek !== 6;

    if (shouldInclude) {
      const dayResults = await queryPtaxForDate(new Date(cursor.getTime()));
      results.push(...dayResults);
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return results.sort((a, b) => {
    const da = parseBrazilianDate(a.requestedDate)?.getTime() ?? 0;
    const db = parseBrazilianDate(b.requestedDate)?.getTime() ?? 0;
    if (da !== db) return da - db;
    // Se mesma data, parcial vem depois da fechada
    return a.isPartial ? 1 : -1;
  });
}

export function normalizeDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function createObjectiveOutput(lines: PtaxLine[]) {
  return lines.map((line) => line.formatted).join("\n");
}
