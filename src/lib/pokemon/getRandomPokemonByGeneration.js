import axios from "axios";

export async function getRandomPokemonByGeneration(generation) {
    try {
  
      let pokemonName;
      let pokemonSpawnRate;
      let randomSpawnRate = Math.floor(Math.random() * 255);
  
      do {
  
        let response = await axios.get(`https://pokeapi.co/api/v2/generation/${generation}`);
        let randomPokemon = Math.floor(Math.random() * response.data.pokemon_species.length);
  
        pokemonName = response.data.pokemon_species[randomPokemon].name;
  
        response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
  
        let pokemon_species = response.data;
        pokemonSpawnRate = pokemon_species.capture_rate;
  
      } 
      while (pokemonSpawnRate > randomSpawnRate);
  
      let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      return response.data;
  
    } catch (e) {
      console.error(e);
    }
}