
import GD from "../GD";
import { Services } from "../utils/Services";


export class Files{
    
    private key:string|undefined;
    private scheme:URLScheme|null=null;

    constructor(){
        this.init();
    }

    private async init(){
        GD.S_AUTH_COMPLETE.add(async data=>{
            const tmp=(await GD.REQ_CONFIG_SCHEMES.invoke());
            this.scheme=tmp[tmp.current];
            this.key=data.key;
        })
        GD.REQ_FILE_UPLOAD.listener=this.upload;
        GD.S_FILE_DOWNLOAD_REQUEST.add(req=>{
            const url=this.scheme?.files+"uid="+req.uid+"&key="+this.key;
            var link = document.createElement("a");
            link.setAttribute('download', req.name);
            link.href = url;
            //link.target="_blank";
            document.body.appendChild(link);
            link.click();
            link.remove();
            
        })
        GD.S_SERVICE_READY.invoke("files")
    }

    

	private upload(req:{file:File,chatUID:string},callback:(success:boolean)=>void){
        // TODO: -> refactor to blob
   
        const fileReader:FileReader=new FileReader();
        fileReader.onload = async (e:ProgressEvent)=>{

            fileReader.onload = null;
            const resp=await GD.REQ_HTTP.invoke({
                method:"files.addDoc",
                chatUID:req.chatUID,
                file:fileReader.result,
                title:req.file.name
            })

            if(!resp || resp.error || !resp.data){
                GD.S_TOAST.invoke("Can't send file, "+req.file.name);
                if(callback)
                    callback(false);
                return;
            }

            GD.S_WS_SEND.invoke({
                method:"msgAdd",
                data:{
                    chatUID:req.chatUID,
                    text:Services.systemSequence+JSON.stringify({
                        method:"fileSended",
                        type:"file",
                        title:req.file.name,
                        fileType:"file",
                        fileData:resp.data,
                        additionalData:(resp.data as SimpleObjectVO).uid
                    })
                }
            });
            
            if(callback)
                callback(true);

        }
        fileReader.readAsDataURL(req.file);

	}
	

}