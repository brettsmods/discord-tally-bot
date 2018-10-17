import {
    Message
} from "discord.js";
import DB from '../util/db';
import helper from '../util/cmd-helper';

const Tally = DB.tally;

export default (message: Message) => {
    const msg = message.content.split(' ');
    msg.shift(); // prefix
    msg.shift(); //command
    const tallyName = msg.shift();

    const dumpAmt = Number.parseInt(msg.shift());

    console.log(`Dumping [${tallyName}] by ${dumpAmt || 1}`);
    
    Tally.findOne({ where: {name: tallyName, channelId: message.channel.id}})
        .then((record: any) => {
            if (!record) {
                throw 'I couldn\'t find it in my system. Hmm... :thinking:';
            }
            return record;
        })
        .then((record: any) => {
            const amt = dumpAmt ? dumpAmt : 1;
            return Tally.update({
                    count: record.count - amt
                }, {
                    returning: true,
                    where: {
                        name: record.name,
                        channelId: message.channel.id
                    }
                })
                .then(() => {
                    record.previous = record.count;
                    record.count -= amt;
                    return record;
                });
        })
        .then((record) => {
            const description = record.description && record.description != '' ? record.description : undefined;
            const msg = {
                description: `
                **${record.name}**: ${record.previous} -> ${record.count}
                ${description ? '• _' + description + '_' : ''}
                dumped by **${message.author.tag}**
                `            
            };

            helper.finalize(message);

            message.channel.send(helper.buildRichMsg(msg));
        })
        .catch((err) => {
            const failMsg = {
                description: `I couldn't dump **${name}** because ${err}
                dump attempted by ${message.author.tag}**`
            }

            helper.finalize(message);

            message.channel.send(helper.buildRichMsg(failMsg));
        });
}