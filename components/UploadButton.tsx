import {ChangeEventHandler} from 'react'

export type UploadButtonProps = {
    onUpload: ChangeEventHandler<HTMLInputElement>
    loading: boolean
}

export default function UploadButton(props: UploadButtonProps) {
    return (
        <div style={{'flex': 'auto'}}>
            <label className="button primary block" htmlFor="single">
                {props.loading ? 'Uploading ...' : 'Upload'}
            </label>
            <input
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                }}
                type="file"
                id="single"
                onChange={props.onUpload}
                disabled={props.loading}
            />
        </div>
    )
}
