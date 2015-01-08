/**
 * @fileOverview: 重力平台demo
 * @email: tiantian5@leju.com
 * @date: 2014-12-08
 */
define(function (require, exports) {
    var $ = require("zepto");
    var xg = yg = zg = 0;
    var running = false;
    var timer = 0;
    var timerMarker = 0;
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext('2d');
    var imageData = null;
    var pixels = null;
    var img = document.createElement("img");
    img.onload = function(){
        $("#start").removeAttr("disabled");
    };
    img.src = "./ball.png";
    var cvsWidth = cvs.width;
    var ball = null;
    
    function Ball(){
        this.w = 10; // weight
        this.x = 12;  // location x
        this.y = 12;  // location y
        this.vx = 0;  // velocity x
        this.vy = 0;  // velocity y
        this.timer = null;
        this.hole = {x: 330, y: 330};
    }

    Ball.prototype = { 
        init: function(){
            var that = this;
            imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
            pixels = imageData.data;
    
            this.createHole();
            ctx.drawImage( img, this.x, this.y );
            this.timer = window.setInterval(function(){that.move();}, 33);
        },
        canMove: function( tar ){
            return pixels[ (tar.y * cvsWidth + tar.x) * 4 ] == 51 ? false : true;
        },
        move: function(){
            this.clearMyself();
//            var pos = cvsWidth * this.y + this.x;
            var wallPos = {x: 0, y: 0 };
            
            if( xg > 0 ){
                if( yg < 0 ){ // NW
                    wallPos.x = this.x - 1;
                    wallPos.y = this.y - 1;
                    console.log("NW");
                }else if( yg > 0 ){ //SW
                    wallPos.x = this.x - 1;
                    wallPos.y = this.y + 21;
                    console.log("SW");
                }else{ // W
                    wallPos.x = this.x - 1;
                    wallPos.y = this.y + 10;
                    console.log("W");
                }
            }else if( xg < 0 ){
                if( yg < 0 ){ // NE
                    wallPos.x = this.x + 21;
                    wallPos.y = this.y - 1;
                    console.log("NE");
                }else if( yg > 0 ){ // SE
                    wallPos.x = this.x + 21;
                    wallPos.y = this.y + 21;
                    console.log("SE");
                }else{ // E
                    wallPos.x = this.x + 21;
                    wallPos.y = this.y + 10;
                    console.log("E");
                }
            }else{  // xg == 0
                if( yg < 0 ){ // N
                    wallPos.x = this.x + 10;
                    wallPos.y = this.y - 1;
                    console.log("N");
                }else if( yg > 0 ){ // S
                    wallPos.x = this.x + 10;
                    wallPos.y = this.y + 21;
                    console.log("S");
                }else{ // C
                    wallPos.x = this.x + 10;
                    wallPos.y = this.y + 10;
                    console.log("C");
                }
            }
            
            if( this.canMove( wallPos ) ){
                this.x += xg * (-1); //x轴重力加速度于x轴相反
                this.y += yg;
            }
            
            this.drawHole();
            this.draw();
            
        },
        clearMyself: function(){
            ctx.fillStyle = "#eeeeee";
//            ctx.beginPath();
//            ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2);
//            ctx.closePath();
//            ctx.fill();
            ctx.fillRect(this.x, this.y, 20, 20);
        },
        stop: function(){
            window.clearInterval( this.timer );
        },
        draw: function(){
            ctx.drawImage( img, this.x, this.y );
        },
        createHole: function(){
//            this.hole.x = parseInt(Math.random()*(maxX - minX + 1) + minX+10); 
//            this.hole.y = parseInt(Math.random()*(maxY - minY + 1) + minY+10); 
            this.drawHole();
        },
        drawHole: function(){
            ctx.fillStyle="#FF0000";
            ctx.beginPath();
            ctx.arc(this.hole.x,this.hole.y,10,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    if(window.DeviceMotionEvent) { 
        window.addEventListener('devicemotion', deviceMotionHandler, false);

        function deviceMotionHandler(event){
            var accGravity = event.accelerationIncludingGravity;
            
            xg = accGravity.x > 2 ? 1 : accGravity.x < -2 ? -1 : 0;
            yg = accGravity.y > 2 ? 1 : accGravity.y < -2 ? -1 : 0;
        }
    }
    
    $("#reload").on("click", function(){
        location.reload();
    });
    
    $("#start").on("click", function(){
        if( running == false ){
//            cvs.width = cvs.width;
//            cvs.height = cvs.height;
            ball = new Ball();
            ball.init();
            running = true;
            this.value = "stop";
//            startTimer();
        }else{
            ball.stop();
            running = false;
            this.value = "start";
//            stopTimer();
        }
    });
    
    $(document).on("keydown", function(e){
        switch(e.keyCode){
            case 38://上
                yg = -1;
                break;
            case 40://下
                yg = 1;
                break;
            case 37://左
                xg = 1;
                break;
            case 39://右
                xg = -1;
                break;
        }
    });
    
    function startTimer(){
        var $time = $("#time");
        if( start ){
            timerMarker = window.setInterval(function(){
                $time.html(timer++ < 9 ? "0" + timer : timer);
                if(timer > 99){
                    $("#start").trigger("click");
                }
            }, 100);
        }else{
            stopTimer();
        }
    }
    
    function stopTimer(){
        window.clearInterval(timerMarker);
        timerMarker = 0;
        timer = 0;
    }
})