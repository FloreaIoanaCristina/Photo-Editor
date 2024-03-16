    //canvas principal
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
  // canvas overlay (transparent, deasupra canvasului principal)
    let o = document.getElementById("overlay");
    let otx = o.getContext("2d");

    var canvasOffset = o.getBoundingClientRect();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var startX;
    var startY;
    let isDrawing = false;

   

    otx.strokeStyle = "black";
    otx.lineWidth = 1;
    otx.setLineDash([5, 15]);
    let out = true;
    
    var d1=0,d2=0,d3=800,d4=600;
    var origW= 800;
    var origH = 600;

    //EFECTE 
    var grayscale = function(context) {
		var imgd = context.getImageData(d1, d2, d3-d1, d4-d2);
		var pix = imgd.data;
		for (var i = 0, n = pix.length; i < n; i += 4) {
			var grayscale = pix[i] * .3 + pix[i+1] * .6 + pix[i+2] * .10;
			pix[i] = grayscale;
			pix[i+1] = grayscale;
			pix[i+2] = grayscale;
		}
		context.putImageData(imgd, d1, d2);
	}
    var sketch = function(context) {
		var imgd = context.getImageData(d1, d2, d3-d1, d4-d2);
		var pix = imgd.data;
		for (var i = 0, n = pix.length; i < n; i += 4) {
			var schita = pix[i ] * 1 + pix[i+1]  + pix[i+2] ;
			pix[i  ] = schita;
			pix[i+1] = schita;
			pix[i+2] = schita;
		}
		context.putImageData(imgd, d1, d2);
    }
    var bright = function(context) {
		var imgd = context.getImageData(d1, d2, d3-d1, d4-d2);
		var pix = imgd.data;
		for (var i = 0, n = pix.length; i < n; i += 4) {
            pix[i  ] =  pix[i] *2;
			pix[i+1] = pix[i+1]*2;
			pix[i+2] = pix[i+2]*2;
        }
		context.putImageData(imgd, d1, d2);
    }

//FUNCTIE DE INCARCARE FISIER PE CANVAS
var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
    
}
//FUNCTIE DE AFISARE POZA PE CANVAS
var displayOnCanvas = function(event)
{   ctx.clearRect(0, 0, c.width, c.height);
    var image = document.getElementById('output');
    c.width= image.naturalWidth;
    c.height= image.naturalHeight;
    o.width= image.naturalWidth;
    o.height= image.naturalHeight;
    otx.strokeStyle = "black";
    otx.lineWidth = 1;
    otx.setLineDash([5, 15]);
    ctx.drawImage(image,0,0);
    otx.strokeRect(1,1,o.width-2,o.height-2);
    d1=0;
    d2=0;
    d3=image.naturalWidth;
    d4=image.naturalHeight;
    origW=image.naturalWidth;
    origH=image.naturalHeight;
}

//Functie pentru drop pe canvas
function dropHandler(e) {

    e.preventDefault();
  
    var file = e.dataTransfer.files[0];
    
    const reader = new FileReader();
    reader.readAsDataURL(file);   
    reader.addEventListener('loadend',() => {
    var image = document.getElementById('output');
    image.src = reader.result;
    });
    
    
  }
   //functie pentru drag pe canvas
  function dragOverHandler(e) {
   
    e.preventDefault();
  }

 //buton care salveaza outputul canvasului intr-o poza si o descarca in memorie
  const save = document.getElementById('save');
 save.addEventListener('click', function (e) 
 {
  const link = document.createElement('a');
  link.download = 'download.png';
  link.href = c.toDataURL();
  link.click();
  link.delete;

  
});

//curata canvasul overlay
function clearOverlay() {
    otx.clearRect(0, 0, o.width, o.height);
    otx.strokeStyle = 'black';
    otx.lineWidth = 1;
}
//evenimente pentru selectie
//cand mouse-ul e apasat incepe selectia
o.addEventListener('mousedown', e => {
   
    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
    clearOverlay();
    o.style.cursor = "crosshair";
});
//cand mouse-ul iese in afara canvasului se opreste selectia 
o.addEventListener('mouseout',e=>{
    isDrawing=false;
    out = true;
})
//cand mouse-ul se misca se creaza spatiul de selectie
o.addEventListener('mousemove', e => {
    if (isDrawing) {
        clearOverlay();
        otx.beginPath();
        otx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);  
        otx.stroke();
        d1=startX;
        d2= startY;
        d3=  e.offsetX;
        d4= e.offsetY;
        
    } 
    
});
//cand mouse-ul nu mai e apasat se incheie selectia
o.addEventListener('mouseup', e => {
    if (isDrawing) {
        isDrawing = false;
        o.style.cursor = "default";
    }

});
//functie pentru a cropa selectia
const crop = document.getElementById('crop');
 crop.addEventListener('click', function (e) 
 {
  
   
   ctx.clearRect(0, 0, c.width, c.height);
   var image = document.getElementById('output');
   c.width= d3-d1;
   c.height= d4-d2;
   o.width= d3-d1;
   o.height= d4-d2;
   otx.strokeStyle = "black";
   otx.lineWidth = 1;
   otx.setLineDash([5, 15]);
   ctx.drawImage(image,d1,d2,d3-d1,d4-d2,0,0,d3-d1,d4-d2);
   otx.strokeRect(1,1,o.width-2,o.height-2);
    dataUrl = c.toDataURL();
    image.src=dataUrl;

  
});
//functia care diferentiaza filtrele in functie de valoarea din selector
function addFilter()
{
    var e = document.getElementById("effects");
    var value = e.value;
    if(value == 'grayscale') {
        grayscale(ctx);
    } else if(value == 'sketch') {
        sketch(ctx);
    } else if(value == 'bright') {
       bright(ctx);
    }else {
        
    }
    var image = document.getElementById('output');
    dataUrl = c.toDataURL();
    image.src=dataUrl;
}

