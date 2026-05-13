# PTAX USD Mobile

Aplicativo mobile para consulta da cotação PTAX do dólar (USD/BRL) utilizando dados oficiais do Banco Central do Brasil.

O app permite consultar:

* Cotação PTAX do dia
* Histórico por intervalo de datas
* Valor parcial da PTAX enquanto o fechamento oficial ainda não ocorreu
* Consulta rápida e simplificada para dispositivos móveis

A PTAX é a taxa de câmbio de referência divulgada pelo Banco Central do Brasil, calculada a partir de consultas realizadas ao longo do dia. ([GitHub][1])

---

# 📱 Funcionalidades

* Consulta da PTAX USD/BRL
* Histórico de cotações
* Exibição da PTAX parcial do dia
* Interface mobile simplificada
* Consumo de API oficial do Banco Central
* Atualização automática dos dados
* Suporte a múltiplos períodos de consulta

---

# 🚀 Tecnologias Utilizadas

* React Native
* Expo
* TypeScript / JavaScript
* API PTAX do Banco Central
* Axios / Fetch API
* Mobile First Design

---

# 🏦 Sobre a PTAX

A PTAX é a taxa oficial de referência do dólar divulgada pelo Banco Central do Brasil.

Ela é atualizada em até 4 janelas durante o dia:

* 10h
* 11h
* 12h
* 13h

Após o fechamento, a PTAX oficial consolidada é disponibilizada pelo Bacen. ([GitHub][1])

---

# 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/luizzVictorino/ptax-usd-mobile.git
```

Acesse a pasta do projeto:

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

Inicie o projeto:

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
├── hooks/
├── utils/
├── App.tsx
├── package.json
└── README.md
```

---

# 🔌 API Utilizada

Dados obtidos através da API oficial PTAX do Banco Central do Brasil.

Referências:

* Dados Abertos Bacen
* Serviço PTAX OData
* Cotações oficiais USD/BRL

([GitHub][2])

---

# 📈 Versões

# 📈 Versões

## v1.0.1

### Versão inicial

* Consulta da PTAX USD/BRL
* Integração com API do Banco Central
* Exibição da cotação do dia
* Estrutura inicial do aplicativo mobile
* Interface básica para consulta rápida

---

## v1.0.2

### Melhorias e correções

* Ajustes de layout
* Melhor tratamento de erros de conexão
* Melhorias de performance
* Correções na busca da PTAX
* Ajustes na exibição de datas e valores
* Melhor estabilidade da aplicação

---

## v1.0.3

### Atualização de usabilidade e estabilidade

* Melhorias na experiência do usuário
* Otimização das consultas à API
* Ajustes visuais na interface
* Melhor organização do código
* Correções gerais de bugs
* Melhor compatibilidade entre dispositivos Android/iOS

---

# 🛠 Roadmap

* [ ] Favoritos de períodos
* [ ] Gráfico de variação
* [ ] Modo dark
* [ ] Exportação CSV
* [ ] Notificações de variação cambial
* [ ] Widget Android/iOS

---

# 📄 Licença

Este projeto está sob licença MIT.

---

# 👨‍💻 Autor

Desenvolvido por Luiz Victorino.

GitHub: [luizzVictorino](https://github.com/luizzVictorino?utm_source=chatgpt.com)

Repositório: [ptax-usd-mobile](https://github.com/luizzVictorino/ptax-usd-mobile?utm_source=chatgpt.com)

[1]: https://github.com/fintech-hub/cotacao-diaria-dolar?utm_source=chatgpt.com "GitHub - leogregianin/cotacao-diaria-dolar: 💵 💰 🇧🇷 Cotações diárias Dólar"
[2]: https://github.com/rodrigues-t/ptax?utm_source=chatgpt.com "GitHub - rodrigues-t/ptax: Check PTAX exchange rates history of several currencies by open data API of Central Bank of Brazil."
