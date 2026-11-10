require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// palabras clave
// Cada combinación tiene "grupos": un array de grupos de sinónimos.
// El bot responde si aparece AL MENOS UNA palabra de CADA grupo.
const combinaciones = [
  {
    grupos: [["regalo", "regalos", "regalito", "regalitos"]],
    respuesta: "Nyo hay regalos por código disponibles.",
  },
  {
    grupos: [["donde", "dónde"], ["esta", "está"]],
    respuesta:
      "Para guias de pokémon y objetos visita: https://pokemonperseida.blogspot.com/p/gs-vitro-documentacion.html ",
  },
  {
    grupos: [["palabra clave 1"], ["palabra clave 2"]],
    respuesta: "respuesta 3",
  },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Este tiene que ir activo en el Developer Portal
  ],
});

// Pasa por alto tildes y mayúsculas.
const normalizar = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Buscar palabras completas sin confundir con palabras o frases a medias.
const contienePalabra = (texto, palabra) => {
  const p = normalizar(palabra).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9ñ])${p}($|[^a-z0-9ñ])`, "i").test(texto);
};

client.once("clientReady", () => {
  console.log(`Listo! Conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // ignora mensajes de bots
  if (!message.guild) return; // ignora mensajes por DM

  const texto = normalizar(message.content);

  // Coincide si en CADA grupo aparece al menos UNA de sus palabras.
  const match = combinaciones.find((c) =>
    c.grupos.every((grupo) => grupo.some((p) => contienePalabra(texto, p)))
  );

  if (match) {
    try {
      await message.reply(match.respuesta);
    } catch (err) {
      console.error("Error al responder:", err);
    }
  }
});

// Establecimiento de una conexión a HTTP para servicio web óptimo.
const http = require("http");
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("Bot activo");
  })
  .listen(PORT, () => console.log(`🌐 Servidor HTTP en puerto ${PORT}`));

client.login(process.env.TOKEN);