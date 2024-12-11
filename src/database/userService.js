import User from '../../models/user.js';

export async function createUser(whatsappId, name) {
    const user = new User({ whatsappId, name });
    return await user.save();
}

export async function getUserByWhatsappId(whatsappId) {
    return await User.findOne({ whatsappId });
}

export async function addItemToInventory(whatsappId, itemName, quantity = 1) {
    const user = await User.findOne({ whatsappId });
    if (!user) throw new Error('Usuário não encontrado.');

    const itemIndex = user.inventory.findIndex(item => item.name === itemName);
    if (itemIndex >= 0) {
        user.inventory[itemIndex].quantity += quantity;
    } else {
        user.inventory.push({ name: itemName, quantity });
    }

    return await user.save();
}

export async function addPokemon(whatsappId, pokemon) {
    const user = await User.findOne({ whatsappId });
    if (!user) throw new Error('Usuário não encontrado.');

    user.capturedPokemons.push(pokemon);
    return await user.save();
}

export async function addToPokedex(whatsappId, pokemon) {
    const user = await User.findOne({ whatsappId });
    if (!user) throw new Error('Usuário não encontrado.');

    user.knownPokemons.push(pokemon.pokemonData.id);

    return await user.save();
}