function inputBlock(x, y, w, h, code){
    this.type = "inputBlock";
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
    this.points = [new point(x+w/2,y,"in","top"), new point(x+w/2,y+h,"out","bottom")];
}

inputBlock.prototype = {
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
    render: function () {
        this.resize();
        if (this.selected) {
            ctx.strokeStyle = "blue";
        } else {
            ctx.strokeStyle = "black";
        }
        if (this.err) {
            ctx.strokeStyle = "red";
        }

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y);
        ctx.lineTo(this.x + this.w, this.y);
        ctx.lineTo(this.x + this.w - 20, this.y + this.h);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y + 5);
        ctx.lineTo(this.x + 20 - 3, this.y + 5);
        ctx.lineTo(this.x + 5, this.y);
        ctx.lineTo(this.x + 20 - 3, this.y + 5);
        ctx.lineTo(this.x + 5, this.y + 10);
        ctx.stroke();

        if (!this.editing) {
            ctx.fillStyle = "black";
            ctx.font = "18px Roboto";
            ctx.textAlign = "center";
            
            // 코드가 비어있으면 "input()"로 설정
            if (!this.code.trim()) {
                this.code = '= input("메시지")';
            }

            ctx.fillText(this.code, this.x + this.w / 2, this.y + this.h / 1.5);
        }
        for (n = 0; n < this.points.length; n++) {
            this.points[n].render();
        }
    },

    resize: function(){
        ctx.font="18px Roboto"; 
        this.w = ctx.measureText(this.code).width+50;
        
        if(this.w < this.minw){
            this.w = this.minw;
        }
        
        this.move(this.x, this.y);
    },
    move: function(x,y){
        this.x = x;
        this.y = y;

        this.points[0].x = x+this.w/2;
        this.points[0].y = y;

        this.points[1].x = x+this.w/2;
        this.points[1].y = y+this.h;
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