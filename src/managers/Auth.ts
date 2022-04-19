import GD from "../GD";

class Auth{

    private profile:ProfileVO|undefined;
    private scheme:string|null=null;
    private key:string="web";
    private devID:string|undefined|null;
    private sharedObject?:SharedObjectVO|null;
    private phoneAuth:number=-1;

    constructor(){
        this.init();
    }

    private async init(){
        this.scheme=(await GD.REQ_CONFIG_SCHEMES.invoke()).current;

        GD.S_SHARED_OBJECT_READY.add(so=>{ this.sharedObject=so; })

        GD.S_LOGOUT.add(()=>{
            this.removeLocalUser();
        })

        GD.S_REQUEST_AUTHENTICATE.add(()=>{
            // No need to authenticate when in messenger mode
            if(this.sharedObject && this.sharedObject.messenger){
                this.checkLocalUser();
                return;
            }
            if(this.sharedObject && this.sharedObject.payerAuthToken)
                this.authAsPayer(this.sharedObject.payerAuthToken);
            else if(this.sharedObject && this.sharedObject.traderAuthToken)
                this.authAsTrader(this.sharedObject.traderAuthToken,this.sharedObject.branch)
            else
                this.authAsGuest();
        })

       

        GD.S_AUTH_CHECK.add(cb=>{
            cb(this.key!=null && this.key.length>10);
        })

        GD.S_AUTH_REQUEST.add(async req=>{

            console.log("123");
            let resp=null;
            if(req.login.startsWith("!") || req.login==="bloom"){
                resp=await GD.REQ_HTTP.invoke({
                    method:"auth.web",
                    username:req.login,
                    password:req.password,
                    deviceName:"WebChat",
                    devID:this.getDevID(),
                    appVersion:4,
                })
            }else{
                 resp=await GD.REQ_HTTP.invoke({
                    method:"auth.ldap",
                    login:req.login,
                    pass:req.password,
                    deviceName:"WebChat",
                    devID:this.getDevID(),
                    appVersion:4,
                    createUser:true
                })
            }

            

            if(resp.error){
                let err=resp.errorMsg;
                if(!err)
                    err="Unknown error"
                GD.S_AUTH_ERROR.invoke(err);
                return;
            }

            if(req.remember)
                localStorage.setItem("chat_user_"+this.scheme,JSON.stringify(resp.data));

            this.authorized(resp.data);
        })



        GD.S_AUTH_REQUEST_BY_PHONE.add(async req=>{

            this.phoneAuth=parseInt(req.phone);

            const resp=await GD.REQ_HTTP.invoke({
                method:"auth.requestCode",
                phone:this.phoneAuth,
                devID:this.getDevID(),
            })
            if(resp.error){
                let err=resp.errorMsg;
                if(!err)
                    err="Unknown error"
                GD.S_AUTH_ERROR.invoke(err);
                return;
            }
            GD.S_AUTH_CODE_REQUESTED.invoke();
        })


        GD.REQ_CURRENT_PROFILE.listener=(data,cb)=>{
            cb(this.profile);
        }

        GD.S_AUTH_CHECK_CODE.add(async req=>{
            const resp=await GD.REQ_HTTP.invoke({
                method:"auth.checkCode",
                code:req.code,
                devID:this.getDevID(),
                buildVer:"web_test_0.1",
                phone:this.phoneAuth,
                appVersion:"2",
                ver:1,
                deviceName:navigator.userAgent
            })
            if(resp.error){
                let err=resp.errorMsg;
                if(!err)
                    err="Unknown error"
                GD.S_AUTH_ERROR.invoke(err);
                return;
            }
            
            if(req.remember)
                localStorage.setItem("chat_user_"+this.scheme,JSON.stringify(resp.data));

            if(resp.data && (resp.data as SimpleObjectVO).profile)
                (resp.data as SimpleObjectVO).profile.isMobileUser=true;
            this.authorized(resp.data);
        })

        GD.S_SERVICE_READY.invoke("auth");
    }

    private removeLocalUser(){
        localStorage.removeItem("chat_user_"+this.scheme);
        this.profile=undefined;
        this.key="web"
    }

