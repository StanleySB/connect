import GD from "../GD";
import { Services } from "../utils/Services";

class Messages{
    
    private messages:Map<string,MessageVO[]>=new Map(); // chatuid, messages list
    private lastUpdatedTime:Map<string,number>=new Map(); // chatuid, timestamp of last update
    private messagesHash:Map<string,string>=new Map(); // chatuid, messagesHash
    private lastUpdateTimerId:any;
    private profile?:ProfileVO;
    private currentOpenedChatUID:string|null=null;
    private wsWatcherTimerID:any;
    constructor(){
        
        GD.S_AUTH_COMPLETE.add(data=>{
            this.profile=data.profile;
        })

        GD.REQ_MESSAGE_PARSE_FROM_CHAT.listener=async (data,cb)=>{
            if(!data.chat)
                return;
            let m=data.chat.message;
            if(!m)
                return;
            const msg=await this.prepareMessage(m,data.chat);
            cb(msg);
        }

        GD.S_WS_MSG.add(packet=>{
            if(packet.method!=="msgAdd" && packet.method!=="msgChange" && packet.method!=="msgRemove")
                return;
            if(packet.method==="msgAdd")
                this.addMsg(packet.data);
        })

        GD.S_CHAT_OPENING.add(cvo=>{
            this.requestMessages(cvo.uid);
        })

        GD.S_CHAT_OPEN_REQUEST.add(data=>{
            if(data.chatUID){
                GD.S_CHAT_MESSAGES.invoke({chatUID:data.chatUID,msgs:[]});
                return;
            }
        })

        GD.S_CHAT_OPENED.add(data=>{
            // start watching for messages & connection
            this.currentOpenedChatUID=data.uid
            this.startWSWatcher();
        })

        GD.S_WS_MSG_SENT_VIA_HTTP.add(data=>{
            this.updateChatMessagesViaPHP(data.chatUID);
        })


        GD.S_SERVICE_READY.invoke("messages");

    }

    private  startWSWatcher(){
        this.wsWatcherTimerID=setTimeout(async ()=>{
            const state=await GD.REQ_WS_STATUS.invoke();
            if(state>1){
                // TODO: PASS LAST RECEIVED MSG ID
                if(this.currentOpenedChatUID!=null)
                    this.updateChatMessagesViaPHP(this.currentOpenedChatUID);
            }
            this.startWSWatcher();
        },30*1000);
    }

    private updateChatMessagesViaPHP(chatUID:string):void{
        let lastUpdated=this.lastUpdatedTime.get(chatUID);
        if(!lastUpdated)
            lastUpdated=0;
        if(+new Date()-lastUpdated<2000){
            if(this.lastUpdateTimerId)
                clearTimeout(this.lastUpdateTimerId);
            this.lastUpdateTimerId=setTimeout(()=>{
                this.updateChatMessagesViaPHP(chatUID);
            },3000);
            return;
        }
        this.requestMessages(chatUID,0,15,true);
    }

    private async requestMessages(chatUID:string,lastID:number=0,limit:number=100,watchdog:boolean=false){

        this.lastUpdatedTime.set(chatUID,+new Date());
        const stock=this.messages.get(chatUID);
        const msgsHash=this.messagesHash.get(chatUID);

        if(!watchdog){
            if(stock && stock.length>0)
                this.broadcastMessages(chatUID);
        }

        const resp=await GD.REQ_HTTP.invoke({
            method:"chat.hGetMessages",
            chatUID:chatUID,
            banan:lastID+"",
            limit:limit,
            hash:(msgsHash && watchdog)?msgsHash:"-1"
        })

        if(resp.error){
            if(!watchdog)
                GD.S_ALERT_ERROR.invoke("Can't get messages, "+resp.errorMsg?.substr(10)+"...");
            return;
        }

        if(!resp.data || !(typeof resp.data==="object"))
            return;

        if(watchdog)
            this.messagesHash.set(chatUID,(resp.data as SimpleObjectVO).hash);
        
        this.parseMessages((resp.data as SimpleObjectVO).messages);
    }

    private async addMsg(data:any,fireSignal:Boolean=true):Promise<MessageVO|null>{

        // format message
        const msg:MessageVO=await this.prepareMessage(data,null);

        // remove rate bot
        if(msg.sys && typeof msg.sys.additionalData==="string" && msg.sys.additionalData.toLowerCase().indexOf("ratebot")>-1)
            return null;

        // get messages stock
        let stock=this.messages.get(msg.chatUID);
        if(!stock){
            stock=[];
            this.messages.set(msg.chatUID,stock);
        }
        // find duplicate
        let found=false;
        for(let i in stock){
            const m=stock[i];
            if(m.id===msg.id){
                stock[i]=msg;
                found=true;
                break
            }
        }

        if(!found)
            stock.push(msg);
        if(stock.length>1000)
            stock.shift();

        if(fireSignal)
            this.broadcastMessages(msg.chatUID);

        GD.S_MESSAGE_ADDED.invoke(msg);

        return msg;
    }

    private async parseMessages(data:any){
        let chatUID;
        if(Array.isArray(data)){
            for(let i in data){
                const msg=await this.addMsg(data[i],false)
                if(msg)
                    chatUID=msg.chatUID;
            }
        }
        if(chatUID && Array.isArray(data) && data.length>0)
            this.broadcastMessages(chatUID);
    }


    private async broadcastMessages(chatUID:string){

        const chat=await GD.REQ_CURRENT_CHAT.invoke();
        if(chat.uid!==chatUID)
            return;

       const msgs=this.prepareMessagesList(chatUID);
       GD.S_CHAT_MESSAGES.invoke({chatUID:chatUID,msgs:msgs});
       if(msgs && msgs.length>0)
            GD.S_MESSAGE_READ.invoke(msgs[msgs.length-1]);
    }


