import {
    Message
} from "discord.js";
import DB from '../util/db';
import helper from '../util/cmd-helper';

const Tally = DB.tally;

export default (message: Message) => {
    let content = helper.removePrefixCommand(message.content, 2);
    let cArr = content.split(' ');
    let tallyId = cArr.shift();

    Tally.findById(tallyId)
        .then((record: any) => {
            if (!record) {
                message.channel.send('Could not find Tally with ID: ' + tallyId);
                return;
            }
            return record;
        })
        .then((record: any) => {
            return Tally.update({
                    count: 0
                }, {
                    returning: true,
                    where: {
                        id: record.id
                    }
                })
                .then(() => record);
        })
        .then((record) => {
            message.channel.send('You just emptied **' + record.id + '** and set it to 0. Sure hope that wasn\'t on accident! :thinking:');
        });
}