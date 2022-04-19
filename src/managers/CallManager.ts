import GD from "../GD";

class CallManager{

    profile?:ProfileVO;
    activeCall?:CallVO;

    peerConnection?:RTCPeerConnection;
    
    webRTCConfig={
        iceServers:[
            {urls:"stun:stun.l.google.com:19302"},
            {urls:'stun:stun1.l.google.com:19302'},
            {urls:'stun:stun2.l.google.com:19302'},
            {urls:'stun:stun3.l.google.com:19302'},
            {urls:'stun:stun4.l.google.com:19302'},
            {urls:'stun:stunserver.org'}
        ]
    }

    constructor(){
        GD.S_AUTH_COMPLETE.add(data=>{
            this.profile=data.profile;
        })

        GD.S_LOGOUT.add(()=>{
            this.finishCall();
        })

        GD.S_WS_MSG.add(msg=>{
            if(msg.method!=="blackHole")
                return;
            if(!this.profile)
                return;
            if((msg.data as BlackHoleData).data.method.indexOf("call_")===-1)
                return;
            if((msg.data as BlackHoleData).sender===this.profile.uid)
                return;
            this.onWSPacket((msg.data as BlackHoleData).data.method,(msg.data as BlackHoleData).data.data);
        })

        GD.S_CALL_ACCEPT.add(data=>{
            this.callAccepted(data);
        })


        GD.S_REQUEST_CALL.add(data=>{
            if(data.chatVO){

                // DESTINATION
                if(!Array.isArray(data.chatVO.users)){
                    console.error("No user to call");
                    GD.S_ALERT_ERROR.invoke("NO USER TO CALL");
                    return;
                }

                if(!this.profile)
                    return;

                const participians:{name:string,uid:string,avatar:string}[]=[
                    {
                        name:this.profile.name,
                        uid:this.profile.uid,
                        avatar:this.profile.avatar
                    }
                ];

                for(let i of data.chatVO.users){
                    participians.push({
                        name:i.name,
                        uid:i.uid,
                        avatar:i.avatar
                    });
                }

                if(participians.length<2 || participians.length>10){
                    console.error("Call avaiable only for 2 to 10 persons");
                    GD.S_ALERT_ERROR.invoke("Call avaiable only for 2 to 10 persons");
                    return;
                }
                
                this.startCalling(participians,data.audio,data.video);
            }
        });

        GD.S_SERVICE_READY.invoke("call");
    }

    private async startCalling(participians:{name:string,uid:string,avatar:string}[],audio:boolean,video:boolean){
        if(this.activeCall)
            this.finishCall();

        if(!this.profile || !this.profile.uid)
            return;

        let callID=btoa((+new Date())+"_"+Math.random()*10000+"_"+this.profile.uid);

        // CREATE CALL VO
        this.activeCall={
            participians:participians,
            audio:audio,
            video:video,
            callID:callID,
            side:"caller",
            localStream:null,
            remoteStream:null
        }

        this.sendCall();
        GD.S_CALL_PLACED.invoke(this.activeCall);
        
    }

    private sendCall(){
        if(!this.activeCall)
            return;
       this.send("call_place",{
            callee:{
                uid:this.profile?.uid,
                avatar:this.profile?.avatar,
                name:this.profile?.name
            },
            call:{
                callID:this.activeCall.callID,
                audio:this.activeCall.audio,
                video:this.activeCall.video,
                participians:this.activeCall.participians
            }
       })
    }


   
    
    // CALLEE SIDE
    private async callAccepted(data:BlackHoleDataCall){
        
        if(this.activeCall)
            this.finishCall();

        if(!this.profile)
            return;

        this.activeCall={
            callID:data.call.callID,
            audio:true,
            video:true,
            participians:data.call.participians,
            side:"callee",
            localStream:null,
            remoteStream:null
        }

        GD.S_CALL_ACCEPTED.invoke(this.activeCall);

        await this.createConnection();

        this.send("call_accepted",{
            callID:this.activeCall.callID,
            acceptor:this.profile?.uid
        })
        
    }


