import Discord, { Message, Guild, Client } from 'discord.js';
import DBL from 'dblapi.js';
import dotenv from 'dotenv';
dotenv.config();
import Config from './util/config';
import ConfigPrivate from './util/config-private';
import DB from './util/db';
import KeywordUtil from './util/keyword-util';
import cmdHelper from './message/msg-helper';
import CommandManager from './message/command-manager';
import logger from './util/logger';
import DmManager from './message/dm-manager';
import Env from './util/env';
import UserUtil from './util/user';
import HealthCheckServer from './util/healthcheck-server';
import CronDeployer from './util/cron-deployer';
import ShardUtil from './util/shard-util';

class Bot {
    static shardId = Number.parseInt(process.env.SHARD_ID) || 0;
    static shardCount = Number.parseInt(process.env.SHARD_COUNT) || 1;
    static client: Client = new Discord.Client({
        messageCacheLifetime: 60,
        messageSweepInterval: 5 * 60,
        shardId: Bot.shardId,
        shardCount: Bot.shardCount
    });
    static healthcheck = new HealthCheckServer(Bot.client);
    static commandManager: CommandManager = new CommandManager(Bot.client);
    static topgg = Env.isProduction() ? new DBL(ConfigPrivate.dbots_token, Bot.client) : null;
    static db: DB = new DB();
    static initialReady: boolean = true;

    static async start() {
        try {
            await Bot.setup();
            setTimeout(() => {
                logger.info('triggering ready manually');
                const c: any = Bot.client;
                c.ws.connection.triggerReady()
            }, 30000);
            await Bot.client.login(ConfigPrivate.token);
            Bot.healthcheck.start();
        } catch (e) {
            logger.error(`Bot errored while starting up.`, e);
        }
    }

    static async setup() {
        await Bot.db.init();
        await KeywordUtil.loadKeywordServersToCache();
        await Bot.setupEvents();
    }

    static setupEvents() {
        Bot.client.on('ready', async () => {
            try {
                logger.info(`Tally Bot has been started successfully in ${process.env.NODE_ENV || 'development'} mode.`);
                logger.info(`shard ID [${process.env.SHARD_ID}] total shards [${process.env.SHARD_COUNT}]`);
                if (!Bot.initialReady) return;
                setTimeout(() => Bot.startBroadcasting(), 5000);
                // we have to wait to init once login is complete
                await Bot.db.initServers(Bot.client.guilds);
                await Bot.db.normalizeTallies(Bot.client.channels);
                await CronDeployer.deployActiveAnnouncements();
                Bot.initialReady = false;
            } catch (e) {
                logger.error(`An error occured while running post-launch behavior.`, e);
            }
        });

        Bot.client.on('message', async (message: Message) => {
            try {
                const isBot = message.author.bot;
                if (isBot) return;

                if (message.channel.type == 'dm') {
                    await UserUtil.init(message.author.id, message.author.tag);
                    return DmManager.handle(message);
                }

                const startsWithPrefix = message.content.startsWith(Config.prefix);
                if (!startsWithPrefix) {
                    KeywordUtil.bumpKeywordTallies(message);
                    return;
                }

                logger.info(message.content);
                await UserUtil.init(message.author.id, message.author.tag);
                await Bot.db.initServer(message.guild.id);
                await Bot.commandManager.handle(message);
            } catch (e) {
                logger.info(`Error while inbounding message: ` + e);
                if (e.toString().includes('invalid command')) {
                    const richEmbed = {
                        description: `Invalid command used.`,
                    };
                    message.channel.send(cmdHelper.buildRichMsg(richEmbed));
                }
            }
        });

        Bot.client.on('guildCreate', async (guild: Guild) => {
            await guild.owner.send(`
            Thank you for adding Tally Bot to your server. :fist: If you did not add me, then
            someone has invited me to your server on your behalf.
        
            For help and commands https://github.com/ryanpag3/discord-tally-bot/blob/master/README.md
        
            Please take 5 seconds to upvote the bot here https://top.gg/bot/494241511714586634/vote
        
            I am always looking to improve the bot, please feel free to send feedback!
            `);
        });

        Bot.client.on('error', function (error) {
            logger.error(`client's WebSocket encountered a connection error`, error);
        });

        Bot.client.on('warn', function (info) {
            logger.info(`warn: ${info}`);
        });

        Bot.client.on('reconnecting', function (info) {
            logger.info(`reconnecting`);
        });

        Bot.client.on('resume', function () {
            logger.info('bot has successfully reconnected');
        });

        Bot.client.on('disconnect', function (event) {
            logger.info(`The WebSocket has closed and will no longer attempt to reconnect`);
            process.exit(1);
        });
    }

    static startBroadcasting() {
        if (Bot.client.user == null) process.exit(1);

        const statusGenerators = [
            async () => {
                let users = 0;
                Bot.client.guilds.map(guild => (users += guild.members.size));
                await ShardUtil.storeShardUserCount(Bot.shardId, users, Bot.shardCount);
                const totalUsers = await ShardUtil.getTotalUsers();
                await ShardUtil.storeShardServerCount(Bot.shardId, Bot.client.guilds.size, Bot.shardCount);
                const totalServers = await ShardUtil.getTotalServers();
                Bot.client.user.setActivity(`!tb help | servers: ${totalServers} | users: ${totalUsers}`);
                if (Bot.topgg) Bot.topgg.postStats(totalServers);

            }
        ];

        let i = 0;
        setInterval(
            () => {
                if (i == statusGenerators.length) i = 0;
                statusGenerators[i]();
                i++;
            },
            process.env.NODE_ENV == 'production' ? Config.status.interval : Config.status.interval_dev
        );
    }
}

Bot.start();
