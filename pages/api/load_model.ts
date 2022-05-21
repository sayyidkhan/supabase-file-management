import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import {NextApiRequest, NextApiResponse} from "next";


type Data = {
    message: string,
    data: string
}

//
// export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
//
//
//     const model = tf.sequential();
//     model.add(tf.layers.dense({units: 1, inputShape: [1]}));
//     model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
//
//     // Train the model
//     const startTF = () => {
//         const model_url = "https://knjkvvvlpqayqjeqmcmf.supabase.co/storage/v1/object/sign/avatars/models/model.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL21vZGVscy9tb2RlbC5qc29uIiwiaWF0IjoxNjUzMTMwMTQwLCJleHAiOjE5Njg0OTAxNDB9.K9OXL02EdWgmwe_7BPt59S_Lug5Op08fOkiwoh0HPH0";
//         return await tf.loadLayersModel(model_url);
//     }
//
//     if (req.method === "GET") {
//         return res.status(200).json({
//             message: "SUCCESS",
//             data: startTF(),
//         })
//
//     }
//
// }