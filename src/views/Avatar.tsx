import React from "react";
import styled from "styled-components";

const AvatarDiv=styled.div`
    width:30px;
    height:30px;
    min-width:30px;
    min-height:30px;
    border-radius: 40%;
    background-color: #a2a786;
    background-size: cover;
    background-position: center;
    background-repeat:no-repeat;
    &[data-dukascopy]{
        background-size:80%;
        background-color:#da2221;
        background-image:url(data:image/png;base64,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);
    }
`

const Avatar=(params:{user:string,avatar:string})=>{
    const {avatar}=params;
    
    return <AvatarDiv data-dukascopy={avatar==="dukascopy"}></AvatarDiv>
}

export default Avatar;