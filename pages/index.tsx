import Footer from '../components/Footer'
import UploadModels from "../components/UploadModels";
import ListOfFiles from "../components/ListofFiles";
import {COLOR_HEX_BLUE_GREEN} from "../lib/constants";
import {useState} from "react";
import LoadTFModel from "../components/LoadTFModel";

function CloudStorageRepository() {
    return (
        <div className="row">
            <div className="col-6">
                <h3>Manage Files</h3>
                <UploadModels/>
            </div>
            <div className="col-6">
                <h3>List of Files</h3>
                <ListOfFiles/>
            </div>
        </div>
    );
}

function LocalStorageRepository() {
    return (
        <div className="row">
            <div className="col-6">
                <h3>Manage Files</h3>
                <LoadTFModel/>
            </div>
            <div className="col-6">
                <h3>List of Files</h3>

            </div>
        </div>
    )
}

export default function Home() {
    const [selectedBtn, setSelectedBtn] = useState<number>(1);

    const activate_color = (this_id: number, curr_id: number) => this_id === curr_id ? {backgroundColor: COLOR_HEX_BLUE_GREEN} : {};
    const toggleBtn = (btn_id: number) => setSelectedBtn(btn_id);

    return (
        <div className="container" style={{padding: '50px 0 100px 0'}}>
            <h2> Manage File Repository</h2>
            <button
                style={{margin: '0.4em', ...activate_color(1, selectedBtn)}}
                onClick={() => toggleBtn(1)}
            >
                Cloud Storage
            </button>
            <button
                style={{margin: '0.4em', ...activate_color(2, selectedBtn)}}
                onClick={() => toggleBtn(2)}
            >
                Local Storage
            </button>
            {
                selectedBtn === 1 ?
                    <CloudStorageRepository/> : <LocalStorageRepository/>
            }


            <Footer/>
        </div>
    )
}
