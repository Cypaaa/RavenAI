module.exports.Ask = async (prompt, callback) => {
    const response = await process.OpenAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt }],
        stream: false,
    });
    callback(response.choices);
};