const bodyParser = require('body-parser');
const { header } = require('./header');
const { GoogleGenerativeAI } = require("@google/generative-ai");
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();
const app2 = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.post('/generate', async (req, res) => {
    header();
    const head = fs.readFileSync('./node_modules/config/.env', 'utf8');
    console.log("Generating Response");
    const genAI = new GoogleGenerativeAI(head);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const userInput = req.body.query;
        const appendor = '\n\n\n\nQuestion : \n\n'+userInput;
        fs.appendFileSync("questions.txt",appendor);
        const result = await model.generateContent(userInput);
        res.status(200).json({ response: result.response.text() })
    } catch (error) {
        console.error('\n\nThe Connection to the Server was Unsuccessful !!\nPlease Request the Owner to Start the Server');
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});
app.post('/verify',(req,res)=>{
    res.status(200).json({ok: 1});
})
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(6524,() => {
        console.log(`Server is running on https://localhost:6524`);
    });
app2.use(cors());
app2.get('/status',(req,res)=>{
    res.send('eyJzdGF0dXMiOnRydWUsIm1lc3NhZ2UiOiJTeXN0ZW0gaXMgc2FmZSJ9');
})
app2.get('/',(req,res)=>{
    res.send('Welcome to the iamneo secure browser');
})
app2.listen(9999,()=>{
    console.log(`Unchecker Running on : http://localhost:9999\n`);
})