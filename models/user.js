import mongoose from 'mongoose';

// Modelo do usuário
const userSchema = new mongoose.Schema({
    whatsappId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    inventory: {        // Array de objetos genérico para itens
        type: [{
            name: { type: String, required: true },
            quantity: { type: Number, default: 1 }
        }],
        default: []
    },
    capturedPokemon: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pokemon' // Referência ao modelo de Pokémon
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 50'],
        default: []
    },
    knownPokemons: {
        type: [Number], // IDs da Pokédex conhecidos (PokeAPI)
        default: []
    }
}, {timestamps: true});

// Validação para limitar o tamanho do array capturedPokemon
function arrayLimit(val) {
    return val.length <= 50;
}

export default mongoose.model('User', userSchema);
