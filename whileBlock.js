function whileBlock(x, y, w, h, code){
    this.type = "whileBlock";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.minw = w;
    this.selected = false;
    this.grabed = false;
    this.lastGoodPosition = {x:x,y:y};
    this.err = false;
    this.grabPosition = {x: 0, y: 0};
    this.code = code;
    this.editing = false;
    ID++;
    this.id = ID;
    this.points = [new point(x+w/2,y,"in","top"), new point(x+w/2,y+h,"out","bottom"), new point(x,y+h/2,"in","left"), new point(x+w,y+h/2,"out","right")];
}

whileBlock.prototype = {
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
        this.resize();
        if(this.selected){
            ctx.strokeStyle = "blue";
        }
        else{
            ctx.strokeStyle = "black";
        }
        if(this.err){
            ctx.strokeStyle = "red";
        }
        
        var r = 10;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.x+r, this.y);
        ctx.lineTo(this.x+this.w-r, this.y);
        ctx.quadraticCurveTo(this.x+this.w, this.y, this.x+this.w, this.y+r);
        ctx.lineTo(this.x+this.w, this.y+this.h-r);
        ctx.quadraticCurveTo(this.x+this.w, this.y+this.h, this.x+this.w-r, this.y+this.h);
        ctx.lineTo(this.x+r, this.y+this.h);
        ctx.quadraticCurveTo(this.x, this.y+this.h, this.x, this.y+this.h-r);
        ctx.lineTo(this.x, this.y+r);
        ctx.quadraticCurveTo(this.x, this.y, this.x+r, this.y);
        ctx.fill();
        ctx.stroke();
        
        if(!this.editing){
            ctx.fillStyle = "black";
            ctx.font="18px Roboto"; 
            ctx.textAlign="center"; 
            ctx.fillText(this.code,this.x+this.w/2, this.y+this.h/1.5);
        }
            
        if((this.x + this.w > 200)&&(!this.grabed)){
            ctx.fillStyle = "white";
            ctx.fillRect(this.x+this.w/2-ctx.measureText("YES").width/2,this.y+this.h+20-10,ctx.measureText("YES").width,10+2);
            ctx.fillRect(this.x+this.w+5,this.y+this.h/2-5,ctx.measureText("NO").width,10+2);

            ctx.fillStyle = "black";
            ctx.font="10px Roboto"; 
            ctx.textAlign="center"; 
            // 크기 맞추기
            // ctx.fillText("IN",this.x+this.w/2, this.y-10);
            ctx.fillText("YES",this.x+this.w/2, this.y+this.h+20);
            ctx.fillText("NO",this.x+this.w+ctx.measureText("NO").width+5, this.y+this.h/2+5);
            // 크기 맞추기
            // ctx.fillText("RETURN",this.x-ctx.measureText("RETURN").width+5, this.y+this.h/2+4);
        }
        
        for(n=0; n<this.points.length; n++){
            this.points[n].render();     
        }
    },
    move: function(x,y){
        this.x = x;
        this.y = y;

        this.points[0].x = x+this.w/2;
        this.points[0].y = y;

        this.points[1].x = x+this.w/2;
        this.points[1].y = y+this.h;

        this.points[2].x = x;
        this.points[2].y = y+this.h/2;

        this.points[3].x = x+this.w;
        this.points[3].y = y+this.h/2;
    },
    resize: function(){
        ctx.font="18px Roboto"; 
        this.w = ctx.measureText(this.code).width+20;
        
        if(this.w < this.minw){
            this.w = this.minw;
        }
        
        this.move(this.x, this.y);
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
    },
    edit: function(){
        document.getElementById("text-box").style.display = "block";
        document.getElementById("text-box").style.top = this.y+yScroll+yOffset-this.h/2+18+"px";
        document.getElementById("text-box").style.left = this.x+xScroll+"px";
        document.getElementById("text").style.width = this.w+"px";
        document.getElementById("text").style.fontSize = "18px";
        document.getElementById("text").value = this.code;
        document.getElementById("text").focus();
    }
}