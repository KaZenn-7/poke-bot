import mongoose from 'mongoose';

// Modelo de Pokémon capturado
const pokemonSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }, // Nome do Pokémon
    level: { type: Number, default: 1 },   // Nível do Pokémon
    stats: {                                // Estatísticas básicas
        hp: { type: Number, required: true },
        attack: { type: Number, required: true },
        defense: { type: Number, required: true },
    },
    abilities: [String],                   // Lista de habilidades
});

export default mongoose.model('Pokemon', pokemonSchema);
