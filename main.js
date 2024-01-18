// 주의사항!!!
// 1. 문자열 안에 "사용 불가능
// 2. ++사용 불가능
function convert(code) {
    let Tcnt = 0;
    let conv_code = "";
    let conv_code2 = "";
    let queue = "";
    let first_flag = true;

    for (let i = 0; i < code.length; i++) {
        const c = code[i];

        if (c === "{" && first_flag) {
            conv_code += queue + ":";
            queue = "";
            Tcnt += 1;
            first_flag = false;
        } else if (c === "{" && ! first_flag) {
            conv_code += "<br>" + "&nbsp".repeat(Tcnt);
            conv_code += queue + ":";
            queue = "";
            Tcnt += 1;
        } else if (c === "}") {
            queue = "";
            Tcnt -= 1;
            first_flag = false;
        } else if (c === ";" && first_flag) {
            conv_code += queue;
            queue = "";
            first_flag = false;
        } else if (c === ";" && !first_flag) {
            conv_code += "<br>" + "&nbsp".repeat(Tcnt);
            conv_code += queue;
            queue = "";
        } else {
            queue += c;
        }
    }

    conv_code.split('"').forEach((item, i) => {
        if (i % 2 === 0) {
            item = item.replace('true', 'True');
            item = item.replace('false', 'False');
            item = item.replace('&&', 'and');
            conv_code2 += item.replace('||', 'or');
        } else {
            conv_code2 += '"' + item + '"';
        }
    });
    
    return conv_code2;
}  

var ID = 0;
var pointID = 0;
var buttonID = 0;

var xScroll = 0;
var yScroll = 0;

var xOffset = 0;
var yOffset = 40;

var splitX = 600;
var grabSplit = false;

var tempLineStart;

var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var consoleScroll = document.getElementById('console-scroll');
var consoleScrollCtx = consoleScroll.getContext('2d');

c.width = window.innerWidth-splitX-xOffset;
c.height = window.innerHeight-yOffset;

var width = c.width;
var height = c.height;


var ui = [
    new button(c.width - 130,c.height - 60,100,30,"Run"),
    new horizontalScrollBar(200,c.height-15),
    new verticalScrollBar(c.width-15,0),
    new verticalScrollBarConsole(0,0)
];

var pallet = [
    new codeBlock(73,20,120,30,"process"),
    new inputBlock(20,70,120,30,"변수명 = input(\"메시지\")"),
    new outputBlock(68,120,120,30,"print(입력)"),
    new whileBlock(72,170,120,30,"while"),
    new ifBlock(82,220,100,100,"if"),
    new endIfBlock(115,340,30,30)
];

var program = [
    new startBlock(300, 20, 100, 30, "", false),
    new endBlock(300, 200, 100, 30),
];


var lines = [];

var tabs = [
    {title: "main", type: "main", program: program, lines: lines}
];

var selectedTab = 0;

function update(){
    ctx.clearRect(0,0,c.width,c.height);
    consoleScrollCtx.clearRect(0,0,consoleScroll.width,consoleScroll.height);
    
    ctx.save();
    ctx.translate(xScroll, yScroll);
    for(i=0; i<lines.length; i++){
        lines[i].render();
    }
    for(i=0; i<program.length; i++){
        if(!program[i].grabed){
            program[i].render();
        }
    }
    ctx.restore();
    ctx.fillStyle = "#bbb9b9";  
    ctx.fillRect(0,0,254,c.height);
    
    for(i=0; i<pallet.length; i++){
        pallet[i].render();
    }
    for(i=0; i<ui.length; i++){
        ui[i].render();
    }
    
    ctx.save();
    ctx.translate(xScroll, yScroll);
    for(i=0; i<program.length; i++){
        if(program[i].grabed){
            program[i].render();
        }
    }
    ctx.restore();
    
    
    resizeWorkSpace();
    
}

function updateTabs(){
    var insert = "";
    for(i=0; i<tabs.length; i++){
        if(selectedTab == i){
            insert += '<div class="tab-selected">'+tabs[i].title+'</div>';
        }
        else{
            insert += '<div class="tab" onclick="selectTab('+i+')">'+tabs[i].title+'</div>';
        }
    }
    insert += '<div class="new" onclick="newTabWindow(\'test\',\'function\')"></div>';
    document.getElementById('tabs').innerHTML = insert;
}

function selectTab(index){
    tabs[selectedTab].program = program.slice();
    tabs[selectedTab].lines = lines.slice();
    
    selectedTab = index;
    
    program = tabs[selectedTab].program.slice();
    lines = tabs[selectedTab].lines.slice();
    
    updateTabs();
    update();
}

function newTabWindow(title, type){
    document.getElementById("window-dim").style.display = "flex";
}

function closeWindow(){
    document.getElementById("window-dim").style.display = "none";
    document.getElementById('title-in').style.borderColor = "#b2b2b2";
}

