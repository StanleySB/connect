import React,{useEffect,useState} from "react";
import styled from "styled-components";
import GD from "../../GD";

const ChatUploadingFilesDiv=styled.div`
    font-size:20px;
    position: absolute;
    top:66px;
    right:8px;
    user-select:none;
    pointer-events: none;
    display:flex;
    width:100%;
    flex-direction: column;
    align-items: flex-end;
    z-index:30;
`

const ChatUploadingFileDiv=styled.div`
    padding:5px 10px 5px 10px;
    font-size:11px;
    background-color:rgba(0,0,0,.7);
    color:white;
    border-radius: 10px;
    max-width: 50%;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
    margin-bottom: 2px;
    box-shadow:0px 1px 2px rgba(0,0,0,.3);
    &[data-status="finish"]{
        background-color: #3b548e;
    }
    &[data-status="fail"]{
        background-color: #ce3f44;
    }
`



const ChatUploadingFile=(params:{data:UploadingFileVO})=>{
    return <ChatUploadingFileDiv data-status={params.data.status}>{params.data.file.name}</ChatUploadingFileDiv>
}

const ChatUploadingFiles=()=>{
    const [files, setFiles] = useState<UploadingFileVO[]>([])
    useEffect(() => {
        GD.S_FILE_UPLOADING_LIST_UPDATED.add((data)=>{
            setFiles(data);
        },'ChatUploadingFiles')
        return () => {
            GD.S_FILE_UPLOADING_LIST_UPDATED.clearContext('ChatUploadingFiles')
        }
    })

    let i=0;
    let fileslist=files.map(f=><ChatUploadingFile data={f} key={i++} />)

    return <ChatUploadingFilesDiv>{fileslist}</ChatUploadingFilesDiv>
}

export default ChatUploadingFiles;