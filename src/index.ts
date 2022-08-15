import { Break, PrismaClient } from "@prisma/client";
import { Interaction, Client, Intents, MessageEmbed } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const db = new PrismaClient();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "break") {
    const channel = interaction.guild?.members.cache.get(interaction.user.id)
      ?.voice.channel;

    if (!channel) {
      interaction.reply({
        ephemeral: true,
        content:
          "You have to be connected to a voice channel to use this command",
      });

      return;
    }

    if (channel.members.size === 1) {
      interaction.reply({
        ephemeral: true,
        content: "You can't break the channel if there is only you in it",
      });

      return;
    }

    const breakInstance = await db.break.create({
      data: {},
    });

    await Promise.all(
      channel.members.map((member) =>
        db.breakMember.create({
          data: {
            userId: member.user.id,
            breakId: breakInstance.id,
          },
        })
      )
    );
  }
});

async function renderBreakEmbed(breakInstance: Break): Promise<MessageEmbed> {
  const embed = new MessageEmbed();

  const members = await db.breakMember.findMany({
    where: { breakId: breakInstance.id },
  });

  const ready = !members.some((member) => !member.ready);

  ready ? embed.setColor("#ffbb2a") : embed.setColor("#61db1a");

  // WIP

  return embed;
}

client.login(process.env.BOT_TOKEN!);
