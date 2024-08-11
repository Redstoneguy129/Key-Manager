import Command from "./command";
import CommandInteraction from "oceanic.js/dist/lib/structures/CommandInteraction";
import {MintCommand} from ".";
import {ApplicationCommandTypes} from "oceanic.js";

export default class Refresh extends Command {
    description: string = "Refresh products";
    name: string = "refresh";
    EPHEMERAL: boolean = true;

    async execute(interaction: CommandInteraction): Promise<void> {
        const mintCommandId = (await interaction.application!.getGuildCommands(process.env.GUILD_ID || "")).find(cmd => cmd.name === "mint")?.id;
        const mintCommand = new MintCommand();
        await interaction.application!.editGuildCommand(process.env.GUILD_ID || "", mintCommandId!, {
            id: mintCommandId,
            type: ApplicationCommandTypes.CHAT_INPUT,
            name: mintCommand.name,
            description: mintCommand.description,
            options: await mintCommand.getOptions(),
            defaultMemberPermissions: "8",
            dmPermission: false
        });
        // @ts-ignore
        await interaction.createFollowup({content: `Refreshed.\n${mintCommand.options[0].choices?.map(choice => `[${choice.name}](<https://app.cryptolens.io/Product/Detail/${choice.value}>)`).join("\n")}`});
    }
}