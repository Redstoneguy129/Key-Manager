import Command from "./command";
import {
    ApplicationCommandOptions,
    ApplicationCommandOptionsBoolean,
    ApplicationCommandOptionsInteger,
    ApplicationCommandOptionsUser
} from "oceanic.js/dist/lib/types/applications";
import CommandInteraction from "oceanic.js/dist/lib/structures/CommandInteraction";
import {ApplicationCommandOptionTypes} from "oceanic.js";
import {createKey, getProducts} from "../lib/cryptolens";

export default class Mint extends Command {
    description: string = "Mint a license key";
    name: string = "mint";

    async getOptions(): Promise<Array<ApplicationCommandOptions>> {
        const products = await getProducts();
        const productOptions: ApplicationCommandOptionsInteger = {
            type: ApplicationCommandOptionTypes.INTEGER,
            name: "product",
            description: "The product to mint a license key for",
            required: true,
            choices: products.map(product => {
                    return {
                        name: product.name,
                        value: product.id
                    }
                }
            )
        };
        const customer: ApplicationCommandOptionsUser = {
            type: ApplicationCommandOptionTypes.USER,
            name: "customer",
            description: "The customer to associate the license key with",
            required: true
        };
        const isTrial: ApplicationCommandOptionsBoolean = {
            type: ApplicationCommandOptionTypes.BOOLEAN,
            name: "trial",
            description: "Whether the license key is a trial key",
            required: false
        };
        return [productOptions, customer, isTrial];
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const product = interaction.data.options.getInteger("product");
        const customer = interaction.data.options.getUser("customer");
        const isTrial = interaction.data.options.getBoolean("trial") ?? false;
        const key = await createKey(product!, customer!.id, isTrial);
        await interaction.createFollowup({content: `Minted key ${key}`});
    }
}