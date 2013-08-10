window.requestAnimFrame =
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

var Utils = {
  dist : function (pl, dps) {
    return (Math.sqrt(Math.pow(pl.x - dps.x, 2) + Math.pow(pl.y - dps.y, 2)))
  }
}

var World = function()
{
  this.entities = [ ];
  this.debug = false;
  this.pause = false;
  this.fpsMax = 60;
  this.g = 1;
  this.canvas = "";
  this.context = "";
  this.mousedown = false;
}

var n_tmp;

World.prototype.init = function() {

  var _this;

  _this = this
  n_tmp = undefined

  this.canvas = document.getElementById("game");
  this.canvas.width = document.body.clientWidth;
  this.canvas.height = 500;
  this.context = this.canvas.getContext("2d");

  // Events handlers

  // disable touchmove default behavior for scrolling
  document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  var mouseUp = function(e) {
    var tmp = new Asteroid(
        n_tmp.x
      , n_tmp.y
      , 15
      , "#0f0"
      )
    var tmp_x = (n_tmp.x - n_tmp.xp) || 0
    var tmp_y = (n_tmp.y - n_tmp.yp) || 0
    var dist = Math.min(Math.sqrt(tmp_x * tmp_x + tmp_y * tmp_y), 50) || 1;
    if (dist != 0)
    {
      tmp.vx = tmp_x / dist * (dist / 10)
      tmp.vy = tmp_y / dist * (dist / 10)
    }
    _this.entities.push(tmp);
    _this.mousedown = false
    n_tmp = undefined 
 };
  var mouseDown = function(e) { 
    _this.mousedown = true;
    n_tmp = {
      x : e.clientX || 0,
      y : e.clientY || 0,
      xp : undefined,
      yp : undefined
    }
  };
  var mouseMove = function(e) {
    if (_this.mousedown && n_tmp)
    {
      n_tmp.xp = e.clientX
      n_tmp.yp = e.clientY
    }
  }
  var touchMove = function(e) {
    if (_this.mousedown && n_tmp)
    {
      n_tmp.xp = e.touches[0].pageX
      n_tmp.yp = e.touches[0].pageY
    }
  }

  // Generating planets
  for (var i = 0; i < 3; i++)
  {
    var tmp = new Planet(
        Math.floor(Math.random() * this.canvas.width) % (this.canvas.width - 200) + 100
      , Math.floor(Math.random() * this.canvas.height) % (this.canvas.height - 200) + 100
      , Math.floor(Math.random() * 100) + 20
      , "#f00"
    );
    this.entities.push(tmp);
  }

  for (var i = 0; i < 3; i++)
  {
    var tmp = new Planet(
        Math.floor(Math.random() * this.canvas.width) % (this.canvas.width - 200) + 100
      , Math.floor(Math.random() * this.canvas.height) % (this.canvas.height - 200) + 100
      , Math.floor(Math.random() * -100) - 20
      , "#f0f"
    );
    this.entities.push(tmp);
  }

  // Generating asteroids
  for (var i = 0; i < 50; i++)
  {
     var tmp = new Asteroid(
        Math.floor(Math.random() * this.canvas.width) % (this.canvas.width - 200) + 100
      , Math.floor(Math.random() * this.canvas.height) % (this.canvas.height - 200) + 100
      , 15
      , "#ff0"
    );
    this.entities.push(tmp);
  }

  this.canvas.addEventListener("mousedown", mouseDown);
  this.canvas.addEventListener("mouseup", mouseUp);
  this.canvas.addEventListener("mousemove", mouseMove);
  this.canvas.addEventListener("touchstart", mouseDown);
  this.canvas.addEventListener("touchend", mouseUp);
  this.canvas.addEventListener("touchmove", touchMove);

  this.loop();
}

