import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import {NextApiRequest, NextApiResponse} from "next";


type Data = {
    message: string,
    data: string
}


export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {


    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Train the model
    const startTF = async () => await tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]).dataSync().toString();


    if (req.method === "GET") {
        const result = await startTF();
        return res.status(200).json({
            message: "SUCCESS",
            data: result,
        })

    }

}