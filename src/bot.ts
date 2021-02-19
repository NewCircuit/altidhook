import { Client } from 'discord.js';
import { AltIDHookReq } from "./server";
import { BotConfig } from "./config";

export default class Bot extends Client {
  private readonly config: BotConfig;

  constructor(config: BotConfig) {
    super();
    this.config = config;
  }

  public async login(): Promise<string> {
    return super.login(this.config.token);
  }

  public async addRole(body: AltIDHookReq): Promise<void> {
    const guild = await this.guilds.fetch(body.guild.id);
    const member = await guild.members.fetch(body.member.id);
    await member.roles.add(this.config.roleID);
    console.log(`Gave ${member.user.tag} verified role`);
  }
}
