import axios from 'axios';

const typeTranslations = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Grama",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Venenoso",
    ground: "Terrestre",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Metálico",
    fairy: "Fada"
};

const evolutionMethods = (details) => {
    if (details.min_level) {
        return `Nível ${details.min_level}`;
    } else if (details.item) {
        return `Usar ${details.item.name}`;
    } else if (details.trade) {
        return "Troca";
    } else if (details.min_happiness) {
        return `Felicidade mínima de ${details.min_happiness}`;
    } else if (details.time_of_day) {
        return `Durante o ${details.time_of_day}`;
    } else if (details.known_move) {
        return `Saber o movimento ${details.known_move.name}`;
    } else if (details.known_move_type) {
        return `Saber um movimento do tipo ${details.known_move_type.name}`;
    } else if (details.gender !== null) {
        return details.gender === 1 ? "Somente fêmea" : "Somente macho";
    } else if (details.location) {
        return `Em ${details.location.name}`;
    } else if (details.needs_overworld_rain) {
        return "Com chuva no mundo aberto";
    } else if (details.party_species) {
        return `Com ${details.party_species.name} no grupo`;
    } else if (details.party_type) {
        return `Com um Pokémon do tipo ${details.party_type.name} no grupo`;
    } else if (details.relative_physical_stats !== null) {
        return details.relative_physical_stats === 1
            ? "Ataque maior que defesa"
            : details.relative_physical_stats === -1
            ? "Defesa maior que ataque"
            : "Ataque igual à defesa";
    } else if (details.trigger.name === "shed") {
        return "Deixe um espaço vazio no grupo";
    }
    return "Método desconhecido";
};

export async function getPokemon(nameOrId) {

    if (!nameOrId) return 'Por favor, forneça o nome de um Pokémon.';

    try {
        const { data: pokemonData } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        if (!pokemonData) throw new Error(`Error getting pokemon: ${nameOrId}`) ;

        const { data: speciesData} = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId.toLowerCase()}`);
        const { data: evolutionData } = await axios.get(speciesData.evolution_chain.url);

        const legendaryStatus = speciesData.is_legendary ? 'Lendário' : speciesData.is_mythical ? 'Mítico' : 'Comum';
        const types = pokemonData.types.map(typeInfo => typeTranslations[typeInfo.type.name] || typeInfo.type.name).join(', ');

        const typeAdvantages = {
            doubleDamageTo: new Set(),
            halfDamageFrom: new Set(),
            noDamageFrom: new Set(),
            doubleDamageFrom: new Set(),
            halfDamageTo: new Set(),
            noDamageTo: new Set()
        };

        // Consultar dados para cada tipo
        for (let type of pokemonData.types) {
            const { data: typeData } = await axios.get(type.type.url);

            // Adiciona vantagens/desvantagens conforme as relações de dano
            typeData.damage_relations.double_damage_to.forEach(d => typeAdvantages.doubleDamageTo.add(typeTranslations[d.name] || d.name));
            typeData.damage_relations.half_damage_from.forEach(d => typeAdvantages.halfDamageFrom.add(typeTranslations[d.name] || d.name));
            typeData.damage_relations.no_damage_from.forEach(d => typeAdvantages.noDamageFrom.add(typeTranslations[d.name] || d.name));
            typeData.damage_relations.double_damage_from.forEach(d => typeAdvantages.doubleDamageFrom.add(typeTranslations[d.name] || d.name));
            typeData.damage_relations.half_damage_to.forEach(d => typeAdvantages.halfDamageTo.add(typeTranslations[d.name] || d.name));
            typeData.damage_relations.no_damage_to.forEach(d => typeAdvantages.noDamageTo.add(typeTranslations[d.name] || d.name));
        }

        // Construir linha evolutiva e métodos de evolução
        const evolutionChain = [];
        let currentEvolution = evolutionData.chain;
        const evolutionMethodsList = [];

        while (currentEvolution) {
            const evolutions = currentEvolution.evolves_to.map(e => ({
                name: e.species.name,
                method: e.evolution_details.map(evolutionMethods).join(', ')
            }));
            evolutionChain.push(currentEvolution.species.name);
            evolutionMethodsList.push(...evolutions);
            currentEvolution = currentEvolution.evolves_to[0];
        }


        return { pokemonData,
        message:`*🆔 ID:* ${pokemonData.id}
*🔰 Status:* ${legendaryStatus}
*🧪 Tipo(s):* ${types}

*⚔️ Ataque:* ${pokemonData.stats[1].base_stat}
*🛡️ Defesa:* ${pokemonData.stats[2].base_stat}
*❤️ HP:* ${pokemonData.stats[0].base_stat}

*🔄 Linha Evolutiva:* ${evolutionChain.join(' → ')}
*📈 Métodos de Evolução:*
    ${evolutionMethodsList.map(e => `${e.name}: ${e.method}`).join('\n    ')}

*🔺 Efetivo contra:* ${Array.from(typeAdvantages.doubleDamageTo).join(', ') || 'Nenhuma'}
*🔻 Fraco contra:* ${Array.from(typeAdvantages.doubleDamageFrom).join(', ') || 'Nenhuma'}
*🛡️ Resistente a:* ${Array.from(typeAdvantages.halfDamageFrom).join(', ') || 'Nenhuma'}`,
        imageURL: pokemonData.sprites.front_default };
    } catch (error) {
        console.error(error);
        return undefined;
    }

}

// let a = await getPokemon("pikachu");

// console.log(a);