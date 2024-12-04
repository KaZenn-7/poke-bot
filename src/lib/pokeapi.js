import axios from 'axios';

export async function handleMessage(message) {
    const command = message.toLowerCase();

    if (command.startsWith('!pokemon')) {
        const [, pokemonName] = command.split(' ');
        if (!pokemonName) {
            return 'Por favor, forneça o nome de um Pokémon. Exemplo: !pokemon pikachu';
        }

        try {
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            return `🌟 ${data.name.toUpperCase()} 🌟
🆔 ID: ${data.id}
⚔️ Ataque: ${data.stats[1].base_stat * 10}
🛡️ Defesa: ${data.stats[2].base_stat * 10}
❤️ HP: ${data.stats[0].base_stat * 10}`;
        } catch (error) {
            return 'Não consegui encontrar esse Pokémon. Certifique-se de que o nome está correto.';
        }
    }

    return null;
}

// let a = await handleMessage("!pokemon pikachu");

// console.log(a);