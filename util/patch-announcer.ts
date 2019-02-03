import path from 'path';
import DB from './db';
import helper from './cmd-helper';

export default class PatchAnnouncer {
    constructor() {}

    static async announcePatch(msg: any) {
        const server: any = await DB.Server.findOne({
            where: {
                id: msg.guild.id,
                patchNotesEnabled: true
            }
        });
        
        if (!server) return;
        if (server.lastPatchAnnounced === PatchAnnouncer.getCurrentVersion()) return;

        PatchAnnouncer.sendPatchMsg(msg.channel);
        server.lastPatchAnnounced = PatchAnnouncer.getCurrentVersion();
        await server.save();
    }

    static getCurrentVersion() {
        const { version } = require(path.resolve(__dirname, '../../package.json'));
        return version;
    }

    static sendPatchMsg(channel) {
        const richEmbed = {
            title: `:camera_with_flash: Tally Bot has been updated to v.${PatchAnnouncer.getCurrentVersion()} while you were gone!`,
            description: `See patch notes here: https://github.com/ryanpage42/discord-tally-bot/blob/master/CHANGELOG.md` +
            `\nThese alerts will only trigger once per update, per server.` +
            `\nDisable/Enable alerts with \`!tb patchnotes -off\` and \`!tb patchnotes -on\``
        }
        channel.send(helper.buildRichMsg(richEmbed));
    }
}