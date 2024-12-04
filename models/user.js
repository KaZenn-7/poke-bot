import mongoose from 'mongoose';
import Pokemon from "./pokemon.js"

// Modelo de item para o inventário
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nome do item
    quantity: { type: Number, default: 1 }, // Quantidade do item
});

// Modelo de Pokémon capturado
const capturedPokemonSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nome do Pokémon
    level: { type: Number, default: 1 },   // Nível do Pokémon
    stats: {                                // Estatísticas básicas
        hp: { type: Number, required: true },
        attack: { type: Number, required: true },
        defense: { type: Number, required: true },
    },
    abilities: [String],                   // Lista de habilidades
    capturedAt: { type: Date, default: Date.now }, // Data de captura
});

// Modelo do usuário
const userSchema = new mongoose.Schema({
    whatsappId: { type: String, required: true, unique: true }, // ID único do WhatsApp
    name: { type: String, required: true }, // Nome do jogador
    inventory: [itemSchema],               // Array de itens na mochila
    capturedPokemons: [capturedPokemonSchema], // Array de Pokémons capturados
    pokedex: [Number],                     // Array de números (para funcionalidades futuras)
    createdAt: { type: Date, default: Date.now }, // Data de criação do usuário
});

export default mongoose.model('User', userSchema);
