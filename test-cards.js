import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import fs from 'fs';

import { toCapitalize, getImageBase64 } from './src/lib/func/index.js'
import { typesArray } from './assets/types.js'
import { getPokemonCaptureRate, getPokemonFromPokeAPI, getRandomPokemonByGeneration } from './src/lib/pokemon/index.js'

const typesSpriteBaseURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/"

const backgroundImgLink = "https://wallpapercave.com/wp/wp2595124.jpg"

const createPokemonCard = async (pokemon) => {
    const { name, types, stats, imageUrl } = pokemon;

    let capture_rate = await getPokemonCaptureRate(name);
    let backColor = ""
    if(capture_rate <= 3){
      backColor = "rgb(29, 29, 29)" //"rgb(255, 230, 0)";
    } else if(capture_rate <= 30){
      backColor = "rgb(255, 8, 0)";
    } else if(capture_rate <= 45){
      backColor = "rgb(118, 0, 148)";
    } else if(capture_rate <= 90){
      backColor = "rgb(50, 0, 168)";
    } else if(capture_rate <= 190){
      backColor = "rgb(32, 161, 0)";
    } else {
      backColor = "rgb(150, 150, 150)";
    }

    // Configurações do canvas
    let width = 400;
    let height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fundo do card
    //ctx.fillStyle = 'rgb(102, 102, 102)';//'#4169e1'; 
    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, width, height);

    // Fundo atrás da imagem do Pokémon (retângulo)
    let backImgX = 10; // Posição X do retângulo
    let backImgY = 10; // Posição Y do retângulo
    let backImgWidth = 380; // Largura do retângulo
    let backImgHeight = 280; // Altura do retângulo
    let backgroundImg = await loadImage(backgroundImgLink)
    ctx.drawImage(backgroundImg, backImgX, backImgY, backImgWidth, backImgHeight);

    // Desenhar a imagem do Pokémon
    let image = await loadImage(imageUrl);
    ctx.drawImage(image, 50, 0, 300, 300);

    // Fundo atrás dos stats (retângulo)
    let rectX = 10; // Posição X do retângulo
    let rectY = 335; // Posição Y do retângulo
    let rectWidth = 380; // Largura do retângulo
    let rectHeight = 255; // Altura do retângulo

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Cor de fundo para o retângulo
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);


    // Nome do Pokémon
    ctx.fillStyle = '#333';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    let text = toCapitalize(name)
    // Adiciona borda ao texto
    ctx.strokeStyle = '#e0e0e0'; // Cor da borda
    ctx.lineWidth = 5; // Largura da borda
    ctx.strokeText(text, width / 2, 325);
    // ctx.fillText(toCapitalize(name), 20, 30);
    ctx.fillText(text, width / 2, 325
    );

    // Tipos
    ctx.textAlign = 'left';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    let typeIndex = typesArray.indexOf(types[0]);
    let typeImage = await loadImage(`${typesSpriteBaseURL}${typeIndex+1}.png`)
    ctx.drawImage(typeImage, 20, 350, 120, 20)
    //ctx.fillText(typesText, 30, 370);

    // Estatísticas
    let statsYStart = 395;
    ctx.font = '18px Arial';
    Object.entries(stats).forEach(([statName, statValue], index) => {
      switch (statName) {
        case "hp":
          statName = "HP";
          break;
        case "attack":
          statName = "ATK";
          break;
        case "defense":
          statName = "DEF";
          break;
        case "specialAttack": 
          statName = "ATK Esp.";
          break;
        case "specialDefense": 
          statName = "DEF Esp.";
          break;
        case "speed":
          statName = "SPD";
          break;
        default: throw new Error("Unknown statName");
      }

        ctx.fillText(`${statName}: ${statValue}`, 30, statsYStart + index * 22);
    });

    // Salvar o card como uma imagem
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./pokemon-card.png', buffer);
    console.log('Card criado: pokemon-card.png');
};