    // CALLER SIDE
    // call accepted, need to create connection, create offer and send it to callee
    private async callAcceptedByCallee(data:{callID:string,acceptor:string}){
        
        if(!this.profile)
            return;

        if(!this.activeCall || this.activeCall.callID!==data.callID)
            return;

        console.log("Call accepted by callee, make peer on caller side ",this.activeCall.side,data);

        // TODO: MAKE ARRAY FOR EACH CALLEE, passing userUID
        await this.createConnection();
        if(!this.peerConnection){
            console.error("NO PEER CONN")
            return;
        }

        try{
            // create offer to send
            const offer=await this.peerConnection.createOffer({
                offerToReceiveAudio:this.activeCall.audio,
                offerToReceiveVideo:this.activeCall.video
            })

            // 5. set local description
            await this.peerConnection.setLocalDescription(offer);
            this.sendOffer(offer);

        }catch(e){
            console.error("Can't create offer!")
        }

        GD.S_CALL_CALLEE_ACCEPT_CALL.invoke(this.activeCall);
       
    }

    private sendOffer(offer:RTCSessionDescriptionInit){
        if(!this.profile)
            return;

        if(!this.activeCall)
            return;

        this.send("call_offer",{
            offer:(offer as any).toJSON(),
            userUID:this.profile.uid,
            callID:this.activeCall.callID
        })
    }

    // CALLEE GOT OFFER, CREATE CONNECTION
    private async gotOffer(data:{offer:any,userUID:string,callID:string}){
        console.log("GOT OFFER SIDE: "+this.activeCall?.side);
        
        //await this.createConnection(data.userUID);
        await this.peerConnection?.setRemoteDescription(data.offer);
        const answer=await this.peerConnection?.createAnswer({
            offerToReceiveAudio:this.activeCall?.audio,
            offerToReceiveVideo:this.activeCall?.video
        });
        await this.peerConnection?.setLocalDescription(answer);

        this.send("call_answer",{
            answer:answer,
            userUID:this.profile?.uid,
            callID:data.callID
        });
    }

    private async gotAnswer(data:{answer:any,userUID:string,callID:string}){
        try{
            await this.peerConnection?.setRemoteDescription(data.answer);
        }catch(e){
            console.error("Can't set answer: ",e)
        }
    }

    private async gotCandidate(data:any){
        if(!data)
            return;
        if(!this.peerConnection)
            return;
        try{
            await this.peerConnection.addIceCandidate(data);
            console.log("CAND ADDED");
        }catch(e){
            console.error("Can't add candidate: ",data)
        }
    }

    private async createConnection(offer?:any,userUID?:string){
        if(!this.activeCall)
            return;

        this.peerConnection=new RTCPeerConnection(this.webRTCConfig);
        this.peerConnection.onicecandidate=e=>{
            console.log("ICE CANDIDATE: ",e);
            this.send("call_ice_candidate",e.candidate?.toJSON());
        }
        this.peerConnection.onconnectionstatechange=e=>{
            console.log("CONN STATE CHAGED: ",e);
        }
        this.peerConnection.onicegatheringstatechange=e=>{
            console.log("ICE GATHERING CHANGE: ",e);
        }
        this.peerConnection.onicecandidateerror=e=>{
            console.log("ICE CANDIDATE ERROR: ",e);
        }

        this.peerConnection.ontrack=e=>{
            if(!this.activeCall)
                return;
            if(!this.activeCall.remoteStream)
                this.activeCall.remoteStream=new MediaStream();
            this.activeCall.remoteStream.addTrack(e.track);
            GD.S_CALL_REMOTE_STREAM_READY.invoke(this.activeCall);
        }

        if(!this.activeCall.localStream)
            await this.createLocalStream();

        // TODO: LOCAL STREAM NOT CREATED
        if(!this.activeCall.localStream)
            return;

        // ATTACH STREAM TO PEER
        this.activeCall.localStream.getTracks().forEach(track=>this.peerConnection?.addTrack(track));
    }

