const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const logs = require('./logs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO).then(()=>{console.log("Connected to DB!!")})
app.post('/generate', async (req, res) => {
    console.log("Generating Response");
    const date = new Date();
    const genAI = new GoogleGenerativeAI('AIzaSyD_mf53Ooc6BsKDJ1deVXBxkq-q06ehLdA');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const userInput = req.body.query;
        const appendor = '\n\n\n\nQuestion : \n\n'+userInput;
        const result = await model.generateContent(userInput);
        await logs.create({ip: req.ip, req_type: "Generating Respponse",timestamp: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}`});
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
