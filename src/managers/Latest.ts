import GD from "../GD";
import { Services } from "../utils/Services";


export default class Latest{
    chats:ChatVO[]=[];
    private profile?:ProfileVO;
    private hash:string|null=null;
    private sharedObject?:SharedObjectVO;
    private currentChat:ChatVO|null=null;
    private saveLastReadTimeoutID:any;
    private loadLocalData:boolean=true;
    private lastReadMsgNum:Map<string,number>=new Map(); // last read msg num

    constructor(){

        GD.S_LOGOUT.add(()=>{
            // clear local storage
            localStorage.removeItem("dcc_live_last_read");
            localStorage.removeItem("dcc_live_latest_hash");
            localStorage.removeItem("dcc_live_latest");
            this.profile=undefined;
        })

        GD.S_AUTH_COMPLETE.add(async data=>{
            this.profile=data.profile;

            if(this.sharedObject && this.sharedObject.messenger){
                //this.loadChats();
                return;
            }

            let epID:string="133";
            let promptMessage:string="Type your message...";
            if(this.sharedObject && this.sharedObject.entryPointId)
                epID=this.sharedObject.entryPointId;

            if(this.sharedObject && this.sharedObject.promptMessage)
                promptMessage=this.sharedObject.promptMessage;

            const resp=await GD.REQ_HTTP.invoke({
                method:"company.startChat",
                epID:epID,
                guestUID:(data.profile.type==="guest")?data.profile.uid:null
            })

            if(resp.error){
                GD.S_ALERT_ERROR.invoke("Can't open chat, \n"+resp.errorMsg);
                return;
            }

            if(!resp.data){
                GD.S_ALERT_ERROR.invoke("Can't open chat, no chat found");
                return;
            }

            const chat=resp.data as ChatVO;
            chat.securityKey = Services.companySequence;
            chat.promptMessage=promptMessage;
            if(this.sharedObject && this.sharedObject.title)
                chat.title=this.sharedObject.title;
            this.chats.push(chat);
            GD.S_CHAT_OPEN_REQUEST.invoke({chatUID:chat.uid});
            //GD.S_CHAT_OPENING.invoke(chat);

        })
        
        GD.S_SHARED_OBJECT_READY.add(so=>{
            this.sharedObject=so;
        })

        GD.S_LATEST_REQUEST.add(req=>{
            if(req.viaServer)
                this.loadChats();
                    else
                        this.fireLatest();
        });
        

        GD.S_CHAT_OPENED.add(cvo=>{
            if(this.sharedObject && !this.sharedObject.messenger)
                return;
            

            this.currentChat=cvo;
            this.fireLatest();
        })

        GD.S_CHAT_OPEN_REQUEST.add(req=>{
            
            if(req.chatUID){

                this.openChatByUID(req.chatUID)
            }
        })

        GD.REQ_SECURITY_KEY.listener=async (data,cb)=>{
            if(this.sharedObject && !this.sharedObject.messenger){
                cb(Services.companySequence);
                return;
            }
            let cvo=await this.getChatByUID(data.chatUID);
            if(!cvo){
                cb(null);
                return;
            }

            if(cvo.type==="company"){
                cb(Services.companySequence);
                return 
            }

            cb(cvo.securityKey);
        }

        GD.REQ_CHAT.listener=async (data,cb)=>{
            let cvo=await this.getChatByUID(data.chatUID);
            cb(cvo);
        }
        GD.S_SERVICE_READY.invoke("latest");

        GD.S_MESSAGE_ADDED.add(async msg=>{
            if(this.sharedObject && !this.sharedObject.messenger)
                return;
            if(!msg)
                return;
            let cvo=await this.getChatByUID(msg.chatUID);
            if(!cvo)
                return;
            if(msg.num===cvo.message?.num && msg.text===cvo.message?.text)
                return
            if(msg.num<cvo.message?.num)
                return;
            cvo.message=msg;
            this.setupChatTime(cvo)

            const curr=await GD.REQ_CURRENT_CHAT.invoke();
            if(curr && curr.uid===msg.chatUID)
                return; // do not fire when msg from opened chat
            
            this.fireLatest();
        });

        GD.S_MESSAGE_READ.add(msg=>{
            if(this.sharedObject && !this.sharedObject.messenger)
                return;
            this.lastReadMsgNum.set(msg.chatUID,msg.num);
            console.log("MSG READ");
            this.saveLastReadMsg();
            this.fireLatest();
        })

        GD.S_WS_AUTHORIZED.add(()=>{
            if(this.sharedObject && this.sharedObject.messenger){
                this.loadChats();

                return;
            }
        })
    }

    private saveLastReadMsg(){
        clearTimeout(this.saveLastReadTimeoutID)
        setTimeout(()=>{
            var arr=[];
            for(let i of this.lastReadMsgNum){
                if(i[0])
                    arr.push({uid:i[0],num:i[1]});
            }
            localStorage.setItem("dcc_live_last_read",JSON.stringify(arr));
        },5000)
    }

    private async getChatByUID(uid:string){
        
        let cvo=null;
        
        for(let i of this.chats){
            if(i.uid===uid){
                cvo=i;
                break;
            }
        }
        
        if(!cvo){

            const resp=await GD.REQ_HTTP.invoke({
                method:"chat.get",
                chatUID:uid,
            })

            if(resp.error){
                console.log("Can't get chat "+resp.errorMsg);
                return null;    
            }
            
            cvo=await this.addChat(resp.data,false,false)
            console.log(this.chats.length);
            this.saveLocalChats();
        }

        return cvo;
    }

