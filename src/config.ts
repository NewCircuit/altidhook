import * as fs from 'fs';
import * as yaml from 'js-yaml';

export type ServerConfig = {
  port: number;
  pubkey: string;
}

export type BotConfig = {
  roleID: string;
  token: string;
}

export default class Config {
  public readonly bot: BotConfig;

  public readonly server: ServerConfig;

  private static location = process.env.CONFIG || './config.yml';

  constructor() {
    this.server = {
      pubkey: '',
      port: 6942,
    }
    this.bot = {
      roleID: '787096008814493706',
      token: '',
    }
  }

  public static getConfig(): Config {
    const fileContents = fs.readFileSync(Config.location, 'utf-8');
    return yaml.load(fileContents) as Config;
  }
}
