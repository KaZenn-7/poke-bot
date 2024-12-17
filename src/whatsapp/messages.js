import baileys from "@whiskeysockets/baileys";
import { getPokemonFromPokeAPI, getRandomPokemonByGeneration } from "../lib/pokemon/index.js"
import { getImageBase64 } from "../lib/func/base64.js"
import { createUser, getUserByWhatsappId, addItemToInventory, addPokemon, addToPokedex} from "../database/userService.js";

const prefix = "/";

const numerodono = ["5511952997031"];

const ban = [];

export async function startWhats(upsert, conn, qrcode, sessionStartTim) {
  try {
    for (const info of upsert?.messages || []) {
      const from = info.key.remoteJid;
      const isGroup = from.endsWith("@g.us");

      if (upsert.type === "append") return;
      if (!info.message) return;

      const type = baileys.getContentType(info.message);
      const pushname = info.pushName ? info.pushName : "";

      //==============(BODY)================\\

      var body =
        info.message?.conversation ||
        info.message?.viewOnceMessageV2?.message?.imageMessage?.caption ||
        info.message?.viewOnceMessageV2?.message?.videoMessage?.caption ||
        info.message?.imageMessage?.caption ||
        info.message?.videoMessage?.caption ||
        info.message?.extendedTextMessage?.text ||
        info.message?.viewOnceMessage?.message?.videoMessage?.caption ||
        info.message?.viewOnceMessage?.message?.imageMessage?.caption ||
        info.message?.documentWithCaptionMessage?.message?.documentMessage
          ?.caption ||
        info.message?.buttonsMessage?.imageMessage?.caption ||
        info.message?.buttonsResponseMessage?.selectedButtonId ||
        info.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        info.message?.templateButtonReplyMessage?.selectedId ||
        info?.text ||
        "";

      var budy =
        info?.message?.conversation ||
        info?.message?.extendedTextMessage?.text ||
        "";

      var budy2 = body
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const args = body.trim().split(/ +/).slice(1);

      const isCmd = body.trim().startsWith(prefix);

      let command = isCmd
        ? budy2.trim().slice(1).trim().split(" ")[0].trim().toLocaleLowerCase()
        : null;

      const q = args.join(" ");

      //======================================\\

      try {
        var groupMetadata = isGroup ? await conn.groupMetadata(from) : "";
      } catch {
        return;
      }

      const groupName = isGroup ? groupMetadata.subject : "";

      const SNET = "@s.whatsapp.net";

      const sender = isGroup
        ? info.key.participant.includes(":")
          ? info.key.participant.split(":")[0] + SNET
          : info.key.participant
        : info.key.remoteJid;

      const getGroupAdmins = (participants) => {
        let admins = [];

        for(let i of participants) {
          if(i.admin == "admin" || i.admin == "superadmin") admins.push(i.id);
        }

        return admins;
      }

      const botId = conn.user.id.split(":")[0] + SNET;
      const botNumber = conn.user.id.split(":")[0];

      const groupDesc = isGroup ? groupMetadata.desc : "";

      const groupMembers = isGroup ? groupMetadata.participants : "";

      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";

      //=======================================\\

      //=======(ADMS/DONO/ETC..CONST)========\\

      const dispositivo =
        info.key.id.length > 21
          ? "Android"
          : info.key.id.substring(0, 2) == "3A"
          ? "iOS"
          : "WhatsApp Web";

      const isBot = info.key.fromMe ? true : false;

      const SoDono = numerodono.includes(sender) || isBot;

      const isBotGroupAdmins = groupAdmins.includes(botId) || false;

      const isGroupAdmins = groupAdmins.includes(sender) || SoDono;

      const isBanned = ban.includes(sender);

      const isConsole = true;

      const isAnticall = true;

      const isAntiPv = false;

      //=======================================\\

      //==========(VERIFICADO)===============\\

      let selo = info;

      //BOT OFF
      if (!isCmd && info.key.fromMe) return; // Ignorar comandos do bot.

      const reply = (texto) => {
        conn.sendMessage(from, { text: texto }, { quoted: info }).catch((e) => {
          return reply("Erro..");
        });
      };

      if (
        isGroup &&
        isBotGroupAdmins &&
        !isGroupAdmins &&
        !SoDono &&
        !info.key.fromMe
      ) {
        if (menc_jid2?.length >= groupMembers.length - 1) {
          conn.sendMessage(from, {
            text: "Membro comum com mensagem de marcação de todos do grupo, por conta disso irei remover do grupo, qualquer coisa entre em contato com um administrador...",
          });
          conn.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: info.key.id,
              participant: sender,
            },
          });
          conn.groupParticipantsUpdate(from, [sender], "remove");
        }
      }

      //=======================================\\

      //=========(isQuoted/consts)=============\\
      const isImage = type == "imageMessage";
      const isVideo = type == "videoMessage";
      const isAudio = type == "audioMessage";
      const isSticker = type == "stickerMessage";
      const isContact = type == "contactMessage";
      const isLocation = type == "locationMessage";
      const isProduct = type == "productMessage";

      var typeMessage = body.substr(0, 50).replace(/\n/g, "");
      if (isImage) typeMessage = "Image";
      else if (isVideo) typeMessage = "Video";
      else if (isAudio) typeMessage = "Audio";
      else if (isSticker) typeMessage = "Sticker";
      else if (isContact) typeMessage = "Contact";
      else if (isLocation) typeMessage = "Location";
      else if (isProduct) typeMessage = "Product";

      if (isConsole) {
        if (isCmd && !isGroup) {
          console.log(`
  ╭──────────────────────────────────
  │
  │  USUÁRIO: ${pushname}
  │
  │  NÚMERO: ${sender.split("@")[0]}  
  │
  │  COMANDO:「 ${command} 」
  │
  ╰─────────────────────────────────  `);
        } else if (isCmd && isGroup) {
          console.log(`
  ╭──────────────────────────────────
  │
  │  USUÁRIO: ${pushname}
  │
  │  NÚMERO: ${sender.split("@")[0]} 
  │
  │  GRUPO: ${groupName} 
  │
  │  COMANDO:「 ${command} 」
  │
  ╰─────────────────────────────────`);
        } else if (!isCmd) {
          console.log(`
  ╭──────────────────────────────────
  │
  │  USUÁRIO: ${pushname}
  │
  │  NÚMERO: ${sender.split("@")[0]} 
  │
  │  MENSAGEM 
  │
  ╰─────────────────────────────────`);
        }
      }

      //============(EVAL-EXECUÇÕES)===========\\

      if (budy.startsWith(">")) {
        try {
          if (info.key.fromMe) return;
          if (!SoDono) return;
          console.log(
            "[",
            colors.cyan("EVAL"),
            "]",
            colors.yellow(
              moment(info.messageTimestamp * 1000).format("DD/MM HH:mm:ss")
            ),
            colors.green(budy)
          );
          return conn
            .sendMessage(from, {
              text: JSON.stringify(eval(budy.slice(2)), null, "\t"),
            })
            .catch((e) => {
              return reply(String(e));
            });
        } catch (e) {
          return reply(String(e));
        }
      }

      if (budy.startsWith("(>")) {
        try {
          if (info.key.fromMe) return;
          if (!SoDono) return;
          var konsol = budy.slice(3);
          Return = (sul) => {
            var sat = JSON.stringify(sul, null, 2);
            bang = util.format(sat);
            if (sat == undefined) {
              bang = util.format(sul);
            }
            return conn.sendMessage(from, { text: bang }, { quoted: info });
          };

          conn
            .sendMessage(from, {
              text: util.format(eval(`;(async () => { ${konsol} })()`)),
            })
            .catch((e) => {
              return reply(String(e));
            });
          console.log(
            "\x1b[1;37m>",
            "[",
            "\x1b[1;32mEXEC\x1b[1;37m",
            "]",
            time,
            colors.green(">"),
            "from",
            colors.green(sender.split("@")[0]),
            "args :",
            colors.green(args.length)
          );
        } catch (e) {
          return reply(String(e));
          console.log(e);
        }
      }

      if (body.startsWith("$")) {
        if (info.key.fromMe) return;
        if (!SoDono) return;
        exec(q, (err, stdout) => {
          if (err) return reply(`${err}`);
          if (stdout) {
            reply(stdout);
          }
        });
      }

      //========(ANTI-PV-QUE-BLOQUEIA)======\\

      var BLC_CL = [];
      if (isAntiPv && !BLC_CL.includes(sender)) {
        if (!isGroup && !SoDono && !isnit && !isPremium) {
          await sleep(2500);
          reply(msgantipv1);
          setTimeout(async () => {
            conn.updateBlockStatus(sender, "block");
          }, 2000);
          return;
        }
        BLC_CL.push(sender);
      }

      // ANTI_LIGAR \\
      var BLC_ANTCL = [];
      if (!isGroup && isAnticall && !BLC_ANTCL.includes(sender)) {
        conn.ws.on("CB:call", async (B) => {
          if (B.content[0].tag == "offer") {
            conn
              .sendMessage(B.content[0].attrs["call-creator"], {
                text: "PROGRAMAÇÃO DE BLOQUEAR USUARIOS POR EFETUAR LIGAÇÃO PARA O BOT...",
              })
              .then(() => {
                conn.updateBlockStatus(
                  B.content[0].attrs["call-creator"],
                  "block"
                );
              });
          }
        });
        BLC_ANTCL.push(sender);
      }

      //======================================\\

      if (isBanned) return;

      let user = await getUserByWhatsappId(sender)

      //INICIO DE COMANDO DE PREFIXO
      switch (command) {

        case "ping": {
          reply("pong!");
          break;
        }

        case "pokedex": 
        case "dex":{
          if(!user) return reply(`Você ainda não está registrado!\n Utilize: ${prefix}reg`)
          if(!q) return reply(`Por favor, forneça o nome ou id de um pokémon para pesquisa-lo.\nEx: ${command} pikachu`);
          if(args.length > 1) return reply(`Por favor, buesque apenas um pokemon por vez.\nEx: ${command} pikachu`);
          try {
            let pokemon = await getPokemonFromPokeAPI(q);
            let base64 = !pokemon ? null : await getImageBase64(pokemon.imageURL)

            if(!user.knownPokemons.includes(pokemon.pokemonData.id)) await addToPokedex(sender, pokemon);

            conn.sendMessage(from, { text:  pokemon.message, contextInfo: {
              externalAdReply: {
                title: `🌟 ${pokemon.pokemonData.name.toUpperCase()} 🌟`,
                body: ``,
                previewType: `PHOTO`,
                thumbnail: base64
              }
            }})
          } catch(e) {
            reply("Erro ao buscar pokemon, verifique se digitou corretamente o nome!")
            console.error(e)
            return;
          }

          break;
        }

        case "hunt":
          case "caçar":
          case "cacar": {
            if(!user) return reply(`Você ainda não está registrado!\n Utilize: ${prefix}reg`)
              
            let randomPokemon = await getRandomPokemonByGeneration(1);
            let base64 = !randomPokemon ? null : await getImageBase64(randomPokemon.sprites.front_default)
  
              conn.sendMessage(from, { text:  "pokemon.message", contextInfo: {
              externalAdReply: {
                sourceUrl: `https://wa.me/${botNumber}?text=/catch%20${pokemon}`,
                title: `🌟 ${randomPokemon.name.toUpperCase()} 🌟`,
                body: ``,
                previewType: `PHOTO`,
                thumbnail: base64
              }
            }})
          
            break;
          }

        case "reg": {
            if(!user) await createUser(sender, pushname).then(reply(`Parabéns ${pushname}! Agora você está registrado.`))
            reply(`Você ja está registrado como "${user.name}"`)
          break;
        }

        default:
          if (isCmd) {
            return;
            uptime = process.uptime();
            conn.sendMessage(
              from,
              {
                text: `
  ────────────────────────
  
  ◈• Erro: Comando '${budy}' não encontrado.
  ◈• Dica: Digite '${prefix}menu' e leia com atenção.
  
  ────────────────────────
  `,
                mentions: [sender],
              },
              { quoted: selo }
            );
          }
        //========================================\\
      }
    }
  } catch (e) {
    console.log(e);
  }
}