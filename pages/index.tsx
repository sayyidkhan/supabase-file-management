import Footer from '../components/Footer'
import UploadModels from "../components/UploadModels";
import ListOfFiles from "../components/ListofFiles";

export default function Home() {

    return (
        <div className="container" style={{padding: '50px 0 100px 0'}}>
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

            <Footer/>
        </div>
    )
}
