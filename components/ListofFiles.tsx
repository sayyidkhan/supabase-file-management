import * as React from "react";
import {supabase} from "../lib/supabaseClient";
import {useEffect, useState} from "react";
import {DEFAULT_AVATARS_BUCKET, DEFAULT_DIR} from "../lib/constants";
import set = Reflect.set;

interface SupaBaseFileMetadata {
    created_at: string,
    id: string,
    last_accessed_at: string,
    name: string,
    metadata: any,
    updated_at: string
}

const convert_to_supabasefilemetadata = (
    _created_at: string,
    _id: string,
    _last_accessed_at: string,
    _name: string,
    _metadata: any,
    _updated_at: string,
) => {
    const result: SupaBaseFileMetadata = {
        created_at: _created_at,
        id: _id,
        last_accessed_at: _last_accessed_at,
        name: _name,
        metadata: _metadata,
        updated_at: _updated_at,
    }
    return result;
}

export default function ListOfFiles() {
    const file_list_limit = 100;
    const [fileList, setFileList] = useState<SupaBaseFileMetadata[]>([]);

    useEffect(() => {
        getListOfFiles().then((res) => {
            setFileList(res);
        });
    }, []);

    async function getListOfFiles() {
        const {data, error} = await supabase
            .storage
            .from(DEFAULT_AVATARS_BUCKET)
            .list(DEFAULT_DIR, {
                limit: file_list_limit,
                offset: 0,
                sortBy: {column: 'name', order: 'asc'},
            });
        if (data !== null) {
            console.log(data);
            return data.map(val => {
                const name = val.name;
                const created_at = val.created_at;
                const id = val.id;
                const last_accessed_at = val.last_accessed_at;
                const updated_at = val.updated_at;
                const metadata = val.metadata;
                return convert_to_supabasefilemetadata(
                    created_at,
                    id,
                    last_accessed_at,
                    name,
                    metadata,
                    updated_at,
                );
            });
        }
        return [];
    }


    return (
        <div style={{width: "100%", height: "400px", overflow: "hidden"}}>
            <p>Total number of files stored in database: {fileList.length}</p>
            <p>Displaying file list limit: {file_list_limit}</p>
            <div style={{
                height: '100%',
                marginRight: '-50px',
                paddingRight: '50px',
                overflowY: 'scroll'
            }}>
                {
                    fileList.map((file_obj: SupaBaseFileMetadata, index) => {
                        return (
                            <div key={index + 1}>
                                {/*<h4>{index + 1}.&nbsp;&nbsp;&nbsp;</h4>*/}
                                <h4>{file_obj.name}</h4>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}