    private async openChatByUID(uid:string){
        const cvo=await this.getChatByUID(uid);
        if(!cvo){
            //TODO: oad chat from server
            GD.S_ALERT_ERROR.invoke("Can't open chat, no chat found");
            return;
        }

        GD.S_CHAT_OPENING.invoke(cvo);
    }

    private async loadChats(){

        // load unread
        if(this.loadLocalData){
            const lastReadStr=localStorage.getItem("dcc_live_last_read")
            if(lastReadStr){
                try{
                    const lastRead=JSON.parse(lastReadStr);
                    for(let i of lastRead){
                        if(i.uid)
                            this.lastReadMsgNum.set(i.uid,i.num);
                    }
                }catch(e){
                    console.error("Can't setup last read msgs ",e);
                }
            }

            // load local chats
            const latestData=localStorage.getItem("dcc_live_latest");

            if(latestData){
                let chats;
                try{chats=JSON.parse(latestData);}catch(e){}
                if(chats){
                    for(let i of chats)
                        await this.addChat(i,false)
                    this.fireLatest();
                }
            }
            this.hash=localStorage.getItem("dcc_live_latest_hash");

            this.loadLocalData=false;

        }

        const resp=await GD.REQ_HTTP.invoke({
            method:"chat.hLatest",
            hash:this.hash,
        })

        if(resp.error){
            GD.S_LOGE.invoke("Can't get latest: "+resp.errorMsg);
            GD.S_TOAST.invoke("Can't update chats");
            return;
        }

        if(resp.data && "hash" in (resp.data as SimpleObjectVO))
            localStorage.setItem("dcc_live_latest_hash", (resp.data as SimpleObjectVO).hash);

        if(resp.data && "latest" in (resp.data as SimpleObjectVO) && Array.isArray((resp.data as SimpleObjectVO).latest)){
            const latest=(resp.data as SimpleObjectVO).latest;
            for(let i in latest)
                await this.addChat(latest[i],false);

            //store latest
            this.saveLocalChats();
            this.fireLatest();
        }
     }

     private saveLocalChats(){
        localStorage.setItem("dcc_live_latest",JSON.stringify(this.chats));
     }

     private async addChat(cvo:any,fireSignal=true,parseMessage:boolean=true){
        // Prepare chat
        const chatVO=await this.prepareChat(cvo,parseMessage);
        let found=-1;
        const l=this.chats.length;
        for(let i=0;i<l;i++){
            if(this.chats[i].uid===chatVO.uid){
                found=i;
                break;
            }
        }
        if(found>-1){
            this.chats[found]=chatVO;
        }else
            this.chats.push(chatVO);
            
        if(this.chats.length>500)
            this.chats.shift();
        if(fireSignal)
            this.fireLatest();
        return chatVO;
     }

     private async prepareChat(cvo:any,parseMessage:Boolean):Promise<ChatVO>{
        
        if(cvo.parsed)
            return cvo;

        if(cvo.securityKey==="company")
            cvo.securityKey=Services.companySequence;
        let title=cvo.title;

        if(title.startsWith("!"))
            cvo.title=Services.unpack(title.substr(1),cvo.securityKey)
        else{
            if(cvo.users){
                title="";
                for(let usr of cvo.users){
                   if(usr.uid===this.profile?.uid)
                        continue;
                    if(title!=="")
                        title+=", ";
                    title+=usr.name;
                }
                if(title!=="")
                    cvo.title=title;
            }
        }

        // MESSAGE
        if(cvo.message && parseMessage){
            let message=await GD.REQ_MESSAGE_PARSE_FROM_CHAT.invoke({chat:cvo});
            cvo.message=message;
        }

        // setupTime
        this.setupChatTime(cvo)
        cvo.parsed=true;
        return cvo;
     }

     private setupChatTime(cvo:ChatVO){
        let aTime=parseInt(cvo.created);
        let aMsgTime=(cvo.message)?parseInt(cvo.message.created):0;
        
        cvo.chatTime=(aMsgTime>aTime)?aMsgTime:aTime;
        cvo.chatTime=cvo.chatTime*1000;
        cvo.date=Services.dateFormatter.format(cvo.chatTime,"%d, %M, %y");
        cvo.time=Services.dateFormatter.format(cvo.chatTime,"%h:%i");
        cvo.DOY=Services.dateFormatter.getDayOfYear(cvo.chatTime);
        cvo.author=cvo.message?.user_name;
        if(cvo.message && cvo.message.user_uid===this.profile?.uid)
            cvo.author="you"
        if(cvo.type==="private" && cvo.message && cvo.message.user_uid!==this.profile?.uid)
            cvo.author=null;
     }

     private async fireLatest(){

        this.chats.sort((a,b)=>{
            
            if(a.chatTime>b.chatTime)
                return -1;
            
            if(b.chatTime>a.chatTime)
                return 1;

            return 0;
        })

        let prev:ChatVO|null=null;
        for(let i of this.chats){
            i.selected=false;
            i.position="standalone";
            if(prev && i.DOY===prev.DOY)
                i.position="middle"
            prev=i;
            if(this.currentChat && i.uid===this.currentChat.uid)
                i.selected=true;

            let lastRead=this.lastReadMsgNum.get(i.uid);
            if(!lastRead || lastRead<1)
                lastRead=-1;

            i.unread=99;
            if(lastRead>0 && i.message){
                let unread=i.message.num-lastRead;
                if(unread>99)
                    unread=99
                i.unread=unread;
            }
            if(i.message && i.message.user_uid===this.profile?.uid)
                i.unread=0;
            if(i.unread<0)
                i.unread=0;
        }

        GD.S_LATEST_READY.invoke(this.chats);
     }

}