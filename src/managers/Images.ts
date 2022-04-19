
import GD from "../GD";
import { Services } from "../utils/Services";

export class Images{
    private authKey:string="web"
    private sharedObject?:SharedObjectVO;
    constructor(){
        GD.S_AUTH_COMPLETE.add(data=>{
            this.authKey=data.key;
        })
        GD.S_SHARED_OBJECT_READY.add(so=>{
            this.sharedObject=so;
        })
        this.imageGet=this.imageGet.bind(this)
        this.uploadImage=this.uploadImage.bind(this)
        this.doImageUpload=this.doImageUpload.bind(this)
        
        GD.REQ_IMAGE_UPLOAD.listener=this.uploadImage;
        GD.REQ_IMAGE_GET.listener=this.imageGet;
        GD.S_SERVICE_READY.invoke("images");
        GD.S_IMAGE_DOWNLOAD_REQUEST.add(req=>{
            if(req.target==="msg" && this.sharedObject?.messenger)
                return;
            this.onImageDownloadRequest(req)
        })
        GD.REQ_IMAGE_UPLOAD_AS_B64.listener=this.doImageUpload;
    }

    private async onImageDownloadRequest(req:{uid:string,name:string,chatUID:string}){
        /*let mime="image/jpeg"
        if(req.name.toLocaleLowerCase().endsWith(".png"))
            mime="image/png"
        if(req.name.toLocaleLowerCase().endsWith(".gif"))
            mime="image/gif"*/
        let key=await GD.REQ_SECURITY_KEY.invoke({chatUID:req.chatUID})
        if(!key)
            return;
        this.imageGet({
            thumb:false,
            imageUID:req.uid,
            key:key,
        },(b64:string|null)=>{
            if(!b64){
                GD.S_TOAST.invoke("Can't download image, try later");
                GD.S_LOGE.invoke("Can't download image");
                return;
            }
            const linkSource = b64;
            const downloadLink = document.createElement('a');
            document.body.appendChild(downloadLink);
            downloadLink.href = linkSource;
            downloadLink.target = '_self';
            downloadLink.download = req.name;
            downloadLink.click(); 
            downloadLink.remove();
        })
    }

   

    private async imageGet(req:{thumb?:boolean,imageUID:string,key:string},callback:(b64:string|null)=>void){
        
        const xhr = new XMLHttpRequest();
        const scheme=await GD.REQ_CONFIG_SCHEMES.invoke();
        if(!this.authKey){
            GD.S_LOGE.invoke("No auth key, can't load images");
            return;
        }

        let url:string = scheme[scheme.current].files + "uid=" + req.imageUID+"&key="+this.authKey;
        if (req.thumb)
            url += '&thumb=1';
        
        xhr.onload = e=>{
            const uint8Array = new Uint8Array(xhr.response);
            var img = Services.imagePacker.decrypt(uint8Array, req.key);
            if (img == null){
                callback (null);
                return;
            }
            img = 'data:image/jpeg;base64,' + btoa(img);
            callback (img);
        }
        xhr.responseType = 'arraybuffer';
        xhr.open("get", url, true);
        xhr.send();
    }


    private async uploadImage(req:{file:File,chatUID:string},callback:(success:boolean)=>void){

        const fr=new FileReader();
        fr.onload=async e=>{
            // image read
            GD.S_LOG.invoke("Image read, try to upload")
            await this.doImageUpload(
                {
                    fileName:req.file.name,
                    b64:fr.result as string,
                    chatUID:req.chatUID
                },callback);
        }

        fr.readAsDataURL(req.file)
	}