World.prototype.loop = function() {
  var _this;

  _this = this;

  this.context.fillStyle = "#000";
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  if (n_tmp)
  {
    this.context.save()
    this.context.strokeStyle = "rgb(0,0,255)"
    this.context.beginPath()
    this.context.moveTo(n_tmp.x, n_tmp.y)
    this.context.lineTo(n_tmp.xp, n_tmp.yp)
    this.context.stroke()
    this.context.closePath()
    this.context.restore()
  }

  this.entities.forEach(function(elem, index) {
    if (elem != undefined)
    {
      elem.run(_this); 
      elem.draw(_this.context);
    }
  });
  requestAnimationFrame(function() {
    _this.loop();
  });
  return true;
}

var Point = function(x, y) {
  this.x = x;
  this.y = y;
}

var Entity =  function(x, y, m, color) {
  Point.call(this, x, y);
  this.m = m;
  this.r = Math.abs(this.m) / 2;
  this.color = color;
  this.onclick = function() { };
}

Entity.prototype.draw = function(context) {
  if (typeof context != "object" || !(context instanceof CanvasRenderingContext2D))
    return false;

  context.fillStyle = this.color;
  context.beginPath();
  context.arc(this.x, this.y, Math.abs(this.m) / 2, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
  return true;
}

Planet = function(x, y, m, color) {
  Entity.call(this, x, y, m, color);
}

for (var element in Entity.prototype ) {
  Planet.prototype[element] = Entity.prototype[element];
}

Planet.prototype.run = function() {
  return true;
}

var Asteroid = function(x, y, m, color) {
  Entity.call(this, x, y, m, color);
  this.vx = 0;
  this.vy = 0;
  this.cos = NaN;
  this.sin = NaN;
}

for (var element in Entity.prototype ) {
  Asteroid.prototype[element] = Entity.prototype[element];
}

Asteroid.prototype.run = function(world)
{
  var vdist, d_x, d_y, tan, cos, sin, force_grav, _this, len, elem, a

  _this = this

  if (typeof world != "object" || !(world instanceof World) || world.pause)
    return false

  len = world.entities.length
  elem = world.entities
  for (var i = 0; i < len; i++) {
    if (elem[i] == undefined || elem[i] instanceof Planet)
      continue
    a = _this.r + elem[i].r
    if (elem[i].x < 0 || elem[i].y < 0 || elem[i].x > 2000 || elem[i].y > 2000)
      {
        elem[i] = undefined
        continue
      }
    vdist = Utils.dist(_this, elem[i])
    if (vdist == 0 || vdist >= a)
      continue
    pen = vdist - a
    cos = (-_this.x + elem[i].x) / vdist
    sin = (-_this.y + elem[i].y) / vdist
    _this.vx = _this.vx * 0.5 + cos * pen 
    _this.vy = _this.vy * 0.5 + sin * pen
  }

  for (var i = 0; i < len; i++) {
    if (elem[i] == undefined || elem[i] instanceof Asteroid)
      continue
    vdist = Utils.dist(_this, elem[i])
    if (vdist == 0)
      continue
    d_x = -_this.x + elem[i].x;
    d_y = -_this.y + elem[i].y;
    cos = d_x / vdist;
    sin = d_y / vdist;
    force_grav = world.g * (_this.m * elem[i].m) / Math.pow(vdist, 2);

    _this.vx = _this.vx + cos * force_grav;
    _this.vy = _this.vy + sin * force_grav;
    pen = vdist - (_this.r + elem[i].r);
    if (pen < 0)
    {
      _this.vx = _this.vx * 0.8 + (cos * pen);
      _this.vy = _this.vy * 0.8 + (sin * pen);
    }
  }

  d_x = -this.x + (this.x + this.vx);
  d_y = -this.y + (this.y + this.vy);

  vdist = Math.sqrt(d_x * d_x + d_y * d_y);

  this.cos = d_x / vdist;
  this.sin = d_y / vdist;
  this.x = this.x + this.vx;
  this.y = this.y + this.vy;
  return true;
}

galaxy = new World;
galaxy.init();