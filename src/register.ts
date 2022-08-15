import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("break")
    .setDescription("Set the team on a break"),
];

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN!);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_CLIENT!,
        process.env.BOT_GUILD!
      ),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
