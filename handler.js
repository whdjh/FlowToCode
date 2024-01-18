window.addEventListener("dblclick", function(event){
    for(i=0; i<lines.length; i++){
        if(lines[i].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll, 5)){
            var min = Infinity;
            var where;
            for(j=0; j<lines[i].path.length; j++){
                if(j != lines[i].path.length-1){
                    var d = lines[i].path[j].distanceSquared(event.clientX-xOffset, event.clientY-yOffset) + lines[i].path[j+1].distanceSquared(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll);
                    if(d<min){
                        min = d;
                        where = j+1;
                    }
                }
            }
            lines[i].path.splice(where, 0, new point(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll, "point"));
        }
    }
    for(z=0; z<program.length; z++){
        if((program[z].type != "startBlock")&&(program[z].type != "endBlock")&&(program[z].type != "endIfBlock")){
            if(program[z].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
                // program[z].code = prompt();
                program[z].edit();
                program[z].editing = true;
            }
        }
    }
    
    update();
});

window.addEventListener("click", function(event){
    for(i=0; i<ui.length; i++){
        if(ui[i].isTouching(event.clientX-xOffset, event.clientY-yOffset)){
            if(ui[i].type == "button"){
                ui[i].click();
            }
        }
    }
});

window.addEventListener("mousedown", function(event){
    for(i=0; i<program.length; i++){
        if(program[i].editing){
            if(!program[i].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
                program[i].code = document.getElementById("text").value;
                document.getElementById("text-box").style.display = "none";
                document.getElementById("text").value = "";
                program[i].editing = false;
            }
        }
        program[i].selected = false;
    }
    for(i=0; i<lines.length; i++){
        lines[i].selected = false;
    }
    for(i=0; i<program.length; i++){
        if(program[i].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
            program[i].selected = true;
        }
    }
    for(i=0; i<lines.length; i++){
        if(lines[i].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll, 5)){
            lines[i].selected = true;
        }
    }
    tempLineStart = undefined;
    for(i=0; i<lines.length; i++){
        for(j=0; j<lines[i].path.length; j++){
            if(lines[i].path[j].type == "point"){
                if(lines[i].path[j].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
                    lines[i].path[j].grabed = true;
                    lines[i].path[j].grabPosition.x = event.clientX-xOffset-xScroll - lines[i].path[j].x;
                    lines[i].path[j].grabPosition.y = event.clientY-yOffset-yScroll - lines[i].path[j].y;
                }
            }
        }
    }
    for(i=0; i<program.length; i++){
        for(j=0; j<program[i].points.length; j++){
            if(program[i].points[j].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
                if(!program[i].points[j].occupied){
                    tempLineStart = program[i].points[j];
                }
            }
        }
        if(program[i].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
            if(event.clientX-xOffset > 200){
                program[i].grabed = true;
                program[i].grabPosition.x = event.clientX-xOffset-xScroll - program[i].x;
                program[i].grabPosition.y = event.clientY-yOffset-yScroll - program[i].y;
            }
        }
    }
    for(i=0; i<pallet.length; i++){
        if(pallet[i].isTouching(event.clientX-xOffset, event.clientY-yOffset)){
            if(pallet[i].type == "codeBlock"){
                program.push(new codeBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            else if(pallet[i].type == "inputBlock"){
                program.push(new inputBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            else if(pallet[i].type == "outputBlock"){
                program.push(new outputBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            else if(pallet[i].type == "whileBlock"){
                program.push(new whileBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            else if(pallet[i].type == "ifBlock"){
                program.push(new ifBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            else if(pallet[i].type == "endIfBlock"){
                program.push(new endIfBlock(pallet[i].x-xScroll, pallet[i].y-yScroll, pallet[i].w, pallet[i].h, ""));
            }
            
            program[program.length-1].grabed = true;
            program[program.length-1].selected = true;
            program[program.length-1].grabPosition.x = event.clientX-xOffset - pallet[i].x;
            program[program.length-1].grabPosition.y = event.clientY-yOffset - pallet[i].y;
        }
    }
    for(i=0; i<ui.length; i++){
        if((ui[i].type == "verticalScrollBar")||(ui[i].type == "horizontalScrollBar")){
            if(ui[i].isTouching(event.clientX-xOffset, event.clientY-yOffset)){
                ui[i].grabed = true;
                ui[i].grabPosition = {x: event.clientX-xOffset - ui[i].x, y: event.clientY-yOffset - ui[i].y};
                selecting(false);
            }
        }
        if(ui[i].type == "verticalScrollBarConsole"){
            if(ui[i].isTouching(event.clientX, event.clientY)){
                ui[i].grabed = true;
                ui[i].grabPosition = {x: event.clientX - ui[i].x, y: event.clientY - ui[i].y};
                selecting(false);
            }
        }
    }
    if((event.clientX-xOffset < c.width+2)&&(event.clientX-xOffset > c.width-2)){
        grabSplit = true;
    }
    update();
});

window.addEventListener("mouseup", function(event){
    for(i=0; i<program.length; i++){
        for(j=0; j<program[i].points.length; j++){
            if(program[i].points[j].isTouching(event.clientX-xOffset-xScroll, event.clientY-yOffset-yScroll)){
                if(tempLineStart != undefined){
                    if(tempLineStart != program[i].points[j]){
                        if(tempLineStart.type != program[i].points[j].type){
                            if(!program[i].points[j].occupied){
                                // new line
                                lines.push(new line(tempLineStart, program[i].points[j]));
                                tempLineStart.occupied = true;
                                program[i].points[j].occupied = true;
                            }
                        }
                    }
                }
            }
        }
        if((program[i].err) && (program[i].grabed)){
            program[i].move(program[i].lastGoodPosition.x, program[i].lastGoodPosition.y);
            program[i].err = false;
        }
        var grabed = program[i].grabed;
        program[i].grabed = false;
        if(program[i].isColliding({x:0-xScroll, y:0-yScroll, w:200, h:c.height})){
            if((program[i].type == "endBlock")||(program[i].type == "startBlock")){
            }
            else{
                if(grabed){
                    program[i].remove();
                    i--;
                }
            }
        }
    }
    for(i=0; i<lines.length; i++){
        for(j=0; j<lines[i].path.length; j++){
            if(lines[i].path[j].type == "point"){
                lines[i].path[j].grabed = false;
            }
        }
    }
    for(i=0; i<ui.length; i++){
        if((ui[i].type == "verticalScrollBar")||(ui[i].type == "horizontalScrollBar")||(ui[i].type == "verticalScrollBarConsole")){
            ui[i].grabed = false;
            selecting(true);
        }
    }
    tempLineStart = undefined;
    grabSplit = false;
    update();
});

window.addEventListener("mousemove", function(event){
    for(i=0; i<program.length; i++){
            
        if(program[i].grabed){
            
            if(program[i].editing){
                program[i].code = document.getElementById("text").value;
                document.getElementById("text-box").style.display = "none";
                document.getElementById("text").value = "";
                program[i].editing = false;
            }
            
            program[i].move(event.clientX-xOffset-xScroll-program[i].grabPosition.x, event.clientY-yOffset-yScroll-program[i].grabPosition.y);
            var ok = true;
            for(j=0; j<program.length; j++){
                if(j!=i){
                    if(program[i].isColliding(program[j]))ok = false;
                }
                if((program[i].x < 0)||(program[i].y < 0)){
                    ok = false;
                }
            }
            if((program[i].type == "startBlock")||(program[i].type == "endBlock")){
                if(program[i].isColliding({x:0-xScroll, y:0-yScroll, w:200, h:c.height})){
                    ok = false;
                }
            }
            if(ok){
                program[i].err = false;
                program[i].lastGoodPosition = {x: program[i].x, y: program[i].y};
            }
            else program[i].err = true;
        }
    }
    for(i=0; i<lines.length; i++){
        for(j=0; j<lines[i].path.length; j++){
            if(lines[i].path[j].type == "point"){
                if(lines[i].path[j].grabed){
                    lines[i].path[j].x = event.clientX-xOffset-xScroll-lines[i].path[j].grabPosition.x;
                    lines[i].path[j].y = event.clientY-yOffset-yScroll-lines[i].path[j].grabPosition.y;
                }
            }
        }
    }
    for(i=0; i<ui.length; i++){
        if(ui[i].type == "verticalScrollBar"){
            if(ui[i].grabed){
                ui[i].move(ui[i].x,event.clientY-yOffset-ui[i].grabPosition.y);
            }
        }
        if(ui[i].type == "horizontalScrollBar"){
            if(ui[i].grabed){
                ui[i].move(event.clientX-xOffset-ui[i].grabPosition.x,ui[i].y);
            }
        }
        if(ui[i].type == "verticalScrollBarConsole"){
            if(ui[i].grabed){
                ui[i].move(ui[i].x,event.clientY-ui[i].grabPosition.y);
            }
        }
    }
    if(grabSplit){
        splitX = window.innerWidth - event.clientX-xOffset;
        
        resize();
    }
    if((event.clientX-xOffset < c.width+2)&&(event.clientX-xOffset > c.width-2)){
        document.getElementById('body').style.cursor = "e-resize";
    }
    else{
        document.getElementById('body').style.cursor = "auto";
    
    }
    update();
    if(tempLineStart != undefined){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(tempLineStart.x+xScroll,tempLineStart.y+yScroll);
        ctx.lineTo(event.clientX-xOffset,event.clientY-yOffset);
        ctx.stroke();
    }
});

window.addEventListener("keydown", function(event){
    if(event.keyCode == 46){
        //delete block
        for(i=0; i<program.length; i++){
            if(program[i].selected){
                if(program[i].editing){
                    // document.getElementById("text-box").style.display = "none";
                    continue;
                }
                else{
                    if((program[i].type != "startBlock")&&(program[i].type != "endBlock")){
                        program[i].remove();
                    }
                }
            }
        }
        //delete line
        for(i=0; i<lines.length; i++){
            if(lines[i].selected){
                lines[i].remove();
            }
        }
        
        update();
    }
    if(event.keyCode == 13){
        var command = document.getElementById('console-prompt').value;
        if(command.length){
            run(command);
            document.getElementById('console-prompt').value = "";
        }
    }
    for(i=0; i<program.length; i++){
        if(program[i].editing){
            program[i].code = document.getElementById("text").value;
            program[i].resize();
            program[i].render();
            document.getElementById("text").style.width = program[i].w+"px";
            update();
        }
    }
});

window.addEventListener("resize", function(){
    resize();
});