    private async createLocalStream(){
        let localStream:MediaStream|null=null;
         try{
             localStream=await navigator.mediaDevices.getUserMedia(
                 {
                     audio:this.activeCall?.audio,
                     video:this.activeCall?.video
                 }
             )
         }catch(e){
             console.error("Can't get media: "+e);
             GD.S_ALERT_ERROR.invoke("Can't get media: "+e);
             return;
         }
 
         if(!localStream){
             console.error("Can't place call, no media found");
             GD.S_ALERT_ERROR.invoke("Can't place call, no media found");
         }
 
         if(this.activeCall){
             this.activeCall.localStream=localStream;
             GD.S_CALL_LOCAL_MEDIA_READY.invoke(this.activeCall);
         }
    }
    

    


    private finishCall(){

    }

    private send(method:String,data:any){

        if(!this.activeCall)
            return;
        if(!this.profile)
            return;

        let uids:string[]=[];
        for(let i of this.activeCall?.participians){
            if(i.uid!==this.profile.uid)
                uids.push(i.uid);
        }

        GD.S_WS_SEND.invoke({
            method:"blackHole",
            data:{
                mode:"user",
                userUIDs:uids,
                data:{
                    method:method,
                    data:data
                }
            }
        })
    }

    private onWSPacket(method:string,data:any){
        if(method==="call_place"){
            GD.S_CALL_INCOMING.invoke(data as BlackHoleDataCall);
            return;
        }
        if(method==="call_offer"){
            // CALL WAS ACCEPTED BY CALLEE
            this.gotOffer(data);
        }
        if(method==="call_answer"){
            // CALL WAS ACCEPTED BY CALLEE
            this.gotAnswer(data);
        }
        if(method==="call_accepted"){
            // CALL WAS ACCEPTED BY CALLEE
            this.callAcceptedByCallee(data)
        }
        if(method==="call_ice_candidate"){
            this.gotCandidate(data);
            return;
        }
    }

}

export default CallManager;


/*{url:'stun:stun01.sipphone.com'},
{url:'stun:stun.ekiga.net'},
{url:'stun:stun.fwdnet.net'},
{url:'stun:stun.ideasip.com'},
{url:'stun:stun.iptel.org'},
{url:'stun:stun.rixtelecom.se'},
{url:'stun:stun.schlund.de'},
{url:'stun:stun.l.google.com:19302'},
{url:'stun:stun1.l.google.com:19302'},
{url:'stun:stun2.l.google.com:19302'},
{url:'stun:stun3.l.google.com:19302'},
{url:'stun:stun4.l.google.com:19302'},
{url:'stun:stunserver.org'},
{url:'stun:stun.softjoys.com'},
{url:'stun:stun.voiparound.com'},
{url:'stun:stun.voipbuster.com'},
{url:'stun:stun.voipstunt.com'},
{url:'stun:stun.voxgratia.org'},
{url:'stun:stun.xten.com'},
{
	url: 'turn:numb.viagenie.ca',
	credential: 'muazkh',
	username: 'webrtc@live.com'
},
{
	url: 'turn:192.158.29.39:3478?transport=udp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
},
{
	url: 'turn:192.158.29.39:3478?transport=tcp',
	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
	username: '28224511:1379330808'
}*/



