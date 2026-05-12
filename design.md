# Design do Aplicativo PTAX USD

Autor: **Manus AI**

## Direção de design

O aplicativo **PTAX USD** será desenhado para uso em **orientação retrato 9:16**, com foco em operação com uma mão e aparência alinhada às convenções visuais de aplicativos iOS nativos. A experiência deve ser objetiva, sem telas secundárias desnecessárias, porque o propósito central é consultar a PTAX do dólar norte-americano contra o real brasileiro a partir de dados oficiais do Banco Central do Brasil.

A interface priorizará leitura clara, campos grandes, estados de carregamento evidentes e uma área de resultado em texto objetivo. O usuário deve conseguir escolher rapidamente entre **data única** e **intervalo de datas**, executar a consulta e copiar visualmente o resultado no formato exigido.

## Lista de telas

| Tela | Objetivo | Conteúdo principal |
|---|---|---|
| **Consulta PTAX** | Permitir consulta por data única ou intervalo. | Cabeçalho compacto, seletor de modo, campos de data, botão de consulta, status e resultados. |
| **Estado de erro/sem conexão** | Informar problema operacional sem adicionar explicações ao resultado. | Mensagem curta fora da área de saída, botão para tentar novamente. |

## Conteúdo e funcionalidade por tela

A tela **Consulta PTAX** ocupará todo o fluxo principal do aplicativo. No topo, um cabeçalho com o título **PTAX USD** e uma descrição curta indicará que a consulta usa dados oficiais do BACEN. Logo abaixo, um controle segmentado permitirá alternar entre **Data única** e **Intervalo**. Em seguida, campos de data no padrão brasileiro `dd/mm/aaaa` serão exibidos de acordo com o modo selecionado.

A área inferior da tela terá um botão primário **Consultar PTAX**, seguido por um cartão de resultado com tipografia monoespaçada para preservar a leitura linha a linha. Esse cartão exibirá apenas linhas no padrão `dd/mm/aaaa - valor` ou `dd/mm/aaaa - valor (HH:mm)`, sem explicações adicionais dentro da resposta. Caso ocorra erro de rede ou indisponibilidade do serviço, a mensagem aparecerá separada do cartão de saída para não contaminar o formato objetivo exigido.

## Fluxos principais

| Fluxo | Passos |
|---|---|
| **Consultar data específica** | O usuário seleciona **Data única**, digita a data, toca em **Consultar PTAX**, o app consulta o BACEN, aplica fallback para a última PTAX anterior se necessário e exibe uma linha objetiva. |
| **Consultar intervalo** | O usuário seleciona **Intervalo**, informa data inicial e final, toca em **Consultar PTAX**, o app consulta o BACEN, ordena as datas em ordem crescente e exibe uma linha por data útil disponível ou por fallback exigido. |
| **Cotação parcial do dia atual** | O app identifica a cotação mais recente disponível para o dia ainda não consolidado e adiciona o horário da última atualização entre parênteses. |
| **Dia sem cotação** | O app detecta ausência de PTAX para feriado ou fim de semana e retorna a última PTAX disponível anterior, mantendo a data solicitada na linha de saída. |

## Escolhas de cor

| Papel visual | Cor | Justificativa |
|---|---|---|
| Primária | `#0057B8` | Azul institucional, associado a confiança, finanças e leitura clara. |
| Fundo claro | `#F6F8FB` | Fundo frio e neutro para reduzir fadiga visual. |
| Superfície | `#FFFFFF` | Cartões limpos com contraste iOS-like. |
| Texto principal | `#111827` | Preto suavizado para leitura confortável. |
| Texto secundário | `#6B7280` | Cinza discreto para rótulos e instruções curtas. |
| Sucesso/resultado | `#0E7A3E` | Verde sóbrio para confirmar retorno válido. |
| Alerta/parcial | `#B45309` | Âmbar para indicar cotação parcial sem dramatizar. |
| Erro | `#B91C1C` | Vermelho escuro para falhas de validação ou rede. |

## Layout mobile e acessibilidade

Os campos terão altura mínima confortável para toque, com espaçamento vertical suficiente para uso com polegar. O botão principal ficará próximo à metade inferior da tela, sem encostar no indicador de início do iPhone. A tipografia usará tamanhos compatíveis com leitura rápida: título maior, rótulos médios e resultado monoespaçado com boa altura de linha. O contraste de cores será preservado em modo claro e escuro por meio dos tokens de tema do projeto.

## Decisões de produto

O aplicativo não incluirá autenticação, cadastro de usuário, armazenamento em nuvem ou outras moedas, pois o requisito solicita foco exclusivo na cotação **USD/BRL**. A consulta será feita diretamente contra endpoints oficiais do BACEN, e a lógica do app impedirá seleção de qualquer moeda diferente de dólar norte-americano.

## Referências

[1]: https://developer.apple.com/design/human-interface-guidelines/ "Apple Human Interface Guidelines"
[2]: https://www.bcb.gov.br/ "Banco Central do Brasil"
