function button(x, y, w, h, text){
    this.type = "button";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    buttonID++;
    this.id = buttonID;
}

button.prototype = {
    remove: function(){
        ui.splice(ui.indexOf(this),1);
    },
    render: function(){
        
        var cornerRadius = 10;
        
        ctx.lineJoin = "round";
        ctx.lineWidth = cornerRadius;
        ctx.fillStyle = "#bbb9b9";
        // 색깔 맞추기
        // ctx.strokeStyle = "#4bbf6b";
        ctx.shadowBlur=10;
        ctx.shadowColor="black";
        
        ctx.beginPath();
        ctx.moveTo(this.x+cornerRadius/2, this.y+cornerRadius/2);
        ctx.lineTo(this.x+cornerRadius/2+this.w-10-cornerRadius, this.y+cornerRadius/2);
        
        ctx.lineTo(this.x+cornerRadius/2+this.w-cornerRadius, this.y+cornerRadius/2+(this.h-cornerRadius)/2);
        
        ctx.lineTo(this.x+cornerRadius/2+this.w-10-cornerRadius, this.y+cornerRadius/2+this.h-cornerRadius);
        ctx.lineTo(this.x+cornerRadius/2, this.y+cornerRadius/2+this.h-cornerRadius);
        ctx.closePath();
        ctx.shadowBlur=0;
        ctx.shadowOffsetY=2;
        ctx.shadowColor="#3aa257";
        ctx.stroke();
        ctx.shadowBlur=0;
        ctx.shadowOffsetY=0;
        ctx.fill();
        
        ctx.fillStyle = "black";
        ctx.font="20px Roboto"; 
        ctx.textAlign="center"; 
        ctx.fillText(this.text,this.x+this.w/2, this.y+this.h/1.5);
        
        ctx.lineWidth = 1;
        ctx.lineJoin = "";

    },
    move: function(x,y){
        this.x = x;
        this.y = y;
    },
    isTouching: function(x,y){
        if(((this.x < x)&&(x < this.x+this.w))&&((this.y < y)&&(y < this.y+this.h))){
            return true;
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
    click: function(){
        run("");
    }
}

function horizontalScrollBar(x, y){
    this.type = "horizontalScrollBar";
    this.x = x;
    this.y = y;
    this.w = 15;
    this.h = 15;
    this.sh = 15;
    this.sw = 15;
    this.sx = x;
    this.sy = y;
    this.grabed = false;
    this.grabPosition = 0;
}

horizontalScrollBar.prototype = {
    remove: function(){
        ui.splice(ui.indexOf(this),1);
    },
    render: function(){
        
        this.resize();
        
        var cornerRadius = 10;
        
        ctx.lineJoin = "round";
        ctx.lineWidth = cornerRadius;
        ctx.fillStyle = "#e2e4e6";
        ctx.strokeStyle = "#e2e4e6";

        ctx.strokeRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        ctx.fillRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        
        
        ctx.fillStyle = "#c4c9cc";
        ctx.strokeStyle = "#c4c9cc";
        ctx.strokeRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        ctx.fillRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        
        ctx.lineWidth = 1;
        ctx.lineJoin = "";

    },
    move: function(x,y){
        this.x = x;
        this.y = y;
        this.sy = y;
        
        if(this.x < this.sx){
            this.x = this.sx;
        }
        if(this.x+this.w > this.sx+this.sw){
            this.x = this.sx +  this.sw - this.w;
        }
        
        var k = this.sw/width;
        var r = this.x-this.sx;
        xScroll = -r/k;
    },
    resize: function(){
        this.w = (c.width-200)/(width-200)*(c.width-200)-15;
        this.sw = c.width*c.width/c.width-200-15;
        
        if(this.x + this.w > this.sx + this.sw){
            this.x = this.sx + this.sw - this.w;
        }
        this.move(this.x, this.y);
    },
    isTouching: function(x,y){
        if(((this.x < x)&&(x < this.x+this.w))&&((this.y < y)&&(y < this.y+this.h))){
            return true;
        }
        else{
            return false;
        }
    }
}

function verticalScrollBar(x, y){
    this.type = "verticalScrollBar";
    this.x = x;
    this.y = y;
    this.w = 15;
    this.h = 15;
    this.sh = 15;
    this.sw = 15;
    this.sx = x;
    this.sy = y;
    this.grabed = false;
    this.grabPosition = 0;
}

verticalScrollBar.prototype = {
    remove: function(){
        ui.splice(ui.indexOf(this),1);
    },
    render: function(){
        
        this.resize();
        
        var cornerRadius = 10;
        
        ctx.lineJoin = "round";
        ctx.lineWidth = cornerRadius;
        ctx.fillStyle = "#e2e4e6";
        ctx.strokeStyle = "#e2e4e6";

        ctx.strokeRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        ctx.fillRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        
        
        ctx.fillStyle = "#c4c9cc";
        ctx.strokeStyle = "#c4c9cc";
        ctx.strokeRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        ctx.fillRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        
        ctx.lineWidth = 1;
        ctx.lineJoin = "";
    },
    move: function(x,y){
        this.x = x;
        this.y = y;
        this.sx = x;
        
        if(this.y < this.sy){
            this.y = this.sy;
        }
        if(this.y+this.h > this.sy+this.sh){
            this.y = this.sy +  this.sh - this.h;
        }
        
        var k = this.sh/height;
        var r = this.y-this.sy;
        yScroll = -r/k;
    },
    resize: function(){
        this.h = c.height/height*c.height*c.height/c.height-15;
        this.sh = c.height*c.height/c.height-15;
        
        if(this.y + this.h > this.sy + this.sh){
            this.y = this.sy + this.sh - this.h;
        }
        this.move(this.x, this.y);
    },
    isTouching: function(x,y){
        if(((this.x < x)&&(x < this.x+this.w))&&((this.y < y)&&(y < this.y+this.h))){
            return true;
        }
        else{
            return false;
        }
    }
}

function verticalScrollBarConsole(x, y){
    this.type = "verticalScrollBarConsole";
    this.x = x;
    this.y = y;
    this.w = 15;
    this.h = 15;
    this.sh = 15;
    this.sw = 15;
    this.sx = x;
    this.sy = y;
    this.grabed = false;
    this.grabPosition = 0;
}

verticalScrollBarConsole.prototype = {
    remove: function(){
        ui.splice(ui.indexOf(this),1);
    },
    render: function(){
        
        this.resize();
        
        var cornerRadius = 10;
        consoleScrollCtx.lineJoin = "round";
        consoleScrollCtx.lineWidth = cornerRadius;
        consoleScrollCtx.fillStyle = "#e2e4e6";
        consoleScrollCtx.strokeStyle = "#e2e4e6";

        consoleScrollCtx.strokeRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        consoleScrollCtx.fillRect(this.sx+(cornerRadius/2)+2, this.sy+(cornerRadius/2)+2, this.sw-cornerRadius-4, this.sh-cornerRadius-4);
        
        
        consoleScrollCtx.fillStyle = "#c4c9cc";
        consoleScrollCtx.strokeStyle = "#c4c9cc";
        consoleScrollCtx.strokeRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        consoleScrollCtx.fillRect(this.x+(cornerRadius/2)+2, this.y+(cornerRadius/2)+2, this.w-cornerRadius-4, this.h-cornerRadius-4);
        
        consoleScrollCtx.lineWidth = 1;
        consoleScrollCtx.lineJoin = "";
    },
    move: function(x,y){
        this.x = x;
        this.y = y;
        this.sx = x;
        
        if(this.y < this.sy){
            this.y = this.sy;
        }
        if(this.y+this.h > this.sy+this.sh){
            this.y = this.sy +  this.sh - this.h;
        }
        
        var k = this.sh/document.getElementById("console").offsetHeight;
        var r = this.y-this.sy;
        document.getElementById("console").style.top = -r/k + "px";
    },
    resize: function(){
        var textHeight = document.getElementById("console").offsetHeight;
        
        this.sh = consoleScroll.height*consoleScroll.height/consoleScroll.height-yOffset;
        if(this.sh > textHeight){
            this.h = this.sh;
        }
        else{
            this.h = (this.sh/textHeight)*this.sh;
        }
        
        if(this.y + this.h > this.sy + this.sh){
            this.y = this.sy + this.sh - this.h;
        }
        this.move(this.x, this.y);
    },
    isTouching: function(x,y){
        if(((this.x+window.innerWidth-15 < x)&&(x < this.x+window.innerWidth-15+this.w))&&((this.y+window.innerHeight-consoleScroll.height < y)&&(y < this.y+window.innerHeight-consoleScroll.height+this.h))){
            return true;
        }
        else{
            return false;
        }
    }
}