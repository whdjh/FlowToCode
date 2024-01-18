function startBlock(x, y, w, h, c, e){
    this.type = "startBlock";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.code = c;
    this.editable = e;
    this.selected = false;
    this.grabed = false;
    this.lastGoodPosition = {x:x,y:y};
    this.err = false;
    this.grabPosition = {x: 0, y: 0};
    ID++;
    this.id = ID;
    this.points = [new point(x+w/2,y+h,"out","bottom")];
}

startBlock.prototype = {
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
        if(this.editable){
            this.resize();
        }
        if(this.selected){
            ctx.strokeStyle = "blue";
        }
        else{
            ctx.strokeStyle = "black";
        }
        if(this.err){
            ctx.strokeStyle = "red";
        }
        if(this.err){
            ctx.strokeStyle = "red";
        }
                       
        ctx.fillStyle = "white";
        
        ctx.save();
        var k = this.h/this.w;
        ctx.scale(1, k);
        ctx.beginPath();
        ctx.arc(this.x+this.w/2, (this.y+this.h/2)/k, this.w/2, 0, Math.PI*2, false);
        ctx.restore();
        ctx.fill();
        ctx.stroke();
        ctx.closePath();


        ctx.fillStyle = "black";
        ctx.font="20px Roboto"; 
        ctx.textAlign="center"; 
        if(this.editable){
            ctx.fillText(this.code,this.x+this.w/2, this.y+this.h/1.5); 
        }
        else{
            ctx.fillText("start",this.x+this.w/2, this.y+this.h/1.5); 
        }

        for(n=0; n<this.points.length; n++){
            this.points[n].render();     
        }
    },
    move: function(x,y){
        this.x = x;
        this.y = y;

        this.points[0].x = x+this.w/2;
        this.points[0].y = y+this.h;
    },
    resize: function(){
        ctx.font="18px Roboto"; 
        this.w = ctx.measureText(this.code).width+this.w/2;;
        
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
        if(this.editable){
            document.getElementById("text-box").style.display = "block";
            document.getElementById("text-box").style.top = this.y+yScroll+yOffset-this.h/2+18+"px";
            document.getElementById("text-box").style.left = this.x+xScroll+"px";
            document.getElementById("text").style.width = this.w+"px";
            document.getElementById("text").style.fontSize = "18px";
            document.getElementById("text").value = this.code;
            document.getElementById("text").focus();
        }
    }
}