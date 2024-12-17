import Pokemon from '../../models/pokemon.js';

export async function createPokemon(pokemonData) {
    try {
        const pokemon = new Pokemon(pokemonData);
        return await pokemon.save();
    } catch (error) {
        console.error('Erro ao criar Pokémon:', error);
        throw error;
    }
};

export async function getPokemonById(id) {
    try {
        return await Pokemon.findOne({ _id: id });
    } catch (error) {
        console.error('Erro ao buscar Pokémon por ID:', error);
        throw error;
    }
};

export async function updatePokemon(id, updateData) {
    try {
        return await Pokemon.findOneAndUpdate({ uniqueId: id }, updateData, { new: true });
    } catch (error) {
        console.error('Erro ao atualizar Pokémon:', error);
        throw error;
    }
};

export async function deletePokemon(id) {
    try {
        return await Pokemon.findOneAndDelete({ uniqueId: id });
    } catch (error) {
        console.error('Erro ao remover Pokémon:', error);
        throw error;
    }
};
