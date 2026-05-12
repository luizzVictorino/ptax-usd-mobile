# Pesquisa oficial BACEN PTAX

Autor: **Manus AI**

## Achados iniciais

O Portal de Dados Abertos do Banco Central do Brasil publica o recurso **American Dollar (bid and offer) – daily rates**, com endpoint oficial em `https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/application#!/`. A página informa que o padrão de URL segue `https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/odata/[endpoint]?$format=json&[Other parameters]`, com retorno em JSON, XML, CSV ou HTML.

A documentação do serviço **Olinda PTAX v1** lista endpoints para **Currencies**, **DollarRateDate**, **DollarRatePeriod**, **ExchangeRateDate**, **ExchangeRatePeriod**, além de recursos de boletins intermediários. Para o aplicativo, a fonte primária será o conjunto oficial PTAX do BACEN, usando apenas os endpoints relacionados a dólar americano e, quando necessário para parcialidade intradiária, os endpoints de boletins intermediários.

| Fonte oficial | URL | Utilidade no aplicativo |
|---|---|---|
| Portal de Dados Abertos BACEN | https://opendata.bcb.gov.br/dataset/american-dollar-bid-and-offer-daily-rates/resource/a724c44f-2fb4-4c27-bdef-39b9d5be545c | Confirma a existência da API oficial e o padrão OData. |
| Serviço Olinda PTAX v1 | https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/application#!/ | Confirma os endpoints disponíveis para dólar diário e boletins. |

## Referências

[1]: https://opendata.bcb.gov.br/dataset/american-dollar-bid-and-offer-daily-rates/resource/a724c44f-2fb4-4c27-bdef-39b9d5be545c "American Dollar (bid and offer) – daily rates - API - Banco Central do Brasil Open Data Portal"
[2]: https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/application#!/ "American Dollar (bid and offer) - daily rates and Exchange Rates - daily bulletins - v1"

## Confirmação técnica por endpoint

A interface oficial do serviço Olinda confirma que o endpoint técnico para cotação diária do dólar é **DollarRateDate**, com parâmetro `dataCotacao` no formato `MM-DD-YYYY`. A URL gerada pela própria interface usa o padrão `DollarRateDate(dataCotacao=@dataCotacao)?@dataCotacao='MM-DD-YYYY'&$top=100&$format=json`. O retorno contém os campos `cotacaoCompra`, `cotacaoVenda` e `dataHoraCotacao`.

O teste direto contra o serviço oficial para `05-08-2026` retornou HTTP 200 e uma cotação com `cotacaoCompra`, `cotacaoVenda` e `dataHoraCotacao`. O endpoint **DollarRatePeriod** também respondeu HTTP 200 para o intervalo `05-01-2026` a `05-11-2026`, trazendo apenas os dias com cotação publicada. Isso confirma que o aplicativo deve preencher os dias sem cotação usando uma busca retrospectiva da última PTAX anterior, conforme requisito do usuário.

| Endpoint | Parâmetros confirmados | Campos úteis | Uso no app |
|---|---|---|---|
| `DollarRateDate` | `dataCotacao` | `cotacaoVenda`, `dataHoraCotacao` | Consultar PTAX fechada ou última cotação disponível para uma data. |
| `DollarRatePeriod` | `dataInicial`, `dataFinalCotacao` | `cotacaoVenda`, `dataHoraCotacao` | Consultar intervalo e ordenar retornos por data crescente. |


## Identificação de parcialidade e fechamento

A documentação visual do serviço Olinda mostra que o endpoint **ExchangeRateDate** recebe os parâmetros `moeda` e `dataCotacao`, usando a forma `ExchangeRateDate(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='MM-DD-YYYY'&$top=100&$format=json`. O retorno inclui `cotacaoCompra`, `cotacaoVenda`, `dataHoraCotacao` e `tipoBoletim`.

Em teste direto para `05-11-2026`, o endpoint retornou boletins do tipo **Abertura**, **Intermediário** e **Fechamento PTAX** para USD. Portanto, a regra de implementação será: se houver registro `tipoBoletim === 'Fechamento PTAX'`, o app exibirá a PTAX fechada sem horário; se o dia consultado for o dia atual e ainda não houver `Fechamento PTAX`, o app usará o último boletim disponível para USD e exibirá o horário `HH:mm` entre parênteses.

| Situação | Fonte consultada | Regra de exibição |
|---|---|---|
| Dia com `Fechamento PTAX` | `ExchangeRateDate` ou `DollarRateDate` | Exibir `dd/mm/aaaa - venda` sem horário. |
| Dia atual sem fechamento | `ExchangeRateDate` com `moeda='USD'` | Exibir último boletim por `dataHoraCotacao`, com horário `HH:mm`. |
| Dia sem cotação | Busca retrospectiva via `DollarRateDate` | Exibir a última PTAX anterior disponível na data solicitada. |