    private async doImageUpload(req:{fileName:string,b64:string,chatUID:string},callback:(success:boolean)=>void){
        const tmpImg:HTMLImageElement = document.createElement("img");
        GD.S_LOG.invoke("Image read, uploading 1")
            tmpImg.onload = async e=>{

                GD.S_LOG.invoke("Image read, uploading 2")

                let key= await GD.REQ_SECURITY_KEY.invoke({chatUID:req.chatUID});
                if(!key)
                    return;
                const images:string[]|null = Services.imagePacker.get2ImagesForSend(tmpImg, key);
                if(!images){
                    GD.S_TOAST.invoke("Can't send image, "+req.fileName);
                    if(callback)
                        callback(false);
                    return;
                }
                const title=req.fileName;

                const resp=await GD.REQ_HTTP.invoke({
                    method:"files.addImage",
                    chatUID:req.chatUID,
                    image:images[0],
                    thumb:images[1],
                    title:title,
                    crypted:"1",
                    b64:"1"
                })
                
                if(resp.error || resp.data==null){
                    GD.S_ALERT_ERROR.invoke("Can't upload image: "+resp.errorMsg);
                    
                    if(callback)
                        callback(false);
                    return;
                }

                const {name,uid}=(resp.data as SimpleObjectVO)
                const msg:string|null = Services.pack(Services.systemSequence+JSON.stringify({
                    method:"fileSended",
                    title:name,
                    type:"file",
                    fileType: "cimg",
                    additionalData:uid + ',' + tmpImg.width + ',' + tmpImg.height
                }),key);
                
                
                GD.S_WS_SEND.invoke({
                    method:"msgAdd",
                    data:{
                        chatUID:req.chatUID,
                        text:msg
                    }
                })
                
                if(callback)
                    callback(true);
            }
        
            tmpImg.src = req.b64;
    }

}