/*stun:
stun.l.google.com:19302,
stun1.l.google.com:19302,
stun2.l.google.com:19302,
stun3.l.google.com:19302,
stun4.l.google.com:19302,
stun.ekiga.net,
stun.ideasip.com,
stun.rixtelecom.se,
stun.schlund.de,
stun.stunprotocol.org:3478,
stun.voiparound.com,
stun.voipbuster.com,
stun.voipstunt.com,
stun.voxgratia.org

23.21.150.121:3478
iphone-stun.strato-iphone.de:3478
numb.viagenie.ca:3478
s1.taraba.net:3478
s2.taraba.net:3478
stun.12connect.com:3478
stun.12voip.com:3478
stun.1und1.de:3478
stun.2talk.co.nz:3478
stun.2talk.com:3478
stun.3clogic.com:3478
stun.3cx.com:3478
stun.a-mm.tv:3478
stun.aa.net.uk:3478
stun.acrobits.cz:3478
stun.actionvoip.com:3478
stun.advfn.com:3478
stun.aeta-audio.com:3478
stun.aeta.com:3478
stun.alltel.com.au:3478
stun.altar.com.pl:3478
stun.annatel.net:3478
stun.antisip.com:3478
stun.arbuz.ru:3478
stun.avigora.com:3478
stun.avigora.fr:3478
stun.awa-shima.com:3478
stun.awt.be:3478
stun.b2b2c.ca:3478
stun.bahnhof.net:3478
stun.barracuda.com:3478
stun.bluesip.net:3478
stun.bmwgs.cz:3478
stun.botonakis.com:3478
stun.budgetphone.nl:3478
stun.budgetsip.com:3478
stun.cablenet-as.net:3478
stun.callromania.ro:3478
stun.callwithus.com:3478
stun.cbsys.net:3478
stun.chathelp.ru:3478
stun.cheapvoip.com:3478
stun.ciktel.com:3478
stun.cloopen.com:3478
stun.colouredlines.com.au:3478
stun.comfi.com:3478
stun.commpeak.com:3478
stun.comtube.com:3478
stun.comtube.ru:3478
stun.cope.es:3478
stun.counterpath.com:3478
stun.counterpath.net:3478
stun.cryptonit.net:3478
stun.darioflaccovio.it:3478
stun.datamanagement.it:3478
stun.dcalling.de:3478
stun.decanet.fr:3478
stun.demos.ru:3478
stun.develz.org:3478
stun.dingaling.ca:3478
stun.doublerobotics.com:3478
stun.drogon.net:3478
stun.duocom.es:3478
stun.dus.net:3478
stun.e-fon.ch:3478
stun.easybell.de:3478
stun.easycall.pl:3478
stun.easyvoip.com:3478
stun.efficace-factory.com:3478
stun.einsundeins.com:3478
stun.einsundeins.de:3478
stun.ekiga.net:3478
stun.epygi.com:3478
stun.etoilediese.fr:3478
stun.eyeball.com:3478
stun.faktortel.com.au:3478
stun.freecall.com:3478
stun.freeswitch.org:3478
stun.freevoipdeal.com:3478
stun.fuzemeeting.com:3478
stun.gmx.de:3478
stun.gmx.net:3478
stun.gradwell.com:3478
stun.halonet.pl:3478
stun.hellonanu.com:3478
stun.hoiio.com:3478
stun.hosteurope.de:3478
stun.ideasip.com:3478
stun.imesh.com:3478
stun.infra.net:3478
stun.internetcalls.com:3478
stun.intervoip.com:3478
stun.ipcomms.net:3478
stun.ipfire.org:3478
stun.ippi.fr:3478
stun.ipshka.com:3478
stun.iptel.org:3478
stun.irian.at:3478
stun.it1.hr:3478
stun.ivao.aero:3478
stun.jappix.com:3478
stun.jumblo.com:3478
stun.justvoip.com:3478
stun.kanet.ru:3478
stun.kiwilink.co.nz:3478
stun.kundenserver.de:3478
stun.l.google.com:19302
stun.linea7.net:3478
stun.linphone.org:3478
stun.liveo.fr:3478
stun.lowratevoip.com:3478
stun.lugosoft.com:3478
stun.lundimatin.fr:3478
stun.magnet.ie:3478
stun.manle.com:3478
stun.mgn.ru:3478
stun.mit.de:3478
stun.mitake.com.tw:3478
stun.miwifi.com:3478
stun.modulus.gr:3478
stun.mozcom.com:3478
stun.myvoiptraffic.com:3478
stun.mywatson.it:3478
stun.nas.net:3478
stun.neotel.co.za:3478
stun.netappel.com:3478
stun.netappel.fr:3478
stun.netgsm.com.tr:3478
stun.nfon.net:3478
stun.noblogs.org:3478
stun.noc.ams-ix.net:3478
stun.node4.co.uk:3478
stun.nonoh.net:3478
stun.nottingham.ac.uk:3478
stun.nova.is:3478
stun.nventure.com:3478
stun.on.net.mk:3478
stun.ooma.com:3478
stun.ooonet.ru:3478
stun.oriontelekom.rs:3478
stun.outland-net.de:3478
stun.ozekiphone.com:3478
stun.patlive.com:3478
stun.personal-voip.de:3478
stun.petcube.com:3478
stun.phone.com:3478
stun.phoneserve.com:3478
stun.pjsip.org:3478
stun.poivy.com:3478
stun.powerpbx.org:3478
stun.powervoip.com:3478
stun.ppdi.com:3478
stun.prizee.com:3478
stun.qq.com:3478
stun.qvod.com:3478
stun.rackco.com:3478
stun.rapidnet.de:3478
stun.rb-net.com:3478
stun.refint.net:3478
stun.remote-learner.net:3478
stun.rixtelecom.se:3478
stun.rockenstein.de:3478
stun.rolmail.net:3478
stun.rounds.com:3478
stun.rynga.com:3478
stun.samsungsmartcam.com:3478
stun.schlund.de:3478
stun.services.mozilla.com:3478
stun.sigmavoip.com:3478
stun.sip.us:3478
stun.sipdiscount.com:3478
stun.sipgate.net:10000
stun.sipgate.net:3478
stun.siplogin.de:3478
stun.sipnet.net:3478
stun.sipnet.ru:3478
stun.siportal.it:3478
stun.sippeer.dk:3478
stun.siptraffic.com:3478
stun.skylink.ru:3478
stun.sma.de:3478
stun.smartvoip.com:3478
stun.smsdiscount.com:3478
stun.snafu.de:3478
stun.softjoys.com:3478
stun.solcon.nl:3478
stun.solnet.ch:3478
stun.sonetel.com:3478
stun.sonetel.net:3478
stun.sovtest.ru:3478
stun.speedy.com.ar:3478
stun.spokn.com:3478
stun.srce.hr:3478
stun.ssl7.net:3478
stun.stunprotocol.org:3478
stun.symform.com:3478
stun.symplicity.com:3478
stun.sysadminman.net:3478
stun.t-online.de:3478
stun.tagan.ru:3478
stun.tatneft.ru:3478
stun.teachercreated.com:3478
stun.tel.lu:3478
stun.telbo.com:3478
stun.telefacil.com:3478
stun.tis-dialog.ru:3478
stun.tng.de:3478
stun.twt.it:3478
stun.u-blox.com:3478
stun.ucallweconn.net:3478
stun.ucsb.edu:3478
stun.ucw.cz:3478
stun.uls.co.za:3478
stun.unseen.is:3478
stun.usfamily.net:3478
stun.veoh.com:3478
stun.vidyo.com:3478
stun.vipgroup.net:3478
stun.virtual-call.com:3478
stun.viva.gr:3478
stun.vivox.com:3478
stun.vline.com:3478
stun.vo.lu:3478
stun.vodafone.ro:3478
stun.voicetrading.com:3478
stun.voip.aebc.com:3478
stun.voip.blackberry.com:3478
stun.voip.eutelia.it:3478
stun.voiparound.com:3478
stun.voipblast.com:3478
stun.voipbuster.com:3478
stun.voipbusterpro.com:3478
stun.voipcheap.co.uk:3478
stun.voipcheap.com:3478
stun.voipfibre.com:3478
stun.voipgain.com:3478
stun.voipgate.com:3478
stun.voipinfocenter.com:3478
stun.voipplanet.nl:3478
stun.voippro.com:3478
stun.voipraider.com:3478
stun.voipstunt.com:3478
stun.voipwise.com:3478
stun.voipzoom.com:3478
stun.vopium.com:3478
stun.voxgratia.org:3478
stun.voxox.com:3478
stun.voys.nl:3478
stun.voztele.com:3478
stun.vyke.com:3478
stun.webcalldirect.com:3478
stun.whoi.edu:3478
stun.wifirst.net:3478
stun.wwdl.net:3478
stun.xs4all.nl:3478
stun.xtratelecom.es:3478
stun.yesss.at:3478
stun.zadarma.com:3478
stun.zadv.com:3478
stun.zoiper.com:3478
stun1.faktortel.com.au:3478
stun1.l.google.com:19302
stun1.voiceeclipse.net:3478
stun2.l.google.com:19302
stun3.l.google.com:19302
stun4.l.google.com:19302
stunserver.org:3478

turn:
turn:turn01.hubl.in?transport=udp
turn:turn02.hubl.in?transport=tcp

{
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
},
{
    url: 'turn:192.158.29.39:3478?transport=udp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
},
{
    url: 'turn:192.158.29.39:3478?transport=tcp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
},
{
    url: 'turn:turn.bistri.com:80',
    credential: 'homeo',
    username: 'homeo'
 },
 {
    url: 'turn:turn.anyfirewall.com:443?transport=tcp',
    credential: 'webrtc',
    username: 'webrtc'
}*/




