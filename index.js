require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// palabras clave
const combinaciones = [
  {
    palabras: ["regalo", "misterioso"],
    respuesta: "...",
  },
  {
    palabras: ["donde", "esta"],
    respuesta: "...",
  },
  {
    palabras: ["palabra clave 1", "palabra clave 2"],
    respuesta: "...",
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
  const match = combinaciones.find((c) =>
    c.palabras.every((p) => contienePalabra(texto, p)),
  );

  if (match) {
    try {
      await message.reply(combinaciones.respuesta);
    } catch (err) {
      console.error("Error al responder:", err);
    }
  }
});

client.login(process.env.TOKEN);