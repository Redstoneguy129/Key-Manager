import Command from "./command";
import {ApplicationCommandOptions, ApplicationCommandOptionsString} from "oceanic.js/dist/lib/types/applications";
import CommandInteraction from "oceanic.js/dist/lib/structures/CommandInteraction";
import {ApplicationCommandOptionTypes} from "oceanic.js";
import {burnKey, getProducts} from "../lib/cryptolens";

export default class Burn extends Command {
    description: string = "Burn a license key";
    name: string = "burn";

    async getOptions(): Promise<Array<ApplicationCommandOptions>> {
        const key: ApplicationCommandOptionsString = {
            type: ApplicationCommandOptionTypes.STRING,
            name: "license",
            description: "The license key to burn",
            required: true,
        }
        return [key];
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const key = interaction.data.options.getString("license");
        const products = await getProducts();
        const results = await Promise.all(products.map(product => burnKey(product.id, key!)));
        const success = results.some(result => result);
        await interaction.createFollowup({content: success ? `Burned key ${key}` : `Failed to burn key ${key}`});
    }
}