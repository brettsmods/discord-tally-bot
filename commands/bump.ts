import {
    Message
} from "discord.js";
import DB from '../util/db';
import helper from '../util/cmd-helper';
import { increaseTotalBumpCount } from '../util/counter';

const Tally = DB.Tally;

export default (message: Message) => {
    const msg = message.content.split(' ');
    msg.shift(); // rm prefix
    msg.shift(); // rm command
    let tallyName = msg.shift();
    let bumpAmt: number = Number.parseInt(msg.shift());

    console.log(`Bumping [${tallyName}] by ${bumpAmt || 1}`);

    Tally.findOne({where: {name: tallyName, channelId: message.channel.id}})
        .then((record: any) => {
            if (!record) {
                throw 'I couldn\'t find it. Check your spelling? :thinking:';
            }
            return record;
        })
        .then((record: any) => {
            const amt: number = bumpAmt ? bumpAmt : 1;
            return Tally.update({
                count: record.count + amt
            }, {
                returning: true,
                where: {
                    name: record.name,
                    channelId: message.channel.id
                }
            })
            .then(() => {
                record.previous = record.count;
                record.count += amt;
                return record;
            });
        })
        .then((record) => {
            const userEmojis = [
                ':spy:', ':upside_down:', ':poop:', ':ghost:', ':astonished:', ':pray:', ':fist:',
                ':tongue:', ':santa:', ':crown:', ':right_fist:'
            ]
            const description = record.description && record.description != '' ? record.description : undefined;
            const msg = {
                description: 
                `**${record.name}** | **${record.previous}** >>> **${record.count}** ${(description ? '\n• _' + description + '_' : '')}
                \n${helper.getRandomPhrase(userEmojis)} **${message.author.tag}**
                `
            }


            increaseTotalBumpCount();
            helper.finalize(message);
            message.channel.send(helper.buildRichMsg(msg));
        })
        .catch((err) => {
            const msg = {
                description: `I couldn't bump ${tallyName} because ${err}
                bump attempted by **${message.author.tag}**`
            }
            helper.finalize(message);
            message.channel.send(helper.buildRichMsg(msg));
        });
}
