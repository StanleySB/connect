import GD from "../GD";


class Users{
    private profile?:ProfileVO
    constructor(){
        GD.S_AUTH_COMPLETE.add(data=>{
            this.profile=data.profile;
        })
        GD.S_SERVICE_READY.invoke("users");
    }
}
export default Users;