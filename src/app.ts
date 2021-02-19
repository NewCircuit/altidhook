import Config from "./config";
import Bot from "./bot";
import Server from "./server";

async function main() {
  const config = Config.getConfig();
  const bot = new Bot(config.bot);
  await bot.login();
  const server = new Server(bot, config.server);
  server.start();
}

main().catch(console.error);
