window.addEventListener("load",function() {

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

var SPRITE_BOX = 1;

Q.gravityY = 2000;

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p,{
      sheet: "player",
      sprite: "player",
      collisionMask: SPRITE_BOX, 
      x: 1140,
      y: 555,
      standingPoints: [ [ -16, 44 ], [ -23, 35 ], [-23,-48], [23,-48], [23, 35 ], [ 16, 44 ]],
      duckingPoints : [ [ -116, 44], [ -123, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      speed: 500,
      jump: -400
    });

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.vx += (this.p.speed - this.p.vx)/4;

    if(this.p.y > 555) {
      this.p.y = 555;
      this.p.landed = 1;
      this.p.vy = 0;
    } else {
      this.p.landed = 0;
    }

    if(Q.inputs['up'] && this.id === 1) { // && this.p.landed > 0
      this.p.vy = this.p.jump;
    }
    else if(this.id === 2 && Q.inputs['down'])
    {
      this.p.vy = this.p.jump; 
    }

    this.p.points = this.p.standingPoints;
    
    if(this.p.landed) {
      if(Q.inputs['down']) { 
        this.play("duck_right");
        this.p.points = this.p.duckingPoints;
      } else {
        this.play("walk_right");
      }
    } else {
        if(Q.inputs['up']) { 
            this.play("fly_right");
            this.p.points = this.p.duckingPoints;
        }
        else{
        	this.play("fly_right");
	  }
    }

    this.stage.viewport.centerOn(this.p.x + 300, 400 );

  }
});

Q.Sprite.extend("Pipe",{
  init: function(yyy,dirdir) {

    var player = Q("Player").first();
    this._super({
      x: player.p.x + Q.width - 400,
      y: yyy-400,
      frame: dirdir,
      scale: 2,
      type: SPRITE_BOX,
      sheet: "pipes",
      vx: 0, //-600,
      vy: 0,
      ay: 0
      //theta: 2000
      //theta: (300 * Math.random() + 200) * (Math.random() < 0.5 ? 1 : -1)
    });


    this.on("hit");
  },

  step: function(dt) {
    //this.p.x += this.p.vx * dt;


    //this.p.vy += this.p.ay * dt;
    //this.p.y += this.p.vy * dt;
    //if(this.p.y != 565) {		//
    //  this.p.angle += this.p.theta * dt;
    //}

    //if(this.p.y > 800) { this.destroy(); }

  },

  hit: function() {
    this.p.type = 0;
    this.p.collisionMask = Q.SPRITE_NONE;
    this.p.vx = 200;
    this.p.ay = 400;
    this.p.vy = -300;
    this.p.opacity = 0.5;
  }
  

});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 1,
      launch: 1
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      var rand = Math.random();
      var pos = (250*rand);
      this.stage.insert(new Q.Pipe(pos,1));
      this.stage.insert(new Q.Pipe(pos + 1200,0));
      this.p.launch = this.p.launchDelay;
    }
  }

});


Q.scene("level1",function(stage) {

  stage.insert(new Q.Repeater({ asset: "background-sky.png",
                                speedX: 0.01 }));
  
  stage.insert(new Q.Repeater({ asset: "background-clouds.png",
      speedX: 0.05 }));

  stage.insert(new Q.Repeater({ asset: "background-floor2.png",
                                repeatY: false,
                                speedX: 1.0,
                                y: 300 }));

  stage.insert(new Q.BoxThrower());

  var p1 = new Q.Player();
  var p2 = new Q.Player();
  p1.id = 1
  p2.id = 2

  stage.insert(p1);
  stage.insert(p2);
  stage.add("viewport");

});
  
Q.load("player.json, player.png, background-sky.png, background-clouds.png, background-floor2.png, pipes.png, pipes.json", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("pipes.png","pipes.json");
    Q.animations("player", {
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      fly_right: { frames: [0,1,2,3], rate: 1/9, flip: false, loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      duck_right: { frames: [15], rate: 1/10, flip: false },
    });
    Q.stageScene("level1");
  
});


});
