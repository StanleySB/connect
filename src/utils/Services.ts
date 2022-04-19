import { DateFormatter } from "./DateFormatter";
import DCCAPI from "./DCCAPI";
import ImagePacker from "./ImagePacker";

export class Services{
    static dateFormatter:DateFormatter=new DateFormatter(); 
    static imagePacker:ImagePacker=new ImagePacker();
    static companySequence:string=".ap.iO.Oe.eT.tP.vHIqv.mI.xd.5WIJ"
    static systemSequence:string=".&70o}.?F";
    static pack=DCCAPI.pack;
    static unpack=DCCAPI.unpack;
    static getBaseNumber=DCCAPI.getBaseNumber;
    static getNumberByBase=DCCAPI.getNumberByBase;
}