````md
# PTAX USD Mobile

Aplicativo mobile para consulta da cotação PTAX do dólar (USD/BRL), utilizando exclusivamente dados oficiais do Banco Central do Brasil (BACEN).

O projeto foi desenvolvido com auxílio da IA Manus, utilizando engenharia de prompts para evolução incremental das funcionalidades entre as versões.

---

# 📱 Sobre o Projeto

O objetivo do aplicativo é fornecer uma forma simples, rápida e objetiva de consultar a PTAX oficial do dólar americano diretamente das APIs do BACEN.

O app permite:

- Consultar PTAX do dólar
- Consultar por data específica
- Consultar por intervalo de datas
- Exibir PTAX parcial do dia
- Exibir horário da última atualização parcial
- Consultar valores de compra e venda
- Retornar automaticamente a última PTAX válida em feriados/finais de semana

---

# 🚀 Tecnologias Utilizadas

- React Native
- Expo
- JavaScript
- API Oficial PTAX BACEN
- Fetch API
- Mobile First

---

# 🏦 Fonte Oficial dos Dados

Todos os dados são obtidos exclusivamente do:

- Banco Central do Brasil (BACEN)
- Serviço PTAX Oficial
- API OData BACEN

O aplicativo não utiliza serviços terceiros para consulta cambial.

---

# 📦 Funcionalidades

## Consulta da PTAX
- PTAX do dólar USD/BRL
- Valor de compra
- Valor de venda

## Pesquisa por período
- Consulta por data específica
- Consulta por intervalo de datas

## PTAX Parcial
Quando a PTAX do dia ainda não estiver consolidada, o sistema exibe:

```text
11/05/2026 - Compra: 5,2345 | Venda: 5,2351 (10:00)
```

## PTAX Fechada
Quando o fechamento oficial estiver disponível:

```text
09/05/2026 - Compra: 5,1987 | Venda: 5,1993
```

## Tratamento automático
- Finais de semana
- Feriados
- Última PTAX disponível
- Identificação automática de PTAX parcial ou fechada

---

# ▶️ Instalação

Clone o repositório:

```bash
git clone https://github.com/luizzVictorino/ptax-usd-mobile.git
```

Acesse a pasta:

```bash
cd ptax-usd-mobile
```

Instale as dependências:

```bash
npm install
```

ou

```bash
yarn install
```

---

# ▶️ Executando o Projeto

Iniciar aplicação:

```bash
npm start
```

ou

```bash
expo start
```

Executar Android:

```bash
npm run android
```

Executar iOS:

```bash
npm run ios
```

---

# 📂 Estrutura do Projeto

```text
ptax-usd-mobile/
├── assets/
├── components/
├── screens/
├── services/
├── utils/
├── App.js
├── package.json
└── README.md
```

---

# 📈 Histórico de Versões

# v1.0.1
## Primeira versão funcional

Desenvolvida utilizando o seguinte prompt na IA Manus:

```text
Crie uma app para consultar a PTAX diretamente no site/API do Banco Central do Brasil (BACEN), com foco exclusivo na cotação do dólar (USD/BRL).

Requisitos obrigatórios:

* A IA deve acessar os dados oficiais do BACEN.
* Deve permitir selecionar:
  * uma data específica
  * ou um intervalo de datas
* Retornar apenas a PTAX do dólar.
* Exibir:
  * data
  * valor da PTAX
* Quando a PTAX do dia ainda não estiver fechada/consolidada, retornar a cotação parcial junto com o horário da última atualização.

Formato esperado:

* PTAX fechada:
  * 09/05/2026 - 5,2345

* PTAX parcial:
  * 11/05/2026 - 5,2345 (10:00)

Regras importantes:

* Utilizar exclusivamente dados oficiais do BACEN.
* Não retornar outras moedas.
* Ordenar os resultados por data crescente.
* Caso não exista cotação no dia (feriado/fim de semana), retornar a última PTAX disponível anterior.
* O sistema deve identificar automaticamente se a PTAX é parcial ou fechada.
* A resposta deve ser objetiva, sem textos explicativos adicionais.
```

### Funcionalidades implementadas
- Consulta PTAX USD
- Consulta por data
- Consulta por período
- PTAX parcial
- Integração BACEN
- Retorno automático da última PTAX válida

---

# v1.0.2
## Inclusão de compra e venda

Prompt utilizado na IA Manus:

```text
deve retornar o valor de compra e valor de venda
```

### Melhorias implementadas
- Valor de compra da PTAX
- Valor de venda da PTAX
- Melhor apresentação das cotações
- Ajustes de layout e usabilidade

---

# v1.0.3
## Ajuste de PTAX parcial após 13h

Prompt utilizado na IA Manus:

```text
mesmo que passe das 13hrs. a ptax deve aparecer a parcial do dia junto com a ptax do dia. assim como mostra a imagem
```

### Melhorias implementadas
- Exibição simultânea:
  - PTAX fechada
  - PTAX parcial do dia
- Melhor lógica de atualização
- Melhor experiência visual
- Correções de estabilidade

---

# 🔮 Roadmap

- [ ] Gráfico de variação cambial
- [ ] Favoritos de consultas
- [ ] Exportação CSV
- [ ] Tema Dark Mode
- [ ] Widget Android/iOS
- [ ] Notificações cambiais

---

# 🤖 Desenvolvimento com IA

Este projeto foi desenvolvido com auxílio da IA Manus, utilizando engenharia de prompts incremental para evolução contínua das funcionalidades do aplicativo.

O Manus é uma plataforma de IA voltada para automação, geração de código e execução de tarefas orientadas por prompts.

Site oficial:
https://manus.im/app

Cada versão do aplicativo foi refinada através de prompts específicos, permitindo adicionar novas regras de negócio, melhorias visuais e ajustes no comportamento da aplicação ao longo das releases.

Importante:
O Manus não é oficialmente um produto da Meta. Embora existam notícias e especulações sobre investimentos e possíveis aquisições envolvendo empresas do setor, não há confirmação oficial que caracterize o Manus como um produto da Meta.

---

# 📄 Licença

Projeto sob licença MIT.

---

# 👨‍💻 Autor

Luiz Victorino

GitHub:
https://github.com/luizzVictorino

Repositório:
https://github.com/luizzVictorino/ptax-usd-mobile
````
