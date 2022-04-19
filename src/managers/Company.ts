import GD from "../GD";

class Company{
    private profile?:ProfileVO;
    private so?:SharedObjectVO;
    constructor(){
        GD.S_SHARED_OBJECT_READY.add(so=>{
            this.so=so;
        })
        GD.S_AUTH_COMPLETE.add(data=>{
            this.profile=data.profile;
            if(this.so && this.so.messenger && this.profile){
                console.log(this.profile);
                this.getCompany();
            }
        })
        GD.S_SERVICE_READY.invoke("company");
    }

    private async getCompany(){
        const resp=await GD.REQ_HTTP.invoke({
            method:"company.get"
        })
        if(!resp || resp.error){
            console.error("Can't get company, "+resp.errorMsg);
            return;
        }
        console.log(resp);
    }
}

export default Company;