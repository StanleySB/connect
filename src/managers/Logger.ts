import GD from "../GD";

class Logger{
    private logs:boolean=false;
    private errors:boolean=false;
    constructor(){

        GD.S_SHARED_OBJECT_READY.add(so=>{
            if(so.enableLog){
                this.logs=true;
                this.errors=true;
            }
        })

        GD.S_LOG_AVAIALABLE.add(val=>{
            this.logs=val;
            this.errors=val;
        })

        GD.S_LOG.add((vals:any)=>{
            if(!this.logs)
                return;
            if(Array.isArray(vals))
                console.log.apply(this,vals);
            else
                console.log(vals)
        })
        GD.S_LOGE.add((vals:any)=>{
            if(!this.errors)
                return;
            if(Array.isArray(vals))
                console.error.apply(this,vals);
            else
                console.error(vals)
        })
        GD.S_SERVICE_READY.invoke("logger");
    }
}

export default Logger;