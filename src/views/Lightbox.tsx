import React,{useRef,useEffect} from "react";
import styled from "styled-components";
import GD from "../GD";

import { gsap, TweenLite, Quad } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
gsap.registerPlugin(CSSRulePlugin);

const LightBoxDiv=styled.div`
    position:absolute;
    z-index:2;
    background-color:rgba(0,0,0,.4);
    width:100%;
    height:100%;
    z-index:20;
    backdrop-filter: blur(10px);
    display:none;
    transform:translateZ(1);
`

const LightBoxImgDiv=styled.div`
    background-color: 0;
    width:100px;
    height:100px;
    position:absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size:cover;
    border-radius: 6px;
    transform:translateZ(1);
`


let lightboxAnimation:TweenLite|null;
let imgUID:string|null=null;
let lastImgItem:HTMLDivElement|null=null;

const Lightbox=()=>{
    const img=useRef<HTMLDivElement|null>(null);
    const lightBoxRef=useRef<HTMLDivElement|null>(null);
    
    const setupPreview=(src:HTMLDivElement,imgUID:string,chatUID:string,width:number,height:number)=>{
        if(!img.current || !lightBoxRef.current)    
            return;
        const srcBounds=src.getBoundingClientRect();
        const srcScreenX=srcBounds.x;
        const srcScreenY=srcBounds.y;

        const imgBounds=lightBoxRef.current.getBoundingClientRect();

        const x=srcScreenX-imgBounds.x;
        const y=srcScreenY-imgBounds.y;

        img.current.style.left=x+"px";
        img.current.style.top=y+"px";
        img.current.style.width=srcBounds.width+"px";
        img.current.style.height=srcBounds.height+"px";
        img.current.style.backgroundImage=src.style.backgroundImage;

       

        lightBoxRef.current.style.display="block";

        if(lightboxAnimation)
            lightboxAnimation.kill();
        lightboxAnimation=TweenLite.to(img.current,.2,{left:"calc(50% - 150px",top:"calc(50% - 150px",onComplete:()=>{
            // TODO: check if lightbox opened
            GD.S_IMAGE_REQUEST.invoke({uid:imgUID,thumb:false,chatUID:chatUID});
        },ease:Quad.easeOut});
        

    }

    const setupBigPic=(imgUID:string,b64:string,width:number,height:number)=>{
        if(!img.current || !lightBoxRef.current)    
            return;
        if(lightboxAnimation)
            lightboxAnimation.kill();
        img.current.style.backgroundImage=`url(${b64})`;
        img.current.style.backgroundSize="contain";
        lightboxAnimation=TweenLite.to(img.current,.2,{left:"10px",top:"10px", width:"calc(100% - 20px)",height:"calc(100% - 20px",ease:Quad.easeOut});
    }

    const closeLightbox=()=>{
        if(!img.current)
            return;
        lightboxAnimation?.kill();
        imgUID=null;

        let x=-1;
        let y=-1;
        let width=-1;
        let height=-1;
        
        if(lastImgItem && lightBoxRef.current!=null){
            const srcBounds=lastImgItem.getBoundingClientRect();
            const srcScreenX=srcBounds.x;
            const srcScreenY=srcBounds.y;

            const imgBounds=lightBoxRef.current.getBoundingClientRect();
            x=srcScreenX-imgBounds.x;
            y=srcScreenY-imgBounds.y;

            width=srcBounds.width;
            height=srcBounds.height;

            img.current.style.backgroundImage=lastImgItem.style.backgroundImage;
        }


        if(lightboxAnimation)
            lightboxAnimation.kill();


        if(x===-1 && y===-1 && width===-1 && height===-1){
            lightboxAnimation=TweenLite.to(img.current,.2,{left:"50%",top:"50%", width:"0",height:"0",onComplete:()=>{
                if(lightBoxRef.current)
                    lightBoxRef.current.style.removeProperty("display");
            },ease:Quad.easeOut});
        }else{
            lightboxAnimation=TweenLite.to(img.current,.2,{left:x+"px",top:y+"px", width:width+"px",height:height+"px",onComplete:()=>{
                if(lightBoxRef.current)
                    lightBoxRef.current.style.removeProperty("display");
            },ease:Quad.easeOut});
        }
    }

    const onBgClick=(e:React.MouseEvent)=>{
        if(e.target !== lightBoxRef.current)
            return;
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    }

    useEffect(()=>{
        
        GD.S_CHAT_OPEN_REQUEST.add(req=>{
            imgUID=null;
            closeLightbox();
        },"lightbox")
        GD.S_IMAGE_DOWNLOAD_REQUEST.add(req=>{
            if(req.target!=="msg")
                return;
            imgUID=req.uid;
            if(req.src && "nodeName" in req.src && req.src.nodeName.toLowerCase()==="div"){
                let w=-1;
                let h=-1;
                if(req.width && req.height){
                    w=parseInt(req.width);
                    h=parseInt(req.height);
                    if(isNaN(w) || isNaN(h) || w<1 || h<1){
                        w=-1
                        h=-1;
                    }
                }
                lastImgItem=req.src;
                setupPreview(req.src,imgUID,req.chatUID,w,h);
            }
        },"lightbox")


        GD.S_IMAGE_READY.add(data=>{
            if(data.uid!==imgUID)    
                return;
            // setup image
            const img=document.createElement("img");
            img.onload=e=>{
                if(!lightBoxRef.current)
                    return;
                if(imgUID)
                    setupBigPic(imgUID as string,data.b64,img.width,img.height);
            }
            img.src=data.b64;
            
        },"lightbox")


        return ()=>{
            GD.S_IMAGE_REQUEST.clearContext("lightbox");
            GD.S_IMAGE_READY.clearContext("lightbox");
            GD.S_CHAT_OPEN_REQUEST.clearContext("lightbox");
        }
    },[])
    return <LightBoxDiv ref={lightBoxRef} onClick={onBgClick}>
            <LightBoxImgDiv ref={img}></LightBoxImgDiv>
        </LightBoxDiv>
}
export default Lightbox;