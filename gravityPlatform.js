/**
 * @fileOverview: 重力平台demo
 * @email: tiantian5@leju.com
 * @date: 2014-12-08
 */
define(function (require, exports) {
    var $ = require("zepto");
    var xg = yg = 0;
    var running = false;
    var timer = 0;
    var timerMarker = 0;
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext('2d');
    var imageData = null;
    var pixels = null;
    var gravThreshold = 0.5; //重力感应阀值
    
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
            this.timer = window.setInterval(function(){that.move();}, 50);
        },
        canMove: function( fromPos, toPos ){
            if( fromPos.x == toPos.x ){
                for( var i = 0; i < 20; i++ ){
                    var pos = (fromPos.y + i) * cvsWidth + fromPos.x;
                    if( pixels[ pos * 4 ] == 51 ){
                        return false;
                    }
                }
            }else if( fromPos.y == toPos.y ){
                for( var i = 0; i < 20; i++ ){
                    var pos = fromPos.y * cvsWidth + fromPos.x + i;
                    if( pixels[ pos * 4 ] == 51 ){
                        return false;
                    }
                }
            }
            return true;
        },
        move: function(){
            this.clearMyself();
            var wallPos1 = {x: 0, y: 0 };
            var wallPos2 = {x: 0, y: 0 };
            
            if( xg > 0 ){ // W
                wallPos1.x = wallPos2.x = this.x - 1;
                wallPos1.y = this.y;
                wallPos2.y = this.y + 19;
            }else if( xg < 0 ){ // E
                wallPos1.x = wallPos2.x = this.x + 20;
                wallPos1.y = this.y;
                wallPos2.y = this.y + 19;
            }else{  // xg == 0
                if( yg < 0 ){ // N
                    wallPos1.x = this.x;
                    wallPos2.x = this.x + 19;
                    wallPos1.y = wallPos2.y = this.y - 1;
                }else if( yg > 0 ){ // S
                    wallPos1.x = this.x;
                    wallPos2.x = this.x + 19;
                    wallPos1.y = wallPos2.y = this.y + 20;
                }else{ // C
                    wallPos1.x = wallPos2.x = this.x + 10;
                    wallPos1.y = wallPos2.y = this.y + 10;
                }
            }
            
            if( this.canMove( wallPos1, wallPos2 ) ){
                Math.abs(xg) > Math.abs(yg) ? this.x += xg * (-1) : this.y += yg;
            }
            
            if( this.x > 299 && this.y >299 ){
                this.drawHole();
            }
            this.draw();
            if( this.x > 308 && this.y > 308 ){
                $("#start").trigger("click");
                alert("win");
            }
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
    
    if(window.DeviceMotionEvent && window.navigator.userAgent.toLowerCase().indexOf('mobile') != -1) { 
        window.addEventListener('devicemotion', deviceMotionHandler, false);

        function deviceMotionHandler(event){
            var accGravity = event.accelerationIncludingGravity;
            
            if( Math.abs(accGravity.x) > Math.abs(accGravity.y) ){
                xg = accGravity.x > gravThreshold ? 1 : accGravity.x < (-1 * gravThreshold) ? -1 : 0;
                yg = 0;
            }else{
                xg = 0;
                yg = accGravity.y > gravThreshold ? 1 : accGravity.y < (-1 * gravThreshold) ? -1 : 0;
            }
        }
    }
    
    $("#reload").on("click", function(){
        location.reload();
    });
    
    $("#start").on("click", function(){
        if( running == false ){
            ball = new Ball();
            ball.init();
            running = true;
            this.value = "stop";
            startTimer();
        }else{
            ball.stop();
            running = false;
            this.value = "start";
            stopTimer();
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