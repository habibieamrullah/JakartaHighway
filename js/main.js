var Android;

//ZK App Data
var appData = { title : "AwasNabrak" };
appData.currentScore = 0;
appData.highScore = 0;

if(localStorage.getItem(appData.title) !== null){
	appData = JSON.parse(localStorage.getItem(appData.title));
}

function saveData(){
	localStorage.setItem(appData.title, JSON.stringify(appData));
}

//SCREEN VARS
var baseWidth = 1280;
var screenRatio = window.innerWidth/window.innerHeight;
var gameHeight = baseWidth/screenRatio;

//PHASER VAR
var game = new Phaser.Game(baseWidth, gameHeight, Phaser.AUTO);
var ZKGame = {};
var score;
var highscore;
var timer;
var cagak;
var puun;
var ndaset;
var mobil;
var carSpeed;
var maxSpeed;
var mobilDamage;
var imdestroyed;
var gameover;
var goingdown;
var goingup;
var keyboardcontrol = true;

function restartGame(){
	carSpeed = 40;
	maxSpeed = 200;
	mobilDamage = 1;
	imdestroyed = false;
	gameover = false;
	appData.currentScore = 0;
}

ZKGame.LogoIntro = {
	preload : function(){
		game.load.image("logo", "assets/zkcs.png");
	},
	create : function(){
		game.stage.backgroundColor = "#ffffff";
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		var zkLogo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
		zkLogo.anchor.setTo(.5, .5);
		game.camera.flash(0x000000, 1000);
		setTimeout(function(){
			game.state.start("MainMenu");
		}, 4000);
	}
}

ZKGame.MainMenu = {
	preload : function(){
		game.stage.backgroundColor = "#000000";
		game.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
		game.load.image("aspal", "assets/aspal.jpg");
		game.load.image("homeart", "assets/homeart.png");
	},
	create : function(){
		this.jalanan = game.add.tileSprite(0, 0, game.width, game.height, "aspal");
		
		this.homeart = game.add.sprite(0, -50, "homeart");
		this.gametitle = game.add.bitmapText(game.world.centerX, game.world.centerY + 100, "font", "Jakarta Highway", 90);
		this.gametitle.anchor.setTo(.5);
		
		this.playButton = game.add.bitmapText(game.world.centerX, this.gametitle.y + 100, "font", "play", 60);
		this.playButton.anchor.setTo(.5);
		this.playButton.inputEnabled = true;
		this.playButton.events.onInputDown.add(function(){
			this.playButton.scale.setTo(1.2);
		}, this);
		this.playButton.events.onInputUp.add(function(){
			this.playButton.scale.setTo(1);
			game.state.start("Run");
		}, this);
		this.leaderboardButton = game.add.bitmapText(game.world.centerX, this.playButton.y + 80, "font", "Leaderboard", 60);
		this.leaderboardButton.anchor.setTo(.5);
		this.leaderboardButton.inputEnabled = true;
		this.leaderboardButton.events.onInputDown.add(function(){
			this.leaderboardButton.scale.setTo(1.2);
		}, this);
		this.leaderboardButton.events.onInputUp.add(function(){
			this.leaderboardButton.scale.setTo(1);
			showLeaderBoard();
		}, this);
		this.abouttext = game.add.text(game.width - 10, game.height - 7, "Created by Habibie (Zofia Kreasi) www.zofiakreasi.com", {font : "15px Arial", fill : "#ffffff"});
		this.abouttext.anchor.setTo(1);
	}, 
}

