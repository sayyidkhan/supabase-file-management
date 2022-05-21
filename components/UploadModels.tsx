import {ChangeEvent, useState} from 'react'
import {supabase} from '../lib/supabaseClient'
import UploadButton from '../components/UploadButton'
import {DEFAULT_AVATARS_BUCKET, DEFAULT_DIR} from '../lib/constants'

export default function UploadModels() {
    const [loading, setLoading] = useState<boolean>(true);
    const [downloadFilename, setDownloadFilename] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [displaySignedUrl, setDisplaySignedUrl] = useState<string>("");


    const seconds_limit = 240;
    const milliseconds_limit = seconds_limit * 1000;


    async function selectFileUpload(event: ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length == 0) {
                throw 'You must select an image to upload.';
            }

            const user = supabase.auth.user();
            const file = event.target.files[0];
            const filePath = `${DEFAULT_DIR}${file.name}`;

            console.log(filePath);

            let {data, error: uploadError} = await supabase.storage
                .from(DEFAULT_AVATARS_BUCKET)
                .upload(filePath, file);

            console.log(data);

            if (uploadError) {
                throw uploadError
            }

            // let {error: updateError} = await supabase.from('profiles').upsert({
            //     id: user!.id,
            //     avatar_url: filePath,
            // });
            //
            // if (updateError) {
            //     throw updateError
            // }

            alert(`filename ${filePath} uploaded successfully.`);

        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false)
        }
    }


    async function getProfile() {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            let {data, error} = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user!.id)
                .single();

            if (error) {
                throw error
            }

        } catch (error) {
            console.log('error', error.message)
        } finally {
            setLoading(false)
        }
    }


    async function downloadModel(file_name: string) {
        const blobToFile = (theBlob: Blob, fileName: string): File => {
            return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: theBlob.type})
        };
        const downloadFileFromBrowser = (blob: Blob, fileName: string) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
                new Blob([blob]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                file_name,
            );

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            //link.parentNode.removeChild(link);
        };

        const {data, error} = await supabase
            .storage
            .from(DEFAULT_AVATARS_BUCKET)
            .download(`${DEFAULT_DIR}${file_name}`);
        if (data != null) {
            downloadFileFromBrowser(data, file_name);
            //const my_new_file = blobToFile(data, fileName);
            //console.log(my_new_file);
        } else {
            alert("unable to download file. file not exist.");
        }
    }

    async function getPublicUrl(file_name: string) {

        const {data, error} = await supabase
            .storage
            .from(DEFAULT_AVATARS_BUCKET)
            .createSignedUrl(`${DEFAULT_DIR}${file_name}`, seconds_limit);
        if (data !== null) {
            setDisplaySignedUrl(data.signedURL);
            // remove the text after the time-out is over
            setTimeout(() => {
                setDisplaySignedUrl("");
            }, milliseconds_limit);
        } else {
            alert("unable to get signed URL.")
        }

    }

    const disableButtonColor = () => {
        return downloadFilename === "" ? "button block secondary" : "button block primary";
    };

    return (
        <div className="account">
            <div>
                <label htmlFor="avatar">Upload Model Here</label>
                <div className="avatarField">
                    <UploadButton onUpload={selectFileUpload} loading={uploading}/>
                </div>
            </div>

            <div>
                <label htmlFor="avatar">Download Model Here</label>
                <br/>
                <div style={{paddingBottom: "1.5em", paddingTop: "0.25em"}}>
                    <input
                        id="download_file_name"
                        type="text"
                        onChange={(e) => setDownloadFilename(e.target.value)}
                    />
                </div>
                <div style={{marginTop: "0.5em"}}>
                    <button
                        className={disableButtonColor()}
                        onClick={() => downloadModel(downloadFilename)}
                        disabled={downloadFilename === ""}
                    >
                        download file
                    </button>
                </div>
                <div style={{marginTop: "0.5em"}}>
                    <button
                        className={disableButtonColor()}
                        onClick={() => getPublicUrl(downloadFilename)}
                        disabled={downloadFilename === ""}
                    >
                        get public link
                    </button>
                </div>
                <div>
                    {displaySignedUrl !== "" ?
                        <p>Public URL: (expires in {seconds_limit} (s)) </p> :
                        <p/>
                    }
                    <br/>
                    {displaySignedUrl !== "" ?
                        <p style={{wordWrap: "break-word"}}> {displaySignedUrl} </p> :
                        <p/>
                    }
                </div>
            </div>

        </div>
    )
}
