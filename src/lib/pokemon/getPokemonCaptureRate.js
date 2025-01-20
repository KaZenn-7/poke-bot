import axios from 'axios';

export async function getPokemonCaptureRate(nameOrId){
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`);
    return data.capture_rate;
} 