ZKGame.Run = {
	preload : function(){
		game.load.spritesheet("mobil", "assets/mobil.png", 256, 95);
		game.load.spritesheet("ndaset", "assets/ndaset.png", 74, 74);
		game.load.spritesheet("kobong1", "assets/kobong1.png", 143, 49);
		game.load.spritesheet("kobong2", "assets/kobong2.png", 143, 49);
		game.load.spritesheet("mobilain", "assets/mobilJazz.png", 235, 78);
		game.load.spritesheet("uang", "assets/man.jpg", 72, 32);
		game.load.image("banmobil", "assets/banmobil.png");
		game.load.image("tiang", "assets/tiang.png");
		game.load.image("puun", "assets/puun.png");
		game.load.image("setnopoto", "assets/setnopoto.jpg");
		game.load.image("cityscape", "assets/cityscape.jpg");
		game.load.image("jalanan", "assets/jalanan.png");
		game.load.image("downimage", "assets/down.png");
		game.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
		game.load.audio("hit", "assets/hit.mp3");
		game.load.audio("money", "assets/money.mp3");
	},
	create : function(){
		restartGame();
		game.stage.backgroundColor = "#b9d1eb";
		this.cityscape = game.add.sprite(game.width, game.height-420, "cityscape");
		this.cityscape.anchor.setTo(1, 1);
		
		puun = game.add.sprite(game.width + 400, game.height - 350, "puun");
		puun.anchor.setTo(0, 1);
		
		cagak = game.add.sprite(game.width + 100, game.height - 325, "tiang");
		cagak.anchor.setTo(0, 1);
		
		this.jalanan = game.add.tileSprite(0, game.height-470, game.width, 470, "jalanan");
		
		this.mobilain = game.add.sprite(game.width + 400, game.height - 200, "mobilain");
		this.mobilain.anchor.setTo(.5);
		this.mobilainban1 = game.add.sprite(this.mobilain.x + 70, this.mobilain.y + 35, "banmobil");
		this.mobilainban1.anchor.setTo(.5);
		this.mobilainban1.scale.setTo(.75);
		this.mobilainban2 = game.add.sprite(this.mobilain.x - 87, this.mobilain.y + 35, "banmobil");
		this.mobilainban2.anchor.setTo(.5);
		this.mobilainban2.scale.setTo(.75);
		
		this.uang = {};
		this.uang.value = 100;
		this.uang.object = game.add.sprite(game.width + 750, game.height - 150, "uang");
		this.uang.object.anchor.setTo(.5);		
		
		mobil = game.add.sprite(200, game.height - 100, "mobil");
		mobil.anchor.setTo(.5);
		this.mobilCollider = game.add.sprite(200, game.height - 100, "mobil");
		this.mobilCollider.anchor.setTo(.5, 0);
		this.mobilCollider.scale.setTo(.5);
		this.mobilCollider.alpha = 0;
		
		this.ban1 = game.add.sprite(mobil.x + 76, mobil.y + 30, "banmobil");
		this.ban1.anchor.setTo(.5);
		this.ban2 = game.add.sprite(mobil.x - 80, mobil.y + 30, "banmobil");
		this.ban2.anchor.setTo(.5);
		ndaset = game.add.sprite(mobil.x + 15, mobil.y - 30, "ndaset");
		ndaset.anchor.setTo(.5);
		
		this.kobong3 = game.add.sprite(mobil.x + 130, mobil.y, "kobong1");
		this.kobong3Anim = this.kobong3.animations.add("kobong1");
		this.kobong3.animations.play('kobong1', 20, true);
		this.kobong3.anchor.setTo(1);
		this.kobong3.scale.setTo(1.5);
		this.kobong3.visible = false;
		
		this.kobong1 = game.add.sprite(mobil.x + 120, mobil.y, "kobong1");
		this.kobong1Anim = this.kobong1.animations.add("kobong1");
		this.kobong1.animations.play('kobong1', 20, true);
		this.kobong1.anchor.setTo(1);
		this.kobong1.visible = false;
		
		this.kobong2 = game.add.sprite(mobil.x + 120, mobil.y, "kobong2");
		this.kobong2Anim = this.kobong2.animations.add("kobong2");
		this.kobong2.animations.play('kobong2', 20, true);
		this.kobong2.anchor.setTo(1);
		this.kobong2.visible = false;
		
		this.setnopoto = game.add.sprite(game.world.centerX, game.world.centerY-100, "setnopoto");
		this.setnopoto.anchor.setTo(.5);
		this.setnopoto.scale.setTo(0);
		this.setnopoto.angle = 10;
		
		this.mainlagi = game.add.bitmapText(game.world.centerX, game.height - 200, "font", "Replay", 80);
		this.mainlagi.anchor.setTo(.5);
		this.mainlagi.scale.setTo(0);
		this.mainlagi.inputEnabled = true;
		this.mainlagi.events.onInputDown.add(function(){
			this.mainlagi.scale.setTo(1.2);
		}, this);
		this.mainlagi.events.onInputUp.add(function(){
			game.state.start("Run");
		});
		
		this.tomainmenu = game.add.bitmapText(this.mainlagi.x, this.mainlagi.y + 70, "font", "Main Menu", 80);
		this.tomainmenu.anchor.setTo(.5);
		this.tomainmenu.scale.setTo(0);
		this.tomainmenu.inputEnabled = true;
		this.tomainmenu.events.onInputDown.add(function(){
			this.tomainmenu.scale.setTo(1.2);
		}, this);
		this.tomainmenu.events.onInputUp.add(function(){
			this.tomainmenu.scale.setTo(1);
			game.state.start("MainMenu");
		}, this);
		
		score = game.add.bitmapText(25, 25, "font", "Score : " + appData.currentScore, 40);
		score.anchor.setTo(0, .5);
		highscore = game.add.bitmapText(game.width-25, 25, "font", "High Score : " + appData.highScore, 40);
		highscore.anchor.setTo(1, .5);
		
		this.backbutton = game.add.bitmapText(25, game.height-15, "font", "x", 60);
		this.backbutton.anchor.setTo(0, 1);
		this.backbutton.inputEnabled = true;
		this.backbutton.events.onInputDown.add(function(){
			game.state.start("MainMenu");
		}, this);
		
		this.upButton = game.add.sprite(game.width-100, game.height-250, "downimage");
		this.upButton.anchor.setTo(.5);
		this.upButton.angle = 180;
		this.upButton.inputEnabled = true;
		this.upButton.events.onInputDown.add(function(){
			this.upButton.scale.setTo(1.1);
			goingup = true;
			keyboardcontrol = false;
		}, this);
		this.upButton.events.onInputUp.add(function(){
			this.upButton.scale.setTo(1);
			goingup = false;
			keyboardcontrol = true;
		}, this);
		
		this.downButton = game.add.sprite(this.upButton.x, this.upButton.y+150, "downimage");
		this.downButton.anchor.setTo(.5);
		this.downButton.inputEnabled = true;
		this.downButton.events.onInputDown.add(function(){
			this.downButton.scale.setTo(1.1);
			goingdown = true;
			keyboardcontrol = false;
		}, this);
		this.downButton.events.onInputUp.add(function(){
			this.downButton.scale.setTo(1);
			goingdown = false;
			keyboardcontrol = true;
		}, this);
		
		this.cursors = game.input.keyboard.createCursorKeys();
		
		this.hitSfx = game.add.audio("hit");
		this.moneySfx = game.add.audio("money");
		
		runTimer();

	},
	update : function(){
		score.setText("Score : " + appData.currentScore);
		
		this.ban1.angle += carSpeed;
		this.ban2.angle += carSpeed;
		this.jalanan.tilePosition.x -= carSpeed/3;
		
		cagak.x -= carSpeed/3;
		puun.x -= carSpeed/3.5;
		this.mobilain.x -= (carSpeed/3) - 5;
		this.mobilainban1.angle += 10;
		this.mobilainban2.angle += 10;
		this.mobilainban1.x = this.mobilain.x + 70;
		this.mobilainban2.x = this.mobilain.x - 87;
		this.mobilainban1.y = this.mobilain.y + 35;
		this.mobilainban2.y = this.mobilain.y + 35;
		this.uang.object.x -= carSpeed/10;
		
		if(!gameover){
			
			if(Phaser.Rectangle.intersects(this.mobilCollider.getBounds(), this.mobilain.getBounds())){
				this.mobilain.x = game.width + 400;
				this.mobilain.frame = game.rnd.integerInRange(0, 2);
				this.applyDamage();
			}
			
			if(Phaser.Rectangle.intersects(mobil.getBounds(), this.uang.object.getBounds())){
				this.moneySfx.play();
				this.uang.object.x = game.width + 400;
				appData.currentScore += this.uang.value;
				score.scale.setTo(2);
				game.add.tween(score.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Bounce.Out, true);
				var uangValue = game.rnd.integerInRange(0, 3);
				switch(uangValue){
					case 0:
						this.uang.value = 100;
						break;
					case 1:
						this.uang.value = 50;
						break;
					case 2:
						this.uang.value = 20;
						break;
					case 3:
						this.uang.value = 10;
						break;
					default:
						this.uang.value = 10;
				}
				this.uang.object.frame = uangValue;
			}
			
			if(cagak.x < -100){
				cagak.x = game.width + game.rnd.integerInRange(100, 150);
			}
			if(puun.x < -600){
				puun.x = game.width + game.rnd.integerInRange(100, 600);
				puun.y = game.height - game.rnd.integerInRange(250, 350);
			}
			if(this.mobilain.x < -200){
				this.mobilain.x = game.width + game.rnd.integerInRange(200, 400);
				this.mobilain.y = game.rnd.integerInRange(game.height-400, game.height-80);
				this.mobilain.frame = game.rnd.integerInRange(0, 2);
			}
			if(this.uang.object.x < -200){
				this.uang.object.x = game.width + game.rnd.integerInRange(200, 400);
				this.uang.object.y = game.rnd.integerInRange(game.height-400, game.height-80);
				var uangValue = game.rnd.integerInRange(0, 3);
				switch(uangValue){
					case 0:
						this.uang.value = 100;
						break;
					case 1:
						this.uang.value = 50;
						break;
					case 2:
						this.uang.value = 20;
						break;
					case 3:
						this.uang.value = 10;
						break;
					default:
						this.uang.value = 10;
				}
				this.uang.object.frame = uangValue;
			}
			
			if(mobilDamage >= 2){
				this.kobong1.visible = true;
			}
			if(mobilDamage >= 3){
				this.kobong2.visible = true;
				this.kobong3.visible = true;
			}			
		}

		if(goingup){
			if(mobil.y > game.height-400)
				mobil.y -= carSpeed/5;
		}
		if(goingdown){
			if(mobil.y < game.height-75)
				mobil.y += carSpeed/5;
		}
		if(keyboardcontrol){		
			if(this.cursors.up.isDown){
				goingup = true;
			}
			if(this.cursors.up.isUp){
				goingup = false;
			}
			if(this.cursors.down.isDown){
				goingdown = true;
			}
			if(this.cursors.down.isUp){
				goingdown = false;
			}
		}
		
		ndaset.x = mobil.x + 15;
		this.kobong3.x = mobil.x + 130;
		this.kobong1.x = mobil.x + 120;
		this.kobong2.x = mobil.x + 120;
		this.ban1.x = mobil.x + 76;
		this.ban2.x = mobil.x - 80;
		ndaset.y = mobil.y - 30;
		this.kobong3.y = mobil.y;
		this.kobong1.y = mobil.y;
		this.kobong2.y = mobil.y;
		this.ban1.y = mobil.y + 30;
		this.ban2.y = mobil.y + 30;
		this.mobilCollider.y = mobil.y;
	},
	applyDamage : function(){
		if(Android != undefined) Android.vibrate();
		this.hitSfx.play();
		game.camera.shake(0.01, 300);
		ndaset.frame = 1;
		if(mobilDamage <= 3 && !imdestroyed){
			mobilDamage += .5;
			carSpeed -= 5;
			mobil.frame = Math.floor(mobilDamage);
			imdestroyed = true;
			setTimeout(function(){
				ndaset.frame = 0;
				imdestroyed = false;
			}, 2000);
		}
		if(mobilDamage > 3){
			gameover = true;
			game.add.tween(this.setnopoto.scale).to({x: 1.5, y: 1.5}, 1000, Phaser.Easing.Bounce.Out, true);
			game.add.tween(mobil).to({x : -250}, 1000, Phaser.Easing.Cubic.Out, true);
			game.add.tween(this.mainlagi.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Bounce.Out, true, 100);
			game.add.tween(this.tomainmenu.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Bounce.Out, true, 100);
			game.add.tween(this.upButton).to({x : game.width + 100}, 1000, Phaser.Easing.Cubic.Out, true);
			game.add.tween(this.downButton).to({x : game.width + 100}, 1000, Phaser.Easing.Cubic.Out, true);
			
			if(appData.currentScore > appData.highScore){
				appData.highScore = appData.currentScore;
				highscore.setText("High Score : " + appData.highScore);
				highscore.scale.setTo(5);
				game.add.tween(highscore.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Bounce.Out, true);
				saveData();
				updateScore(appData.highScore);
				if(Android != undefined) Android.showAd();
			}
		}
	}
}

game.state.add("LogoIntro", ZKGame.LogoIntro);
game.state.add("Run", ZKGame.Run);
game.state.add("MainMenu", ZKGame.MainMenu);
game.state.start("LogoIntro");

function runTimer(){
	if(!gameover)
		game.time.events.add(Phaser.Timer.SECOND * 2, resetTimer, this);
}

function resetTimer(){
	if(carSpeed < maxSpeed){
		carSpeed += 3;
	}
	if(!gameover){
		appData.currentScore += 1;
		score.scale.setTo(1.23);
		game.add.tween(score.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Bounce.Out, true);
	}
	runTimer();
}