import {ApplicationCommandOptions} from "oceanic.js/dist/lib/types/applications";
import CommandInteraction from "oceanic.js/dist/lib/structures/CommandInteraction";

export default abstract class Command {
    public abstract name: string;
    public abstract description: string;
    public options: Array<ApplicationCommandOptions> = [];
    public EPHEMERAL: boolean = false;

    constructor() {
        (async () => {
            this.options = await this.getOptions();
        })();
    }

    public async getOptions(): Promise<Array<ApplicationCommandOptions>> {
        return [];
    }

    public abstract execute(interaction: CommandInteraction): Promise<void>;
}