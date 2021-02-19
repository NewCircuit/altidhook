import express, {
  Application,
  NextFunction,
  Request,
  Response
} from 'express';
import Bot from "./bot";
import { createHmac } from 'crypto';
import { ServerConfig } from "./config";

export type AltIDHookReq = {
  member: {
    id: string,
    username: string,
    discriminator: string,
  },
  op: number,
  guild: {
    id: string,
    name: string,
  }
}

export const OP_CODES = {
  PASSED: 1,
}

export default class Server {
  private readonly app: Application;

  private readonly bot: Bot;

  private readonly config: ServerConfig;

  constructor(bot: Bot, config: ServerConfig) {
    this.app = express()
    this.bot = bot;
    this.config = config;
  }

  public start() {
    this.app.use('/', express.json());
    this.app.post('/', this.auth.bind(this));
    this.app.post('/', this.handle.bind(this));
    this.app.listen(
      this.config.port,
      () => console.log(`Listening on port ${this.config.port}`),
    );
  }

  private async auth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const digestHdr = req.header('Digest');

    if (digestHdr === undefined) {
      res.status(403);
      res.end();
      return;
    }

    try {
      const body = JSON.stringify(req.body);
      const digest = digestHdr.split('=')[1];
      const newDigest = createHmac(
        'md5',
        this.config.pubkey,
      ).update(body).digest('hex');

      if (digest !== newDigest) {
        res.status(403);
        res.end();
        return;
      }
    } catch (e) {
      console.error(`Failed to authenticate\n`, e);
      res.status(500);
      res.end();
      return;
    }

    next();
  }

  private async handle(req: Request, res: Response): Promise<void> {
    try {
      const body: AltIDHookReq = req.body;
      if (body.op !== OP_CODES.PASSED) {
        res.status(200);
        res.end();
        return;
      }

      await this.bot.addRole(body);
    } catch (e) {
      console.log(`An error occurred while granting a role`, e);
    } finally {
      res.status(200);
      res.end();
    }
  }
}
