import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import GD from "../../GD";

const CallDiv=styled.div`
    position:absolute;
    background-color:#0011AA;
    width:400px;
    height:300px;
`

const Call=()=>{
    
    const [callVO, setCallVO]= useState<CallVO|null>(null);
    const localVideoRef=useRef<HTMLVideoElement|null>(null);
    const remoteVideoRef=useRef<HTMLVideoElement|null>(null);

    useEffect(() => {
        
        GD.S_CALL_PLACED.add(callVO=>{
            setCallVO(callVO);
        },"call")
        
        // CALL ACCEPTED FROM CALLEE SIDE
        GD.S_CALL_ACCEPTED.add(callVO=>{
            setCallVO(callVO);
        })

        GD.S_CALL_CALLEE_ACCEPT_CALL.add(callVO=>{
            setCallVO(callVO);
        })

        GD.S_CALL_LOCAL_MEDIA_READY.add(callVO=>{
            if(localVideoRef.current && callVO.localStream)
                localVideoRef.current.srcObject=callVO.localStream;
        })

        // ATTACH REMOTE STREAM
        GD.S_CALL_REMOTE_STREAM_READY.add(callVO=>{
            if(remoteVideoRef.current && callVO.remoteStream){
                if(remoteVideoRef.current.srcObject!==callVO.remoteStream)
                    remoteVideoRef.current.srcObject=callVO.remoteStream;
            }
        })
        
        return () => {
            GD.S_CALL_PLACED.clearContext("call")
        }

    }, [callVO])

    let callInstance=null;
    if(callVO){
        callInstance=<>
            <video ref={localVideoRef} width="320px" height="240px" playsInline={true} autoPlay={true} muted={true}></video>
            <video ref={remoteVideoRef} playsInline={true} autoPlay={true} muted={true}></video>
        </>
    }else
        return null;

    return(
        <CallDiv>
            {callInstance}
        </CallDiv>
    )
}

export default Call;