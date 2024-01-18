function endIfBlock(x, y, w, h){
    this.type = "endIfBlock";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
    this.grabed = false;
    this.lastGoodPosition = {x:x,y:y};
    this.err = false;
    this.grabPosition = {x: 0, y: 0};
    ID++;
    this.id = ID;
    this.points = [new point(x+w/2,y+h,"out","bottom"), new point(x,y+h/2,"in","left"), new point(x+w,y+h/2,"in","right")];
}

endIfBlock.prototype = {
    remove: function(){
        for(i=0; i<this.points.length; i++){
            for(j=0; j<lines.length; j++){
                if((this.points[i] == lines[j].a)||(this.points[i] == lines[j].b)){
                    lines[j].remove()
                    j--;
                }
            }
        }
        program.splice(program.indexOf(this),1);
    },
    render: function(){
        if(this.selected){
            ctx.strokeStyle = "blue";
        }
        else{
            ctx.strokeStyle = "black";
        }
        if(this.err){
            ctx.strokeStyle = "red";
        }
        
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        
        
        for(n=0; n<this.points.length; n++){
            this.points[n].render();     
        }
    },
    move: function(x,y){
        this.x = x;
        this.y = y;

        this.points[0].x = x+this.w/2;
        this.points[0].y = y+this.h;

        this.points[1].x = x;
        this.points[1].y = y+this.h/2;

        this.points[2].x = x+this.w;
        this.points[2].y = y+this.h/2;
    },
    isTouching: function(x,y){
        if(((this.x < x)&&(x < this.x+this.w))&&((this.y < y)&&(y < this.y+this.h))){
            var ok = true;
            for(n=0; n<this.points.length; n++){
                if(this.points[n].isTouching(x,y))ok = false;
            }

            if(ok)return true;
            else return false;
        }
        else{
            return false;
        }
    },
    isColliding: function(o){
        if((this.x < o.x+o.w)&&(o.x < this.x+this.w)){
            if((this.y < o.y+o.h)&&(o.y < this.y+this.h)){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    },
    neighbor: function(d){
        var point;
        for(e=0; e<this.points.length; e++){
            if(this.points[e].direction == d){
                for(f=0; f<lines.length; f++){
                    if(lines[f].a == this.points[e]){ 
                        point = lines[f].b;
                    }
                    if(lines[f].b == this.points[e]){ 
                        point = lines[f].a;
                    }
                }
            }
        }
        if(point == undefined){
            return false;
        }
        for(e=0; e<program.length; e++){
            for(f=0; f<program[e].points.length; f++){
                if(program[e].points[f] == point){ 
                    return program[e];
                }
            }
        }
    }
}