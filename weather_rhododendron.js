var w;

var center;

var petalHeight = 80;
var petalWidth = 60;
var sidePetalHeight = 50;
var sidePetalWidth = 40;
var sidePetalAngle = 0;
var leafLength = 500;
var leafWidth = 100;

var temps;
var temp = 50;
var tempMin = 0;
var tempMax = 100;
var requested = false;

var angle;
var sliderLeft;
var sliderRight;
var sliderY;
var sliderX;
var dragEnabled = false;
var inspectTime;

function setup() {
  createCanvas(1200,1750);
  w = requestWeather('data/mit-tuesday.json');
  //w = requestWeather('data/mit-wednesday.json');
  //w = requestWeather('data/cambridge.json');
  //w = requestWeather('data/indianapolis.json');
  //w = requestWeather('data/alcatraz.json');
  //w = requestWeather(42.3596764, -71.0958358, '563947581de770fe71b6cbe25c6715d6');
  center = createVector(width/2, height/3);
  sliderLeft = width/6;
  sliderRight = 5*width/6;
  inspectTime = hour();
  sliderX = map(inspectTime, 0, 24, sliderLeft, sliderRight);
  sliderY = height/8;
}

function draw() {
  //set up data
  inspectTime = int(map(sliderX, sliderLeft, sliderRight, 0, 24));
  if (w.ready && !requested) {
    temps = w.getApparentTemperature('hourly');
    temp = temps[inspectTime];
    requested = true;
  } else if (requested) {
    temp = temps[inspectTime];
  }
  
  if (inspectTime <= 5 || inspectTime > 19) {
    background(50,50,100);
  } else {
    background(10,200,250);
  }
 
  //leaves
  fill(130,190,120);
  leafWidth = map(temp, tempMin, tempMax, 5, 120);
  //center leaf
  beginShape();
  vertex(center.x-leafWidth, center.y+leafLength);
  vertex(center.x, center.y);
  vertex(center.x+leafWidth, center.y+leafLength);
  endShape();
  curve(center.x, center.y, center.x-leafWidth, center.y+leafLength, center.x+leafWidth, center.y+leafLength, center.x, center.y);
  //right leaf
  beginShape();
  vertex(center.x+2*leafWidth, center.y+leafLength);
  vertex(center.x, center.y);
  vertex(center.x+3*leafWidth, center.y+leafLength);
  endShape();
  curve(center.x, center.y, center.x+2*leafWidth, center.y+leafLength, center.x+3*leafWidth, center.y+leafLength, center.x, center.y);
  //left leaf
  beginShape();
  vertex(center.x-2*leafWidth, center.y+leafLength);
  vertex(center.x, center.y);
  vertex(center.x-3*leafWidth, center.y+leafLength);
  endShape();
  curve(center.x, center.y, center.x-2*leafWidth, center.y+leafLength, center.x-3*leafWidth, center.y+leafLength, center.x, center.y);
  
  
  //flower
  if (inspectTime <= 5 || inspectTime > 19) {
    fill(130,190,120);
    petalHeight = 80;
    sidePetalAngle = PI/2;
  } else {
    fill(220,160,255);
    if (inspectTime < 12) {
       petalHeight = 80-2*inspectTime;
       sidePetalAngle = map(inspectTime, 5, 12, PI/2, 0);
    } else {
       petalHeight = 80-(48-2*inspectTime);
       sidePetalAngle = map(inspectTime, 12, 19, 0, PI/2);
    }
  }
  //side petals
  beginShape();
  vertex(center.x-(petalWidth*cos(sidePetalAngle)), center.y-(petalHeight*sin(sidePetalAngle)));
  vertex(center.x, center.y);
  vertex(center.x-(1.5*petalWidth*cos(sidePetalAngle)), center.y-petalHeight*sin(sidePetalAngle)+20);
  endShape();      
  curve(center.x, center.y,
        center.x-(petalWidth*cos(sidePetalAngle)), center.y-(petalHeight*sin(sidePetalAngle)),
        center.x-(1.5*petalWidth*cos(sidePetalAngle)), center.y-petalHeight*sin(sidePetalAngle)+20,
        center.x, center.y);
  beginShape();
  vertex(center.x+(petalWidth*cos(sidePetalAngle)), center.y-(petalHeight*sin(sidePetalAngle)));
  vertex(center.x, center.y);
  vertex(center.x+1.5*petalWidth*cos(sidePetalAngle), center.y-petalHeight*sin(sidePetalAngle)+20);
  endShape();
  curve(center.x, center.y,
        center.x+(petalWidth*cos(sidePetalAngle)), center.y-(petalHeight*sin(sidePetalAngle)),
        center.x+1.5*petalWidth*cos(sidePetalAngle), center.y-petalHeight*sin(sidePetalAngle)+20,
        center.x, center.y);
  //front petal
  arc(center.x, center.y-petalHeight/3, petalHeight, petalHeight, PI/4, 3*PI/4);
  arc(center.x, center.y, petalWidth, 2*petalHeight, PI, 2*PI);
  
  
  
  //time scroll line
  strokeWeight(3);
  line(sliderLeft, sliderY, sliderRight, sliderY);
  if (inspectTime < 5 || inspectTime > 19) {
    fill(255);
  } else {
    fill(240,170,10);
  }
  ellipse(sliderX, sliderY, 100, 100);
  
}

function mousePressed() {
  //if you touched the lil circle
  if (mouseX < sliderX + 50 && mouseX > sliderX - 50 && mouseY < sliderY + 50 && mouseY > sliderY - 50) {
    dragEnabled = true;
  } else if (mouseX < center.x + petalWidth && mouseX > center.x - petalWidth && mouseY < center.y && mouseY > center.y - petalHeight) {
    sliderX = map(hour(), 0, 24, sliderLeft, sliderRight);
  }
}

function mouseDragged() {
  if (dragEnabled) {
    sliderX = max(sliderLeft, min(sliderRight, mouseX));
  }
}

function mouseReleased() {
  dragEnabled = false;
}