function createTab(){
    title = document.getElementById('title-in').value;
    if(title.length < 1){
        document.getElementById('title-in').style.borderColor = "#b42c2c";
    }
    else{
        if(document.getElementById('function').className.indexOf("selected") != -1){
            tabs.push({title: title, type: "function", program: [new startBlock(300, 20, 100, 30, "function "+title+"()", true),new endBlock(300, 200, 100, 30)], lines: []});
        }
        else{
            tabs.push({title: title, type: "event", program: [new startBlock(300, 20, 100, 30, "addEventListener('"+title+"')", true),new endBlock(300, 200, 100, 30)], lines: []});
        }
        document.getElementById('title-in').value = "";
        selectTab(tabs.length-1);
        closeWindow();
    }
}

function resizeWorkSpace(){
    var maxx = 0;
    var maxy = 0;
    for(i=0; i<program.length; i++){
        if(program[i].x+program[i].w > maxx-100){
            maxx = program[i].x+program[i].w+100;
        }
        if(program[i].y+program[i].h > maxy-100){
            maxy = program[i].y+program[i].h+100;
        }
    }
    if(c.width < maxx){
        width = maxx;
    }
    else{
        width = c.width;
    }
    if(c.height < maxy){
        height = maxy;
    }
    else{
        height = c.height;
    }
}

function interpreter(){
	selectTab(selectedTab);
	var startTab = selectedTab;
	var out = "";
	
	for(h=0; h<tabs.length; h++){
		selectTab(h);
		
		var block = -1;
		var tree = [];
		
		for(x=0; x<program.length; x++){ 
			if(program[x].type == "startBlock"){
				block = program[x];
			}
		}
		if(block == -1){
			return false;
		}
		
		if(tabs[h].type == "function"){
			out += block.code + "{";
		}
		
		// main loop
		for(x=0; x<program.length+1; x++){
			if(block.type == "endBlock"){
				x = program.length; // return
			}
			else if(block.type == "startBlock"){
				block = block.neighbor("bottom");
			}
			else if(block.type == "ifBlock"){
				x--;
				if(tree.length){
					if(tree[tree.length-1][0] == block){
						tree[tree.length-1][1] = "no";
						block = block.neighbor("right");
					}
					else{
						tree.push([block, "yes"]);
						out += "if("+block.code+"){";
						block = block.neighbor("left");
					}
				}
				else{
					tree.push([block, "yes"]);
					out += "if("+block.code+"){";
					block = block.neighbor("left");
				}
			}
			else if(block.type == "endIfBlock"){
				x--;
				if(tree.length){
					if(tree[tree.length-1][1] == "yes"){
						out += "}else{";
						block = tree[tree.length-1][0];
					}
					else{
						tree.splice(tree.length-1, 1);
						out += "}";
						block = block.neighbor("bottom");
					}
				}
			}
			else if(block.type == "whileBlock"){
				x--;
				if(tree.length){
					if(tree[tree.length-1][0] == block){
						tree.splice(tree.length-1, 1);
						out += "}";
						block = block.neighbor("right");
					}
					else{
						tree.push([block, "yes"]);
						out += "while("+block.code+"){";
						block = block.neighbor("bottom");
					}
				}
				else{
					tree.push([block, "yes"]);
					out += "while("+block.code+"){";
					block = block.neighbor("bottom");
				}
			}
			else{
				if(block.code.charAt(block.code.length-1) == ";"){
					out += block.code;
				}
				else{
					out += block.code + ";";
				}
				block = block.neighbor("bottom");
			}
		}
		
		if(tabs[h].type == "function"){
			out += "}";
		}
	
	}
	
	selectTab(startTab);
	
    return out;
    
    
}

function storeJson(){
    var save = {program: program, lines: lines};
    
    var output = JSON.stringify(save);
    
    output = output.replaceAll('\"', '\\"');
    output = output.replaceAll("'", "\\'");
    
    return output; 
}

function loadJson(load){
    ID = 0;
    pointID = 0;
    var save = JSON.parse(load);
    console.log(save);
    var pr = [];
    var ln = [];
    
    for(i=0; i<save.program.length; i++){
        var p = save.program[i];
        
        var insert;

        if(p.type == "codeBlock"){
            insert = new codeBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "inputBlock"){
            insert = new inputBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "outputBlock"){
            insert = new outputBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "ifBlock"){
            insert = new ifBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "endIfBlock"){
            insert = new endIfBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "startBlock"){
            insert = new startBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "endBlock"){
            insert = new endBlock(p.x, p.y, p.w, p.h, p.code);
        }
        else if(p.type == "whileBlock"){
            insert = new whileBlock(p.x, p.y, p.w, p.h, p.code);
        }
        
        for(j=0; j<p.points.length; j++){
            insert.points[j].id = p.points[j].id;
        }
        pr.push(insert);
    }
    
    
    for(i=0; i<save.lines.length; i++){
        var l = save.lines[i];
        var a;
        var b;
        var path = [];
        
        for(x=0; x<pr.length; x++){
            for(y=0; y<pr[x].points.length; y++){
                if(pr[x].points[y].id == l.a.id){
                    a = pr[x].points[y];
                }
                if(pr[x].points[y].id == l.b.id){
                    b = pr[x].points[y];
                }
            }
        }
        for(j=0; j<l.path.length; j++){
            path.push(new point(l.path[j].x,l.path[j].y,l.path[j].type,l.path[j].direction));
        }
        if((a != undefined)&&(b != undefined)){
            path[0] = a;
            path[path.length-1] = b;
            a.occupied = true;
            b.occupied = true;
            var nline = new line(a,b);
            nline.path = path;
            ln.push(nline);
        }
        
    }
    
    lines = ln;
    program = pr;
    
    update();
}

