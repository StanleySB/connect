import GD from "../GD";

class WS{

    private ws:WebSocket|null=null;
    private key:string|null=null;
    private profile:ProfileVO|null=null;
    private url:string|null=null;
    
    constructor(){
        this.init();
    }

    private async init(){
       
        GD.S_AUTH_COMPLETE.add(async data=>{
            const schemes=await GD.REQ_CONFIG_SCHEMES.invoke();
            this.url=schemes[schemes.current].ws;
            this.key=data.key;
            this.profile=data.profile;
            this.connect();
        })  

        GD.REQ_WS_STATUS.listener=(data,callback)=>{
            const stat=(this.ws)?this.ws.readyState:3;
            callback(stat);
        }

        GD.S_WS_SEND.add(packet=>{
            if(!this.ws || this.ws.readyState!==WebSocket.OPEN){
                if(packet.method==="msgAdd"){
                    this.sendMsgViaPHP(packet);
                    return;
                }
                console.warn("Can't send packet, no active connection")
                return;
            }

            if(packet.method!=="pong"){
                let log="WS >---------";
                log+="\n\t"+this.url;
                log+=this.generateDebug(packet);
                log+="\nWS <---------";
                GD.S_LOG.invoke(log)
            }

            this.ws.send(JSON.stringify(packet));
        })

        GD.S_SERVICE_READY.invoke("ws");
    }


    /*/**
     * Send message for user
     *
     * @see CONNECT-19449
     *
     * @param string $chatUID
     * @param string $txt
     * @param int $mid
     *
     * @param string $type optional
     * @param bool $anonymous false by default
     * @param bool $pushable false by default
     * @param string $pushBody optional
     * @param string $pushTitle optional
     * @param int $pointID optional
     * @return mixed|null
    
    api.wsSend(string $chatUID, string $txt, int $mid,
    string $type = '', bool $anonymous = false,
    bool $pushable = false, string $pushBody = '', string $pushTitle = '',
    int $pointID = 0
    )*/
    private async sendMsgViaPHP(packet:{method:string,data:SimpleObjectVO|null}){
        
        const req:SimpleObjectVO={
            method:"api.wsSend",
            pushable:true
        };

        if(packet.data!=null && typeof packet.data==="object"){
            for(let i in packet.data)
                req[i]=packet.data[i];
        }else
            return;

        const resp=await GD.REQ_HTTP.invoke(req)

        if(resp.error){
            console.error("Can't send msg via HTTP, "+resp.errorMsg);
            GD.S_TOAST.invoke("Can't send message, try to refresh page");
            return;
        };

        // Это пиздец. не забыть потроллить серверменов
        let phpData=resp.data as SimpleObjectVO;
        for(let i=0;i<2;i++){
            if(typeof phpData ==="object" && "data" in phpData && typeof phpData.data ==="object")
                phpData=phpData.data;
        }
        
        
        if(phpData && "error" in phpData && phpData.error){
            console.error("Can't send msg via HTTP, WS ERR: ");
            GD.S_TOAST.invoke("Can't send message, try to refresh page");
            return;
        }

        if("msgData" in phpData && typeof phpData.msgData==="object"){
            
            
            const profile=await GD.REQ_CURRENT_PROFILE.invoke();
            if(!profile)
                return;

            this.parsePacket(JSON.stringify({
                method:"msgAdd",
                data:{
                    anonymous: false,
                    chatUID: packet.data.chatUID,
                    chat_uid: packet.data.chatUID,
                    created: Math.round((+new Date()/1000)),
                    delivery: "sent",
                    id: phpData.msgData.id,
                    mid: "",
                    num: phpData.msgData.num,
                    platform: "desktop",
                    stat: [],
                    status: "created",
                    text: packet.data.text,
                    user_avatar: profile.avatar,
                    user_name: profile.name,
                    user_uid: profile.uid
                }
            }));
            
            
            GD.S_WS_MSG_SENT_VIA_HTTP.invoke({
                num:phpData.msgData.num,
                id:phpData.msgData.id,
                text:packet.data.text,
                chatUID:packet.data.chatUID
            });

            return;
        }

        GD.S_TOAST.invoke("Can't send message, try to refresh page");

    }

    private generateDebug(data:any,lvl:number=1):string{
        let str="";
        let stp="";
        for(let n=0;n<lvl;n++)
            stp+="\t";
        for(let i in data){
            let itm=data[i]
            if(itm===null || itm===undefined)
                str+="\n"+stp+i+": null"
            else if( typeof itm==="object"){
                str+="\n"+stp+i+":"+this.generateDebug(itm,++lvl);
            }else{
                if(typeof itm==="string" && itm.length>60)
                    itm=itm.substr(0,50)+"... total("+itm.length+")";
                str+="\n"+stp+i+": "+itm;
            }
        }
        return str;
    }

    private connect():void{
        
        /*if(2-1==1)
            return;*/

        this.close();
        if(this.url==null || this.key==null)
            return;

        GD.S_LOG.invoke("WS Connecting to: "+this.url);
        this.ws=new WebSocket(this.url);
        this.ws.onopen=(e:Event)=>{
            GD.S_LOG.invoke("WS opened");
            if(this.key==null){
                this.close();
                return;
            }
            if (this.profile?.type=== "guest") {
                GD.S_WS_SEND.invoke({
                    method:"auth",
                    data:{
                        authKey:this.key,
                        guestName:this.profile.name,
                        guestUID:this.profile.uid
                    }
                })
            } else{
                GD.S_WS_SEND.invoke({
                    method:"auth",
                    data:{
                        authKey:this.key
                    }
                })
            }
        }

        this.ws.onclose=(e:CloseEvent)=>{
            GD.S_WS_CLOSED.invoke();
            GD.S_LOG.invoke("WS closed");
            setTimeout(()=>{
                this.connect();
            },3000)
        }
        this.ws.onerror=(e:Event)=>{
            GD.S_LOGE.invoke(["WS error",e]);
        }
        this.ws.onmessage=(e:MessageEvent)=>{
            if(typeof e.data!=="string"){
                return;
            }
            var packetString=e.data;
            if(packetString.startsWith('{"method":"ping",')){
                GD.S_WS_SEND.invoke({
                    method:"pong",
                    data:null
                })
                return;
            }

            this.parsePacket(packetString)
            
        }
    }

    private parsePacket(packetString:string){
        var packet:{method:string,data:SimpleObjectVO}|null=null;
            try{
                packet=JSON.parse(packetString);
            }catch(e){}

            if(packet===null){
                console.error("Wrong packet from server")
                return;
            }

            if(!("method" in packet) || !("data" in packet)){
                console.error("Wrong packet structure")
                return;
            }

            if(packet.method==="auth"){
                GD.S_LOG.invoke("WS authorized on: "+this.url);
                GD.S_WS_AUTHORIZED.invoke(this.profile?.type);
                return;
            }

            if(packet.method==="init"){
                if(packet.data && !packet.data.error)
                    GD.S_WS_AUTHORIZED.invoke(this.profile?.type);
                        else
                            GD.S_WS_WRONG_AUTHORIZATION.invoke();
                return;
            }

            GD.S_WS_MSG.invoke(packet)
    }

    private close():void{
        if(this.ws!=null){
            this.ws.onclose=null;
            this.ws.onerror=null;
            this.ws.onmessage=null;
            this.ws.onopen=null;
            this.ws.close();
        }
        this.ws=null;
    }

    
}
export default WS;