    prepareMessagesList(chatUID:string):MessageVO[]{

        const arr=this.messages.get(chatUID)
        if(!arr || arr.length===0){
            return [];
        }

        arr.sort((a,b)=>{
            if(a.num>b.num)
                return 1;
            if(b.num>a.num)
                return -1;
            return 0;
        })

        
        const l=arr.length;
        for(let i =0;i<l;i++){
            const msg:MessageVO=arr[i];
            msg.position="standalone";
            msg.date=undefined;

            let prev:MessageVO|null=null;
            if(i>0)
                prev=arr[i-1];
            if(!prev){
                msg.date=Services.dateFormatter.format(msg.created,"%d, %M, %y");
                continue;
            }

            
            const curDayOfYear=Services.dateFormatter.getDayOfYear(msg.created);
            const prevDayOfYear=Services.dateFormatter.getDayOfYear(prev.created);
            
            const timeoffset=msg.created-prev.created;

            if(msg.user_uid===prev.user_uid && msg.type===prev.type && curDayOfYear===prevDayOfYear && timeoffset<60*5){
                msg.position="middle"
                if(prev.position==="standalone")
                    prev.position="first";
            }else{
                if(prev.position!=="standalone")
                    prev.position="last";
            }
            if(curDayOfYear!==prevDayOfYear)
                msg.date=Services.dateFormatter.format(msg.created,"%d, %M, %y");
            
        }
        let last=arr[arr.length-1];
        if(last.position==="middle")
            last.position="last";

       

        return arr;
    }


    // MESSAGES
    async prepareMessage(msg:any,chat:ChatVO|null):Promise<MessageVO>{
        
        // text
        if(!msg.parsed){

            if(msg.chat_uid)
                msg.chatUID=msg.chat_uid
            if(msg.chatUid)
                msg.chatUID=msg.chatUid;

            if(chat===null)
                chat=await GD.REQ_CHAT.invoke({chatUID:msg.chatUID});
            

            if(!chat)
                return msg;

            const key=chat.securityKey;
            
            msg.text=Services.unpack(msg.text,key);
            msg.id=parseInt(msg.id+"");
            msg.num=parseInt(msg.num+"");
            msg.version=parseInt(msg.version+"");
            
            
            if(chat.ownerID==="guest" && msg.user_name.startsWith("guest")){
                msg.mine=true;
                msg.side="right";
            }else if(chat.ownerID!==msg.user_uid){
                msg.side="left"
                msg.mine=false;
            }else{
                msg.side="right"
                msg.mine=true;
            }

            if(this.profile?.type!=="guest"){
                if(this.profile?.uid===msg.user_uid){
                    msg.side="right"
                    msg.mine=true;
                }else{
                    msg.side="left"
                    msg.mine=false;
                }
            }

            if(!msg.mine && chat.type==="company"){
                msg.user_name="Dukascopy";
                msg.user_avatar="dukascopy";
            }


            if(msg.chat_uid)
                msg.chatUID=msg.chat_uid
            if(msg.chatUid)
                msg.chatUID=msg.chatUid;

            msg.parsed=true;
        }


        // type
        msg.type="text";
        if((msg as MessageVO).text.startsWith(Services.systemSequence)){
            msg.type="system";
            let sys=null;
            try{
                sys=JSON.parse(msg.text.substr(Services.systemSequence.length))
            }catch(e){
                GD.S_LOGE.invoke(["Can't parse system message: "+msg.text,e]);
            }
            if(sys){
                this.parseSystemMsg(sys,msg);
                msg.sys=sys
            }
        }

        return msg;
    }

    parseSystemMsg(sysMsg:any,msg:MessageVO):void{

        if (sysMsg.type === "file" && sysMsg.fileType === "cimg"){
            msg.type="img"
            return;
        }
        
        if (sysMsg.type === "file" && sysMsg.fileType === "img"){
            msg.type="oldimg";
            return;
        }
        
        if (sysMsg.type === "file"){
            msg.type="file";
            return;
        }
            
        // vid id started
        if ("method" in sysMsg){
            msg.type="sys";
            if (sysMsg.method.toLowerCase() === "vicomplete"){
                msg.type="vi"
            }
            
            // vid id started
            if (sysMsg.method.toLowerCase() === "vistart"){
                msg.type="vi"
            }
            
            // vid id started
            if (sysMsg.method.toLowerCase() === "vi_later"){
                msg.type="vi"
            }

            // Dukascash request
            if(sysMsg.method.toLowerCase()==='dukasnotesrequest'){
                msg.type="dukanotes"
            }
            
            // vid id started
            if(sysMsg.method.toLowerCase() === "vifail"){
                msg.type="vi"
            }
            
            if (sysMsg.method === "credentials" && sysMsg.type === "credentials"){
                msg.type="credentials";
            }
            
            if(sysMsg.method.toLowerCase()==="voicesent" && sysMsg.type==="voice"){
                msg.type="voice";
            }

            if(sysMsg.type==='chatSystem'){
                msg.type="chatSystem";
            }
            
            if(sysMsg.type==="chatSystem" && sysMsg.method==="botMenu"){
                msg.type="botMenu";
            }
            
            if(sysMsg.type==='chatSystem' && sysMsg.method==='botCommand'){
                msg.type="botCommand";
            }
        }

        let text = msg.text.substr(Services.systemSequence.length);

        // unsupported sysem chat
        if (sysMsg.title!=null && sysMsg.title.length > 0 && text.length<1)
            text = sysMsg.title;
        else{
            if(!text || text.length<1)
                text = "sys msg without title";
        }
        msg.text=text;
    }
}
export default Messages;