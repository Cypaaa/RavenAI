const WitSpeech = require("node-witai-speech");
const { Readable } = require("stream");

module.exports.Transcribe = (audioStream, callback) => {
    WitSpeech.extractSpeechIntent(
        process.env.WITAI_TOKEN,
        Readable.from(audioStream),
        "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little",
        (error, response) => {
            // we clean our response because SOMETIMES it comes in a text form
            let output;
            if (typeof response != "object") {
                const outputclear = response.replace(/(?:\[rn]|[\r]+)+/g, ",")
                const jsonparse = JSON.parse("[" + outputclear + "]")
                output = jsonparse[jsonparse.length - 1]
            }
            callback(output || response)
        }
    );
};