/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 

'use strict';

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
startButton.addEventListener('click', start);
callButton.addEventListener('click', call);
hangupButton.addEventListener('click', hangup);

let startTime;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

localVideo.addEventListener('loadedmetadata', function() {
  console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('loadedmetadata', function() {
  console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('resize', () => {
  console.log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
  // We'll use the first onsize callback as an indication that video has started
  // playing out.
  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
    startTime = null;
  }
});

let localStream;
let pc1;
let pc2;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function getName(pc) {
  return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
  return (pc === pc1) ? pc2 : pc1;
}

async function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    console.log('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}

async function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  console.log('Starting call');
  startTime = window.performance.now();
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  const configuration = {};
  console.log('RTCPeerConnection configuration:', configuration);
  pc1 = new RTCPeerConnection(configuration);
  console.log('Created local peer connection object pc1');
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
  pc2 = new RTCPeerConnection(configuration);
  console.log('Created remote peer connection object pc2');
  pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
  pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
  pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
  pc2.addEventListener('track', gotRemoteStream);

  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
  console.log('Added local stream to pc1');

  try {
    console.log('pc1 createOffer start');
    const offer = await pc1.createOffer(offerOptions);
    await onCreateOfferSuccess(offer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

async function onCreateOfferSuccess(desc) {
  console.log(`Offer from pc1\n${desc.sdp}`);
  console.log('pc1 setLocalDescription start');
  try {
    await pc1.setLocalDescription(desc);
    onSetLocalSuccess(pc1);
  } catch (e) {
    onSetSessionDescriptionError();
  }

  console.log('pc2 setRemoteDescription start');
  try {
    await pc2.setRemoteDescription(desc);
    onSetRemoteSuccess(pc2);
  } catch (e) {
    onSetSessionDescriptionError();
  }

  console.log('pc2 createAnswer start');
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  try {
    const answer = await pc2.createAnswer();
    await onCreateAnswerSuccess(answer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

function onSetLocalSuccess(pc) {
  console.log(`${getName(pc)} setLocalDescription complete`);
}

function onSetRemoteSuccess(pc) {
  console.log(`${getName(pc)} setRemoteDescription complete`);
}

function onSetSessionDescriptionError(error) {
  console.log(`Failed to set session description: ${error.toString()}`);
}

function gotRemoteStream(e) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
    console.log('pc2 received remote stream');
  }
}

async function onCreateAnswerSuccess(desc) {
  console.log(`Answer from pc2:\n${desc.sdp}`);
  console.log('pc2 setLocalDescription start');
  try {
    await pc2.setLocalDescription(desc);
    onSetLocalSuccess(pc2);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
  console.log('pc1 setRemoteDescription start');
  try {
    await pc1.setRemoteDescription(desc);
    onSetRemoteSuccess(pc1);
  } catch (e) {
    onSetSessionDescriptionError(e);
  }
}

async function onIceCandidate(pc, event) {
  try {
    await (getOtherPc(pc).addIceCandidate(event.candidate));
    onAddIceCandidateSuccess(pc);
  } catch (e) {
    onAddIceCandidateError(pc, e);
  }
  console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess(pc) {
  console.log(`${getName(pc)} addIceCandidate success`);
}

function onAddIceCandidateError(pc, error) {
  console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
}

function hangup() {
  console.log('Ending call');
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}*/