const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.post('/generate', async (req, res) => {
    console.log("Generating Response");
    const genAI = new GoogleGenerativeAI('AIzaSyD_mf53Ooc6BsKDJ1deVXBxkq-q06ehLdA');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const userInput = req.body.query;
        const appendor = '\n\n\n\nQuestion : \n\n'+userInput;
        const result = await model.generateContent(userInput);
        res.status(200).json({ response: result.response.text() })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});
app.post('/verify',(req,res)=>{
    res.status(200).json({ok: 1});
})
app.listen(6524);