function selecting(state){
    if(!state){
        document.getElementById('selecting').innerHTML = "body{-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}";
    }
    else{
        document.getElementById('selecting').innerHTML = "";
    }
}

function run(command){
    graphics.clear();
    
    try {
        if(!command.length){
            console.log("<div style='color: #25b94e'>Program started!</div>");
            var doNotUseThisName = interpreter();
            console.log(convert(doNotUseThisName));  // 코드 출력
        }
        else{
            var doNotUseThisName = command;
        }
        (function() {
            var program = null;
            var lines = null;
            var ui = null;
            var ID = null;
            var pointID = null;
            var buttonID = null;
            var xScroll = null;
            var yScroll = null;
            var xOffset = null;
            var yOffset = null;
            var splitX = null;
            var grabSplit = null;
            var tempLineStart = null;
            var c = null;
            var ctx = null;
            var consoleScroll = null;
            var consoleScrollCtx = null;
            var width = null;
            var height = null;
            var pallet = null;
            
            var codeBlock = null;
            var inputBlock = null;
            var outputBlock = null;
            var ifBlock = null;
            var endIfBlock = null;
            var whileBlock = null;
            var endBlock = null;
            var startBlock = null;
            var horizontalScrollBar = null;
            var verticalScrollBar = null;
            var button = null;
            var point = null;
            var line = null;
            
            var update = null;
            var resizeWorkSpace = null;
            var interpreter = null;
            var storeJson = null;
            var loadJson = null;
            var run = null;
            var resize = null;
            
            if(!command.length){
                eval(doNotUseThisName);
                
            }
            else{
                console.log("<i>"+doNotUseThisName+"</i>");
            }
        })();
        
    } catch (e) {
        if(e.message == "Unexpected token )"){
            console.log("<div style='color: #b42c2c'>Invalid condition in if or while block!<div>");
        }
        else if(e.message.search("is not defined") != -1){
            console.log("<div style='color: #b42c2c'>Variable " + e.message + "!</div>");
        }
        else if((e.message == "Unexpected end of input")||(e.message == "Cannot read property 'charAt' of undefined")){
            console.log("<div style='color: #b42c2c'>Invalid code! Please make sure that all blocks are connected correctly.</div>")
        }
        else{
            console.log("<div style='color: #b42c2c'>"+e.message+"</div>");
        }
    }
}

function resize(){
    if(splitX < 200)splitX = 200;
    if(splitX > window.innerWidth - 400)splitX = window.innerWidth - 400;
    if(splitX > 16/9 * window.innerHeight-200)splitX = 16/9 * window.innerHeight-200;
    c.width = window.innerWidth-splitX-xOffset;
    c.height = window.innerHeight-yOffset;
    var h = document.getElementById("console-prompt").offsetHeight + 4;
    myCanvas.style.left = c.width + "px";
    myCanvas.style.top = yOffset + "px";
    myCanvas.style.right = c.width + "px";
    myCanvas.width = window.innerWidth-c.width-8;
    myCanvas.height = myCanvas.width/5300;         // 모양 바꾸기
    document.getElementById("console-box").style.width = splitX - 8 + "px";
    document.getElementById("console-prompt").style.width = splitX - 16 + "px";
    document.getElementById("console-box").style.height = window.innerHeight - myCanvas.height - 8 -4 -h -yOffset + "px";
    document.getElementById("console-box").style.bottom = h + "px";
    consoleScroll.width = 15;
    consoleScroll.height = window.innerHeight - myCanvas.height - 8 -4 -h;
    if(typeof graphics !== 'undefined'){
        graphics.width = myCanvas.width;
        graphics.height = myCanvas.height;
    }
    ui[0].move(c.width - 120,c.height - 50);
    ui[1].move(ui[1].x, c.height - 15);
    ui[2].move(c.width - 15, ui[2].y);    
    
    for(i=0; i<ui.length; i++){
        if(ui[i].type == "verticalScrollBar"){
            ui[i].move(ui[i].x,ui[i].y);
        }
        if(ui[i].type == "horizontalScrollBar"){
            ui[i].move(ui[i].x,ui[i].y);
        }
    }
    
    update();

}

update();  
resize();
updateTabs();
selectTab(0);


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

console.log = function(text){
    document.getElementById('console').innerHTML += "<div>"+text+"</div>";
    ui[3].move(ui[3].x, ui[3].sy +  ui[3].sh - ui[3].h);
}

console.clear = function(text){
    document.getElementById('console').innerHTML = "";
    ui[3].move(ui[3].x, ui[3].sy +  ui[3].sh - ui[3].h);
}