var e = document.getElementById("widthspec");
var f = document.getElementById("heightspec");
var xn; //x nou
var yn; // y nou

//readuce imaginea la marimea initiala
const restore = document.getElementById('restore');
restore.addEventListener('click', function (e) 
 {
    ctx.clearRect(0, 0, c.width, c.height);
    var image = document.getElementById('output');
    c.width= origW;
    c.height= origH;
    o.width= origW;
    o.height= origH;
    otx.strokeStyle = "black";
    otx.lineWidth = 1;
    otx.setLineDash([5, 15]);
    ctx.drawImage(image,0,0,origW,origH);
    otx.strokeRect(1,1,o.width-2,o.height-2);
    e.value= origW;
    f.value = origH;


  
});
//modifica lungime imaginii si scaleaza in functie de valorile initiale
function addWidth()
{
    
    var xn = e.value;
    yn = xn*(origH/origW);
    f.value =yn;
    ctx.clearRect(0, 0, c.width, c.height);
    var image = document.getElementById('output');
    c.width= xn;
    c.height= yn;
    o.width= xn;
    o.height= yn;
    otx.strokeStyle = "black";
    otx.lineWidth = 1;
    otx.setLineDash([5, 15]);
    ctx.drawImage(image,0,0,xn,yn);
    otx.strokeRect(1,1,o.width-2,o.height-2);
   // dataUrl = c.toDataURL();
  // image.src=dataUrl;

}
//modifica inaltimea imaginii si scaleaza in functie de valorile initiale
function addHeight()
{
   
    var yn = f.value;
    xn = yn*(origW/origH);
    e.value =xn;
    ctx.clearRect(0, 0, c.width, c.height);
   var image = document.getElementById('output');
   c.width= xn;
   c.height= yn;
   o.width= xn;
   o.height= yn;
   otx.strokeStyle = "black";
   otx.lineWidth = 1;
   otx.setLineDash([5, 15]);
   ctx.drawImage(image,0,0,xn,yn);
   otx.strokeRect(1,1,o.width-2,o.height-2);
  // dataUrl = c.toDataURL();
   //image.src=dataUrl;

}
//selectori pentru text
var txt = document.getElementById("addText");
    var sz = document.getElementById("addSize");
    var px = document.getElementById("addX");
    var py = document.getElementById("addY");
    var clr = document.getElementById("colors");


//schimba culoarea fontului
function changeColor()
{
    var col = clr.value;
    if(col == 'red') {
        ctx.fillStyle="red";
    } else if(col == 'orange') {
        ctx.fillStyle="orange";
    } else if(col == 'yellow') {
        ctx.fillStyle="yellow";
    } else if(col == 'green') {
        ctx.fillStyle="green";
    } else if(col == 'blue') {
        ctx.fillStyle="blue";
    } else if(col == 'purple') {
        ctx.fillStyle="purple";
    } else if(col == 'pink') {
        ctx.fillStyle="pink";
    } else if(col == 'white') {
        ctx.fillStyle="white";
    }else{
        ctx.fillStyle="black";
        }
}
//adauga textul in functie de valorile din selectori la apasarea butonului 
const textAdder = document.getElementById('textAdder');
textAdder.addEventListener('click', function (e) 
 {
    
  var str = sz.value +"px serif";
    ctx.font =str;
    ctx.fillText(txt.value,px.value,py.value);
  
   console.log(txt.value);
   console.log(sz.value);
   console.log(px.value);
   console.log(py.value);
   console.log(clr.value);
   
    
   var image = document.getElementById('output');
   dataUrl = c.toDataURL();
   image.src=dataUrl;
  
});
//sterge portiunea selectata din document 
const sterge = document.getElementById('sterge');
sterge.addEventListener('click', function (e) 
{
    var imgd = ctx.getImageData(d1, d2, d3-d1, d4-d2);
    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i] = 255;
        pix[i+1] = 255;
        pix[i+2] = 255;
    }
    ctx.putImageData(imgd, d1, d2);
    var image = document.getElementById('output');
   dataUrl = c.toDataURL();
   image.src=dataUrl;
});