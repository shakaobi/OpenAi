import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi} from 'openai'
// wrappers from openAi
dotenv.config()
//import api key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY ,
});
const openai = new OpenAIApi(configuration)

//set up middleware
const app = express();
app.use(cors());
app.use(express.json());
//set up get route
app.length('/', async(req,res)=>{
    res.status(200).send({
        message:"Shaka's openAi",
    })
})
//set up post route to get info from frontend request
app.post('/', async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            // passing the prompt^
            temperature: 0,
            max_tokens: 3000,
            // allowing the response to be as long as possible^
            top_p: 1,
            frequency_penalty: 0.5,
            // limit word repetition^
            presence_penalty: 0,
        })
        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
}
