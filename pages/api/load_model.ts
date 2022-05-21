import * as tf from '@tensorflow/tfjs-node';
import '@tensorflow/tfjs-backend-webgl';

import {NextApiRequest, NextApiResponse} from "next";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {supabase} from "../../lib/supabaseClient";
import {DEFAULT_AVATARS_BUCKET, DEFAULT_DIR} from "../../lib/constants";
import {Buffer} from "buffer";


type Data = {
    message: string,
    data: string,
}


const create_temp_directory = () => {
    let tmpDir;
    const appPrefix = 'my-app';
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
        // the rest of your app goes here
        return tmpDir;
    } catch {
        // handle error
    } finally {
        // try {
        //     if (tmpDir !== "") {
        //         fs.rmSync(tmpDir, {recursive: true});
        //     }
        // } catch (e) {
        //     console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        // }

    }
    return "";
};

const view_files_in_dir = (dir_name: string) => {
    return fs.readdirSync(dir_name);
}

const blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: theBlob.type})
};

const write_file_into_temp_folder = async (temp_dir: string, file_name: string) => {

    const {data, error} = await supabase
        .storage
        .from(DEFAULT_AVATARS_BUCKET)
        .download(`${DEFAULT_DIR}${file_name}`);
    if (data !== null) {
        let buffer = await data.arrayBuffer();
        buffer = Buffer.from(buffer);
        const full_dir = temp_dir + file_name;
        fs.createWriteStream(full_dir).write(buffer);
        return full_dir;
    } else {
        throw Error("unable to convert blob to file object");
    }
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {


    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Train the model
    const startTF = async (temp_dir: string) => {
        try {
            // "file://public/model_1/model.json"
            let model_dir = await write_file_into_temp_folder(temp_dir, 'model.json');
            await write_file_into_temp_folder(temp_dir, 'weights.bin');
            console.log(model_dir);
            // let load_model = await tf.loadLayersModel();
            // console.log(load_model.summary());

            return temp_dir;
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    if (req.method === "GET") {
        const temp_dir = "../../temp_files/";
        const result = await startTF(temp_dir);

        return res.status(200).json({
            message: "SUCCESS",
            data: temp_dir,
        })

    }

}