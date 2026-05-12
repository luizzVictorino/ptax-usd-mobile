import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createObjectiveOutput,
  normalizeDateInput,
  parseBrazilianDate,
  queryPtaxForDate,
} from "./ptax";

describe("PTAX USD", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normaliza e valida datas brasileiras", () => {
    expect(normalizeDateInput("11052026")).toBe("11/05/2026");
    expect(parseBrazilianDate("11/05/2026")?.toISOString().slice(0, 10)).toBe("2026-05-11");
    expect(parseBrazilianDate("31/02/2026")).toBeNull();
  });

  it("usa o boletim Fechamento PTAX oficial do BACEN quando disponível", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        value: [
          {
            cotacaoCompra: 4.8988,
            cotacaoVenda: 4.8994,
            dataHoraCotacao: "2026-05-11 13:08:25.127",
            tipoBoletim: "Intermediário",
          },
          {
            cotacaoCompra: 4.8967,
            cotacaoVenda: 4.8973,
            dataHoraCotacao: "2026-05-11 13:08:25.140",
            tipoBoletim: "Fechamento PTAX",
          },
        ],
      }),
    } as Response);

    const result = await queryPtaxForDate(parseBrazilianDate("11/05/2026")!);

    expect(result.formatted).toBe("11/05/2026 - 4,8973");
    expect(result.isPartial).toBe(false);
    expect(createObjectiveOutput([result])).toBe("11/05/2026 - 4,8973");
  });

  it("retorna a última PTAX anterior quando a data solicitada não tem cotação", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("ExchangeRateDate")) {
        return { ok: true, json: async () => ({ value: [] }) } as Response;
      }

      if (url.includes("05-08-2026")) {
        return {
          ok: true,
          json: async () => ({
            value: [
              {
                cotacaoCompra: 4.8993,
                cotacaoVenda: 4.8999,
                dataHoraCotacao: "2026-05-08 13:05:32.403",
              },
            ],
          }),
        } as Response;
      }

      return { ok: true, json: async () => ({ value: [] }) } as Response;
    });

    const result = await queryPtaxForDate(parseBrazilianDate("10/05/2026")!);

    expect(result.formatted).toBe("10/05/2026 - 4,8999");
    expect(result.sourceDate).toBe("08/05/2026");
    expect(result.isPartial).toBe(false);
  });
});
