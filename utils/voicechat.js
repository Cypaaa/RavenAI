const { OpusEncoder } = require("@discordjs/opus");

module.exports.SaveVC = (...args) => {
    args.forEach(conn => {
        process.discord.voice[conn.joinConfig.guildId] = conn;
    });
};

module.exports.GetVC = (guildid) => {
    if (guildid)
        return process.discord.voice[guildid];
    return process.discord.voice;
};

module.exports.GetVCChanId = (guildid) => {
    return process.discord.voice[guildid].joinConfig.channelId;
};

module.exports.DestroyVC = (guildid) => {
    process.discord.voice[guildid].destroy();
    process.discord.voice[guildid] = null;
};

module.exports.Subscribe = (vcMember, callback) => {
    const encoder = new OpusEncoder(48000, 1);
    const connection = this.GetVC(vcMember.guild.id);
    let stream = connection.receiver.subscribe(vcMember.id, {
        end: "manual",
    });
    let buffer = [];
    let chunknb = 0;

    stream.on("data", async (chunk) => {
        let chunknow = chunknb;
        buffer.push(encoder.decode(chunk));
        setTimeout(() => {
            if (++chunknow == chunknb || chunknb > 900) {
                stream.emit("end");

            }
        }, 1000);
        chunknb++;

    });

    stream.on("end", async () => {
        let audioStream = Buffer.concat(buffer);
        let duration = audioStream.length / 48000 / 4;
        buffer = [];
        chunknb = 0;

        if (1 < duration && duration < 19) {
            callback(audioStream, duration)
        }
    });
};