// Exemplo de dados de um Pokémon
const examplePokemon = {
  _id: "678e9ec757088903fe357d27",
  originalTrainerId: "675111c0ce795cd0ac1f76af",
  currentTrainerId: "675111c0ce795cd0ac1f76af",
  name: "krabby",
  pokedexId: 98,
  types: ["water"],
  stats: {
    hp: 30,
    attack: 105,
    defense: 90,
    specialAttack: 25,
    specialDefense: 25,
    speed: 50,
  },
  isLegendary: false,
  isMythical: false,
  abilities: [
    {
      ability: [
        {
          name: "hyper-cutter",
          url: "https://pokeapi.co/api/v2/ability/52/",
          _id: { $oid: "6760e1ec3a9e5cec0829c26f" },
        },
      ],
      is_hidden: "false",
      _id: { $oid: "6760e1ec3a9e5cec0829c26e" },
    },
    {
      ability: [
        {
          name: "shell-armor",
          url: "https://pokeapi.co/api/v2/ability/75/",
          _id: { $oid: "6760e1ec3a9e5cec0829c271" },
        },
      ],
      is_hidden: "false",
      _id: { $oid: "6760e1ec3a9e5cec0829c270" },
    },
    {
      ability: [
        {
          name: "sheer-force",
          url: "https://pokeapi.co/api/v2/ability/125/",
          _id: { $oid: "6760e1ec3a9e5cec0829c273" },
        },
      ],
      is_hidden: "true",
      _id: { $oid: "6760e1ec3a9e5cec0829c272" },
    },
  ],
  level: 1,
  experience: 0,
  evolution: { evolvesTo: "", evolutionLevel: null, method: "" },
  activeAbility: "",
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
  createdAt: { $date: { $numberLong: "1734402540150" } },
  updatedAt: { $date: { $numberLong: "1734402540150" } },
  __v: 0
};

const otherPokemon = {
  _id: { $oid: "6760e46032d3b7bcc0c89917" },
  originalTrainerId: { $oid: "675111c0ce795cd0ac1f76af" },
  currentTrainerId: { $oid: "675111c0ce795cd0ac1f76af" },
  name: "nidorina",
  pokedexId: 30,
  types: ["poison"],
  stats: {
    hp: 70,
    attack: 62,
    defense: 67,
    specialAttack: 55,
    specialDefense: 55,
    speed: 56,
  },
  isLegendary: false,
  isMythical: false,
  abilities: [
    {
      ability: [
        {
          name: "poison-point",
          url: "https://pokeapi.co/api/v2/ability/38/",
          _id: { $oid: "6760e46032d3b7bcc0c89919" },
        },
      ],
      is_hidden: "false",
      _id: { $oid: "6760e46032d3b7bcc0c89918" },
    },
    {
      ability: [
        {
          name: "rivalry",
          url: "https://pokeapi.co/api/v2/ability/79/",
          _id: { $oid: "6760e46032d3b7bcc0c8991b" },
        },
      ],
      is_hidden: "false",
      _id: { $oid: "6760e46032d3b7bcc0c8991a" },
    },
    {
      ability: [
        {
          name: "hustle",
          url: "https://pokeapi.co/api/v2/ability/55/",
          _id: { $oid: "6760e46032d3b7bcc0c8991d" },
        },
      ],
      is_hidden: "true",
      _id: { $oid: "6760e46032d3b7bcc0c8991c" },
    },
  ],
  level: 1,
  experience: 0,
  evolution: { evolvesTo: "", evolutionLevel: null, method: "" },
  activeAbility: "",
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png",
  createdAt: { $date: { $numberLong: "1734403168413" } },
  updatedAt: { $date: { $numberLong: "1734403168413" } },
  __v: 0,
};

let randomPokemon = await getRandomPokemonByGeneration(1);
let { name, id, types, stats, abilities, sprites } = randomPokemon;
let { data: speciesData} = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
let pokeApiData = await getPokemonFromPokeAPI(name);

let base64 = !randomPokemon ? null : await getImageBase64(sprites.front_default)

let pokeData = {
    originalTrainerId: "675111c0ce795cd0ac1f76af",
    currentTrainerId: "675111c0ce795cd0ac1f76af",
    name: name,
    pokedexId: id,
    types: types.map(i => i.type.name),
    stats: {
        hp: stats[0].base_stat,
        attack: stats[1].base_stat,
        defense: stats[2].base_stat,
        specialAttack: stats[3].base_stat,
        specialDefense: stats[4].base_stat,
        speed: stats[5].base_stat
    },isLegendary: speciesData.is_legendary,
    isMythical: speciesData.is_mythical,
    abilities: abilities,
    imageUrl: sprites.front_default
}

createPokemonCard(pokeData).catch(console.error);
