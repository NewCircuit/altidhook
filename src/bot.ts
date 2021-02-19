import { Client, TextChannel } from 'discord.js';
import { AltIDHookReq } from "./server";
import { BotConfig } from "./config";

export default class Bot extends Client {
  private readonly config: BotConfig;

  constructor(config: BotConfig) {
    super();
    this.config = config;
  }

  public async login(): Promise<string> {
    this.on('ready', this.onReady.bind(this));
    return super.login(this.config.token);
  }

  public async addRole(body: AltIDHookReq): Promise<void> {
    try {
      const guild = await this.guilds.fetch(body.guild.id);
      const member = await guild.members.fetch(body.member.id);
      if (!member.roles.cache.has(this.config.roleID)) {
        await member.roles.add(this.config.roleID);
      }
      console.log(`Gave ${member.user.tag} verified role`);
    } catch (e) {
      console.error(`Failed to grant ${body.member.id} the role\n`, e);
      await this.fail(body);
    }
  }

  private async fail(body: AltIDHookReq): Promise<void> {
    const message = `Failed to verify <@${body.member.id}>`;
    const chanOpt = await this.channels.fetch(this.config.failChan);
    const channel = chanOpt as TextChannel;

    await channel.send(message);
  }

  private onReady() {
    console.log(`Ready as ${this.user?.tag || ''}`);
  }
}
