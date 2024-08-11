require('dotenv').config({ path: ['.env.development', '.env' ], override: true })

import {ApplicationCommandTypes, Client, InteractionTypes, MessageFlags} from "oceanic.js";
import Commands from "./commands";

const client = new Client({
    auth: "Bot " + process.env.BOT_TOKEN,
    gateway: {
        intents: ["GUILDS"]
    }
});

const commands: InstanceType<typeof Commands[number]>[] = Commands.map(Command => new Command());

client.on("ready", async () => {
    const existingCommands = await client.application.getGuildCommands(process.env.GUILD_ID || "");
    const perms = {
        defaultMemberPermissions: "8",
        dmPermission: false
    }
    await client.application.bulkEditGuildCommands(process.env.GUILD_ID || "", existingCommands.map(cmd => {
        const command = commands.find(c => c.name === cmd.name);
        return {
            id: cmd.id,
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: command?.name || cmd.name,
            description: command?.description || cmd.description,
            options: command?.options || cmd.options,
            ...perms
        }
    }));
    for await (const command of commands.filter(cmd => !existingCommands.find(c => c.name === cmd.name))) {
        await client.application.createGuildCommand(process.env.GUILD_ID || "", {
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: command.name,
            description: command.description,
            options: command.options,
            ...perms
        });
    }
    console.log("Ready as", client.user.tag);
});

client.on("interactionCreate", async interaction => {
    if (interaction.type !== InteractionTypes.APPLICATION_COMMAND) return;
    const command = commands.find(cmd => cmd.name === interaction.data.name);
    if (!command) return;
    await interaction.defer((command.EPHEMERAL ? MessageFlags.EPHEMERAL : undefined));
    if (interaction.data.type !== ApplicationCommandTypes.CHAT_INPUT) return;
    await command.execute(interaction);
});

client.connect();