    private checkLocalUser(){
        const usrString=localStorage.getItem("chat_user_"+this.scheme);
        if(!usrString){
            GD.S_NEED_AUTHENTICATE.invoke();
            return;
        }
        let user=null;
        try{
            user=JSON.parse(usrString);
        }catch(e){
            GD.S_NEED_AUTHENTICATE.invoke();
            return;
        }
        this.authorized(user);
    }

    private getDevID(){
        if(this.devID)
            return this.devID
        this.devID=localStorage.getItem("chat_devid_"+this.scheme);
        if(!this.devID){
            this.devID=btoa((Math.random()*10000+(+new Date().getTime()))+navigator.userAgent).substr(0,64);
            localStorage.setItem("chat_devid_"+this.scheme,this.devID);
        }
        return this.devID;
    }

    private async authAsTrader(token:string,branch:"demo"|"live"){

        if(!token){
            this.authAsGuest();
            return;
        }

        const resp=await GD.REQ_HTTP.invoke({
            method:"auth.fxtrader",
            token:((branch==="live")?"2":"3")+token, 
            devID:this.getDevID(),
            deviceName:"WebChat",
            appVersion:3,
            sts:true,
            deployedVersion:"widget-mobile.js"
        });

        /*{
            "token": "3368bb48be458e8a68a145557ac7c064e8568f3d28de028bb4eeb80424285e69f",
            "devID": "aad7ead9596c0f862d1443626673329e14b4793c8f61ef62bb4b4a11c2a34f9b",
            "appVersion": 3,
            "sts": true,
            "deviceName": "MacIntel, Chrome/97.0.4692.99, Google Inc.",
            "method": "auth.fxtrader",
            "key": "web",
            "deployedVersion": "chat.js.62"
        }*/
        
        if(resp.error){
            GD.S_AUTH_ERROR.invoke("Can't authorize as registered bank user");
            GD.S_LOGE.invoke(resp.errorMsg);
            if(resp.errorMsg){
                if(resp.errorMsg.indexOf("::")>-1){
                    resp.errorMsg=resp.errorMsg.split("::")[1];
                    const mask="validateToken:";
                    const index=resp.errorMsg.indexOf(mask);
                    if(index>-1)
                        resp.errorMsg=resp.errorMsg.substring(index+mask.length);
                }
                else
                    resp.errorMsg=resp.errorMsg?.substring(8);
                GD.S_ALERT_ERROR.invoke(resp.errorMsg);
            }
            this.authAsGuest();
            return;
        }

        if(this.sharedObject)
            this.sharedObject.payerAuthToken=null;

        delete this.sharedObject?.payerAuthToken;
        this.authorized(resp.data);

    }

    private async authAsPayer(token:string){
        if(!token){
            this.authAsGuest();
            return;
        }

        const resp=await GD.REQ_HTTP.invoke({
            method:"auth.payer",
            token:token
        });

        // 3

        if(resp.error){
            GD.S_AUTH_ERROR.invoke("Can't authorize as registered bank user");
            GD.S_LOGE.invoke(resp.errorMsg);
            this.authAsGuest();
            return;
        }
        if(this.sharedObject)
            this.sharedObject.payerAuthToken=null;
        delete this.sharedObject?.payerAuthToken;
        this.authorized(resp.data);
    }

    private async authAsGuest(){
        const guestString=localStorage.getItem("chat_widget_guest_"+this.scheme)

        if(guestString!=null){
            let guestObject=null;
            try{
                guestObject=JSON.parse(guestString);
            }catch(e){}

            if(guestObject!=null){
                GD.S_LOG.invoke("Guest authorized from cache")
                this.authorized(guestObject)
                return;
            }
        }

        const resp=await GD.REQ_HTTP.invoke({
            method:"auth.guest"
        });

        if(resp.error){
            GD.S_AUTH_ERROR.invoke("Can't authorize as guest");
            GD.S_LOG.invoke(resp.errorMsg);
            return;
        }
        localStorage.setItem("chat_widget_guest_"+this.scheme,JSON.stringify(resp.data))
        this.authorized(resp.data);
    }

    private authorized(data:any){
        /*if(!data || !("profile" in data) ||  !("key" in data))
            return;*/
        this.key=data.authKey;
        this.profile=data.profile;
        const packet={profile:this.profile as ProfileVO,key:this.key};
        GD.S_LOG.invoke(["Authorized as:",packet]);
        GD.S_AUTH_COMPLETE.invoke(packet);
    }
}
export default Auth;


