function line(a,b){
    this.a = a;
    this.b = b;
    this.path = [a,b];
    this.selected = false;
}

line.prototype = {
    remove: function(){
        this.a.occupied = false;
        this.b.occupied = false;
        lines.splice(lines.indexOf(this),1);
    },
    render: function(){
        if(this.selected)ctx.strokeStyle = "blue";
        else ctx.strokeStyle = "black";
        
        ctx.beginPath();
        for(m=0; m<this.path.length; m++){
            if(m==0){
                ctx.moveTo(this.path[m].x, this.path[m].y);
            }
            else{
                ctx.lineTo(this.path[m].x,this.path[m].y);
            }
        }
        ctx.stroke();
        
        for(m=0; m<this.path.length; m++){
            if(this.path[m].type == "point"){
                this.path[m].render();
            }
        }
    },
    isTouching: function(x,y,r){
        var p = {x: x, y: y};
        var touch = false;
        for(m=0; m<this.path.length; m++){
            if(m != this.path.length-1){
                var dist;
                var l2 = Math.pow(this.path[m].x - this.path[m+1].x, 2) + Math.pow(this.path[m].y - this.path[m+1].y, 2);
                if(l2 == 0) {
                    dist = Math.pow(p.x - this.path[m].x, 2) + Math.pow(p.y - this.path[m].y, 2);
                }
                else{
                    var t = ((p.x - this.path[m].x) * (this.path[m+1].x - this.path[m].x) + (p.y - this.path[m].y) * (this.path[m+1].y - this.path[m].y)) / l2;
                    t = Math.max(0, Math.min(1, t));
                    var n = {x: this.path[m].x + t * (this.path[m+1].x - this.path[m].x), y: this.path[m].y + t * (this.path[m+1].y - this.path[m].y)};
                    dist = Math.pow(p.x - n.x, 2) + Math.pow(p.y - n.y, 2);
                }

                if(dist < Math.pow(r,2))touch = true;
            }
        }
        return touch;
    }
}