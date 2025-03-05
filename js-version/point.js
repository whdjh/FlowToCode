function point(x,y,t,d){
    this.x = x;
    this.y = y;
    pointID++;
    this.id = pointID;
    this.type = t;
    this.occupied = false;
    this.selected = false;
    this.grabed = false;
    this.direction = d;
    this.grabPosition = {x: 0, y: 0};
    this.lastGoodPosition = {x: 0, y: 0};
}

point.prototype = {
    render: function(){
        if(this.type == "point"){
            ctx.fillStyle = "black";
            ctx.fillRect(this.x-2.5,this.y-2.5,5,5);
        }
        else{
            if(this.type == "in"){
                ctx.fillStyle = "green";
            }
            else if(this.type == "out"){
                ctx.fillStyle = "red";
            }
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x,this.y,5,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    },
    isTouching: function(x,y){
        var dist = Math.pow(this.x-x, 2)+Math.pow(this.y-y, 2);
        if(dist < 25){
            return true;
        }
        else{
            return false;
        }
    },
    distanceSquared: function(x,y){
        return Math.pow(this.x-x, 2)+Math.pow(this.y-y, 2);
    }
}