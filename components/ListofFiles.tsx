import * as React from "react";
import {supabase} from "../lib/supabaseClient";
import {useEffect, useState} from "react";
import {COLOR_HEX_BLUE_GREEN, DEFAULT_AVATARS_BUCKET, DEFAULT_DIR} from "../lib/constants";
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
        <div>
            <div style={{marginTop: "3em"}}>
                <button
                    className="button block"
                    style={{backgroundColor: COLOR_HEX_BLUE_GREEN}}
                    onClick={() => {
                        getListOfFiles().then(res => {
                            setFileList(res);
                        })
                    }}
                >
                    Refresh List
                </button>
            </div>
            <p>Total number of files stored in database: {fileList.length}</p>
            <p>Displaying file list limit: {file_list_limit}</p>
            <div style={{width: "100%", height: "250px", overflow: "hidden"}}>
                {
                    fileList.length > 0 ?
                        <div style={{
                            height: '100%',
                            marginRight: '-50px',
                            paddingRight: '50px',
                            overflowY: 'scroll'
                        }}>
                            <table style={{border: '1px solid', 'width': '100%'}}>
                                <tr style={{border: '1px solid'}}>
                                    {
                                        ["No.", "File Name", "Date Created"].map((header_name) => {
                                            return (
                                                <th style={{border: '1px solid'}}>
                                                    {header_name}
                                                </th>
                                            );
                                        })
                                    }
                                </tr>
                                {
                                    fileList.map((file_obj: SupaBaseFileMetadata, index) => {
                                        return (
                                            <tr key={index + 1} style={{border: '1px solid'}}>
                                                <td style={{
                                                    border: '1px solid',
                                                    textAlign: "center",
                                                    padding: "0.5em"
                                                }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{
                                                    border: '1px solid',
                                                    textAlign: "center",
                                                    padding: "0.5em"
                                                }}>
                                                    {file_obj.name}
                                                </td>
                                                <td style={{
                                                    border: '1px solid',
                                                    textAlign: "center",
                                                    padding: "0.5em"
                                                }}>
                                                    {new Date(file_obj.created_at).toISOString().slice(0, 10)}
                                                    <br/>
                                                    {new Date(file_obj.created_at).toISOString().slice(11, 19)}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                        :
                        <p>No items to display</p>
                }


            </div>
        </div>
    );
}