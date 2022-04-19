import React, { useEffect, useState } from "react"
import styled from "styled-components";
import GD from "../../GD"

interface CallDialogState{
    type:"incoming"
    data:BlackHoleDataCall,
}

const CallDialogsDiv=styled.div`
    position:absolute;
    z-index:21;
`

const CallDialogInstanceDiv=styled.div`
    width:200px;
    height:300px;
    background-color: red;
`
const CallDialogBtn=styled.div`
    padding:10px;
    background-color: #0059ff;
    cursor:pointer;
`

const CallDialogs=()=>{
    const [state, setState] = useState<CallDialogState|null>(null);
    useEffect(() => {
        GD.S_CALL_INCOMING.add(data=>{
            setState({
                type:"incoming",
                data:data
            })
        },"callDialogs")
        return () => {
            GD.S_CALL_INCOMING.clearContext("callDialogs");
        }
    }, [])

    if(!state)
        return null;
        
    // PLACE 
    let dialog=null;
    if(state.type==="incoming"){
        const callAccept=(e:React.MouseEvent)=>{
            GD.S_CALL_ACCEPT.invoke(state.data);
            setState(null);
        }
        const callDecline=(e:React.MouseEvent)=>{
            GD.S_CALL_DECLINE.invoke(state.data);
            setState(null);
        }
        dialog=<CallDialogInstanceDiv data-type={state.type}>
            Incoming call from: {state.data.callee.name}
            <CallDialogBtn onClick={callAccept}>ACCEPT</CallDialogBtn>
            <CallDialogBtn onClick={callDecline}>DECLINE</CallDialogBtn>
        </CallDialogInstanceDiv>
    }

    if(!dialog)
        return null;

    return <CallDialogsDiv>CALL DIALOGS {dialog}</CallDialogsDiv>
}

export default CallDialogs;