/*this.worker=new Worker("workers/image.js")

        // Worker message handler
        this.worker.onmessage=(e)=>{

            // UPLAOD FILE IN MAIN THREAD
            /*if(e.data.method=="files.addImage"){
                HTTP.dccapi.Files.addImage(cb=>{
                    if(this.responses.has(e.data.callID)){
                        const callback=this.responses.get(e.data.callID);
                        this.responses.delete(e.data.callID);
                        callback({err:cb.error,errMsg:cb.errorMsg,data:cb});
                    }
                },e.data.chatUID,e.data.image,e.data.thumb,e.data.title,e.data.crypted,e.data.b64);
                return;
            }*/

            /*if(this.responses.has(e.data.callID)){
                const callback=this.responses.get(e.data.callID);
                this.responses.delete(e.data.callID);
                callback({err:e.data.errMsg,data:e.data.data});
            }
            
        }

       

        // LOAD IMAGE
       /* GD.S_LOAD_IMAGE.add(req=>{
            // image already loading
            if(this.requests.has(req.url)){
                this.requests.get(req.url).push(req.callback);
                return;
            }

            this.requests.set(req.url,[req.callback]);
            const callID=this.nextCallID++;
            this.responses.set(callID,response=>{
                // req
                const storedRequests=this.requests.get(req.url);
                if(storedRequests){
                    for(let i in storedRequests){
                        if(storedRequests[i] && typeof storedRequests[i]=="function")
                            storedRequests[i]({img:response.data,url:req.url,errMsg:response.errMsg});
                    }
                    this.requests.delete(req.url);
                }
                req.callback({img:response.data,url:req.url,errMsg:response.errMsg});
            });
            console.log("Start load message! "+req.url);
            this.worker.postMessage({method:"loadImage",cacheName:req.cacheName,url:req.url,type:req.type,encrypted:req.encrypted,callID:callID});
        });*/

        // UPLOAD IMAGE
       /* GD.S_UPLOAD_IMAGE.add(req=>{
            const callID=this.nextCallID++;
            this.responses.set(callID,(data)=>req.callback(data.data));
            
            const data={method:"uploadImage",path:req.file.path,chatUID:req.chatUID,fileName:req.fileName,callID:callID,blob:req.file,authKey:req.authKey,key:req.key,url:Config.URL_FILES_API};

     

            this.worker.postMessage(data);
        })

        // LOAD LOCAL IMAGE
        GD.S_LOAD_LOCAL_IMAGE.add(req=>{
            const callID=this.nextCallID++;
            this.responses.set(callID,req.callback);
            this.worker.postMessage({method:"loadLocalImage",file:req.file,width:req.width,height:req.height,id:req.id,scale:req.scale,callID:callID});
        })*/


        // Request image
      /*  GD.S_IMAGE_REQUEST.add((req:{uid:string,thumb:boolean,key:string,callback:(res:{err:string,img:string})=>void})=>{
            const callID=this.nextCallID++;
            this.callbacks.set(callID,req.callback);
            this.worker.postMessage({url:Config.URL_IMG+"key="+this.authKey+"&uid="+req.uid+((req.thumb)?"&thumb=1":""),key:req.key,callID:callID});
        })*/

        // create thumbnail
        /*GD.S_IMAGE_THUMB_REQUEST.add((req:{width:number,height:number,contain:boolean,blob:Blob,callback:(b64:string)=>void})=>{

            const callID=this.nextCallID++;
            this.callbacks.set(callID,(res:{err:string,img:string})=>{
                if(res.err){
                    req.callback(null);
                    console.error("Can`t create thumb: "+res.err);
                    return;
                }
                req.callback(res.img);
            });
            this.worker.postMessage({method:"createThumb",blob:req.blob,width:req.width,height:req.height,contain:req.contain,callID:callID});

        });*/

        // Direct link to sticker
        /*GD.S_STICKER_REQUEST.add((req:{uid:string,ver:string,callback:(res:{err:string,img:string})=>void})=>{
            //const callID=this.nextCallID++;
            //this.callbacks.set(callID,req.callback);
            req.callback({err:null,img:Config.URL_STICKER+req.uid+"&ver="+req.ver});
        })*/

        // Upload Image
        /*GD.S_FILE_START_UPLOAD.add((req:{key:string,items:Array<UploadFilesItem>})=>{

            GD.REQUEST_AUTH_KEY.invoke((key:string)=>{
                if(key.length<20){
                    GD.S_ERROR.invoke("Can`t upload files, no auth key! "+key);
                    return;
                }
                for(let i=0;i<req.items.length;i++){
                    if(req.items[i].type.indexOf("image")!=-1)
                        this.uploadImage(req.items[i],req.items[i].chatUID,req.items[i].fileName,req.key,key,Config.URL_FILES);
                    else
                        this.uploadImage(req.items[i],req.items[i].chatUID,req.items[i].fileName,req.key,key,Config.URL_FILES);
                }

            });
        });
    }

 

    private uploadImage(item:an,chatUID:string,fileName:string,key:string,authKey:string, url:string){
        const callID=this.nextCallID++;
       /* GD.S_FILE_UPLOADING_STAT.invoke({item:item,status:"uploading",error:null});
        this.callbacks.set(callID,(res:{err:string,img:any})=>{
            
            if(!res.img.error){
                let msg:string
                if(item.type.indexOf("image")==-1){
                     msg = JSON.stringify({
                        method:"fileSended",
                        title:item.fileName,
                        type:"file",
                        fileType: item.type,
                        additionalData:res.img.data.uid + ',' + item.fileSize
                    });
                }else{
                    msg = JSON.stringify({
                        method:"fileSended",
                        title:item.fileName,
                        type:"file",
                        fileType: "cimg",
                        additionalData:res.img.data.uid + ',' + res.img.data.width + ',' + res.img.data.height
                    });
                }


                GD.S_MESSAGE_SEND.invoke({
                    chatUID:item.chatUID,
                    text:msg,
                    edit:-1,
                    resend:null,
                    sys:true
                });

                //GD.S_FILE_UPLOADING_STAT.invoke({item:item,status:"complete",error:null});
                return;
            }

            //GD.S_FILE_UPLOADING_STAT.invoke({item:item,status:"error",error:res.img.errorMsg});
        });

        // send image to upload
        this.worker.postMessage({method:"uploadFile",blob:item.data,key:key,callID:callID,authKey:authKey,url:url,chatUID:chatUID,fileName:fileName,type:item.type});
*/
