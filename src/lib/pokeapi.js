import axios from 'axios';

export async function getPokemon(nameOrId) {

    if (!nameOrId) return 'Por favor, forneça o nome de um Pokémon.';

    try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        if (!data) throw new Error(`Error getting pokemon: ${nameOrId}`) ;
        return{ data,
        message:`🆔 ID: ${data.id}\n⚔️ Ataque: ${data.stats[1].base_stat * 10}\n🛡️ Defesa: ${data.stats[2].base_stat * 10}\n❤️ HP: ${data.stats[0].base_stat * 10}`,
        imageURL: data.sprites.front_default };
    } catch (error) {
        return undefined;
    }

}

// let a = await getPokemon(25);

// console.log(a);