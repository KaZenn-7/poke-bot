# Poké Bot

Um bot para WhatsApp desenvolvido em Node.js utilizando a biblioteca Baileys, MongoDB Atlas como banco de dados e a PokeAPI para obter informações sobre Pokémon.

## Índice

- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Recursos

- **Interação no WhatsApp**: O bot se conecta ao WhatsApp via Baileys.
- **Banco de Dados**: Armazena informações sobre os usuários, Pokémon capturados e inventário no MongoDB Atlas.
- **Informações dos Pokémon**: Utiliza a PokeAPI para buscar detalhes sobre Pokémon, como tipos, habilidades, e evoluções.
- **Sistema de Captura**: Gera Pokémon aleatórios para os jogadores capturarem. (Em breve..)
- **Inventário**: Gerencie itens relacionados ao universo Pokémon. (Em breve..)

## Tecnologias Utilizadas

- **Node.js**: Linguagem de programação principal do projeto.
- **Baileys**: Biblioteca para interação com o WhatsApp.
- **MongoDB Atlas**: Banco de dados na nuvem.
- **Mongoose**: ODM para MongoDB.
- **PokeAPI**: API externa para informações sobre Pokémon.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/KaZenn-7/poke-bot.git
```

2. Navegue até o diretório do projeto:

```bash
cd poke-bot
```

3. Instale as dependências:

```bash
npm install
```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_URI=<sua-url-do-mongodb>
```

2. Configure o MongoDB Atlas e substitua `<sua-url-do-mongodb>` pelo URI de conexão.

## Como Usar

1. Inicie o bot:

```bash
npm start
```

2. Escaneie o código QR com o WhatsApp.
3. O bot estará pronto para interagir!

## Estrutura do Projeto

```
poke-bot/

├── src/
│   ├── index.js         # Index do projeto
│   ├── whatsapp/        # Funções relacionadas ao WhatsApp
│   ├── database/        # Conexão com o MongoDB
│   └── lib/             # Lógica de interação e integração com a PokeAPI
├── models/
│   ├── user.js          # Modelo de usuário
│   └── pokemon.js       # Modelo de Pokémon
├── connection/          # Armazenamento local da conexão com o WhatsApp
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências do projeto
└── README.md            # Documentação
```

## Contribuição

São bem-vindas sugestões, relatórios de bugs e pull requests! Para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch para a sua feature ou correção de bug:

```bash
git checkout -b minha-feature
```

3. Faça as alterações desejadas e commit:

```bash
git commit -m "Minha nova feature"
```

4. Envie as alterações:

```bash
git push origin minha-feature
```

5. Abra um pull request no repositório original.

## Licença

Este projeto está licenciado sob a Licença BSD3. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

