import {
    Sequelize,
    DataTypes
} from 'sequelize';

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    return sequelize.define('tally', {
        name: {
            type: DataTypes.STRING
        },
        channelId: DataTypes.STRING,
        serverId: DataTypes.STRING,
        userId: DataTypes.STRING,
        description: DataTypes.STRING(5000),
        count: DataTypes.BIGINT,
        keyword: DataTypes.STRING,
        bumpOnKeyword: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isGlobal: DataTypes.BOOLEAN,
        isDm: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        base64Encoded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdOn: DataTypes.DATE,
        lastAction: DataTypes.DATE
    }, {
        timestamps: false,
        indexes: [{
            fields: ['name', 'channelId', 'serverId', 'userId', 'isGlobal', 'isDm'],
            unique: true
        }]
    });
}