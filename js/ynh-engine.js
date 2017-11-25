var MAP_WIDTH = 


// clases
class entity{
    constructor(sprite, x, y, rot, xScale, yScale, static){
		this.enable = true;
        this.sprite = sprite;
		this.x = x;
		this.y = y;
        this.rot = rot;
        this.xScale = xScale;
        this.yScale = yScale;
        this.static = static;
        this.dir = new Array(2);
        this.speed = 0;
	}	
    update(){
        if(this.enable && !this.static){
            //movemos la entidad segun su velocidad y direccion
            //primero normalizamos el vector direccion formado por hSpd y vSpd
            this.dir = normalize(this.dir);
            this.x += this.dir[0] * this.speed;
            this.y += this.dir[1] * this.speed;
        }
    }    
    render(context){
        if(this.enable){
            
        }
    }
}