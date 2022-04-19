/**
 * @author Igor Bloom
 */
class ImagePacker{

	private algorithm:string = '';
	private readonly thumb_size:number = 300;
	
	private algorithmID():string {
		if  (this.algorithm === ''){
			var aa = [0xff, 0xff, 0xdd, 0xdd, 0xff, 0xff];
			for (let i in aa)
				this.algorithm += String.fromCharCode(aa[i]);
		}
		return this.algorithm; 
	}

	get2ImagesForSend (theImage:HTMLImageElement, secKey:string):string[]|null{ 
		const thumb:HTMLCanvasElement = document.createElement('canvas');
		const context:CanvasRenderingContext2D|null = thumb.getContext("2d");
        
        if(!context)
            return null;

		thumb.width = theImage.width;
		thumb.height = theImage.height;
		context.drawImage(theImage, 0, 0);

		var big:string = thumb.toDataURL("image/jpeg");
		var nn:number = big.indexOf(",") + 1;
		big = big.substr(nn);
		context.clearRect(0, 0, thumb.width, thumb.height);
		
		thumb.width = thumb.height = this.thumb_size;
		var ww:number = theImage.width;
		var hh:number = theImage.height;
		
		if (hh>ww) {
			hh = ww;
		} else {
			ww = hh;
		}
		context.drawImage(theImage, 0, 0, ww, hh, 0, 0, this.thumb_size, this.thumb_size);
		var small:string = thumb.toDataURL("image/jpeg");
		nn = small.indexOf(",") + 1;
		small = small.substr(nn);
		
		big = atob(big);
		small = atob(small);

		//encrypted
		big = this.encrypt(big, secKey);
		small = this.encrypt(small, secKey);
		
		//convert to base 64 for sending ??? TODO
		big = btoa(big);
		small = btoa(small);
	
		return [big, small];
	}
	
	decrypt(buf:any, key:string):string|null {
		if (buf[0] !== 1) 
			return null;
		var m = 0;
		var lk = key.length;
		var lb = buf.byteLength;
		var ss = '';
		var nn;
		
		for (let i=lb-6;i<lb;i++) {
			nn = buf[i];
			nn = nn < 0?(256 + nn):nn;
			ss += String.fromCharCode(nn);
		}
		if (ss === this.algorithmID()){
			lb -= 6;
		}
		ss = '';
		for (let i=1;i<lb;i++) {
			nn = buf[i] - key.charCodeAt(m);
			nn = nn<0?(256 + nn):nn;
			ss += String.fromCharCode(nn);
			m = ++m < lk? m:0;
		}
		return ss;
	}

    encrypt(data:string, key:string):string{
		let m = 0;
		let nn;
		const lk = key.length;
		const ld = data.length;
		let ss:string = String.fromCharCode(1);
		for (let i=0;i<ld;i++) {
			nn = data.charCodeAt(i) + key.charCodeAt(m);
			nn = nn>255?(nn - 256):nn;
			ss += String.fromCharCode(nn);
			m = ++m < lk? m:0;
		}
		ss += this.algorithmID();
		return ss;
	}
	
	decryptURL(url:string, key:string,callback?:(value:string)=>void):void{
		var xhr = new XMLHttpRequest();
		xhr.onload = (e)=>{
			var ss = this.decrypt(xhr.response, key);
            if(ss==null)
                return;
			ss = 'data:image/jpeg;base64,' + btoa(ss);
			if(callback!=null)
                callback (ss);
		}
		xhr.responseType = 'arraybuffer';
		xhr.open("get", url, true);
		xhr.send();
	}
	
	
}
export default ImagePacker