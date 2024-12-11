import mongoose from 'mongoose';

// Modelo de Pokémon capturado
const pokemonSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        default: uuidv4, // Gerar ID único automaticamente
        unique: true
    },
    originalTrainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Referência ao modelo de usuário
    },
    currentTrainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pokedexId: {
        type: Number,
        required: true
    },
    types: {
        type: [String],
        required: true
    },
    stats: {
        hp: { type: Number, required: true },
        attack: { type: Number, required: true },
        defense: { type: Number, required: true },
        specialAttack: { type: Number, required: true },
        specialDefense: { type: Number, required: true },
        speed: { type: Number, required: true }
    },isLegendary: {
        type: Boolean,
        default: false
    },
    isMythical: {
        type: Boolean,
        default: false
    },
    abilities: {
        type: [String],
        default: []
    },
    level: {
        type: Number,
        default: 1,
        min: 1, // Nível mínimo
        max: 100 // Nível máximo padrão para Pokémon
    },
    experience: {
        type: Number,
        default: 0,
        min: 0
    },
    evolution: {
        evolvesTo: { type: String, default: '' }, // Próximo estágio
        evolutionLevel: { type: Number, default: null }, // Nível necessário para evoluir
        method: { type: String, default: '' } // Exemplo: 'Level', 'Item', 'Trade'
    },
    activeAbility: {
        type: String,
        default: ''
    }, 
    imageUrl: {
        type: String,
        default: ''
    }
}, {timestamps: true});

export default mongoose.model('Pokemon', pokemonSchema);
