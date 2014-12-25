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
    var img = document.createElement("img");
    img.onload = function(){
        $("#start").removeAttr("disabled");
    };
    img.src = "./ball.png";
    var minX = 0;
    var minY = 0;
    var maxX = cvs.width - 20;
    var maxY = cvs.height - 20;
    
    var ball = null;
    
    function Ball(){
        this.w = 10; // weight
        this.x = 0;  // location x
        this.y = 0;  // location y
        this.vx = 0;  // velocity x
        this.vy = 0;  // velocity y
        this.timer = null;
        this.hole = {x: 0, y: 0};
    }

    Ball.prototype = { 
        init: function(){
            var that = this;
            this.createHole();
            ctx.drawImage( img, this.x, this.y );
            this.timer = window.setInterval(function(){that.move();}, 25);
        },
        move: function(){
            this.clearMyself();
            var x = this.x + xg * (-1); //x轴重力加速度于x轴相反
            var y = (this.y + yg);
            this.x = Math.max( Math.min( x, maxX ), minX );
            this.y = Math.max( Math.min( y, maxY ), minY );
            if( this.x > this.hole.x - 20 && this.x < this.hole.x 
                && this.y > this.hole.y - 20 && this.y < this.hole.y ){
                $("#start").trigger("click");
            }
            this.drawHole();
            this.draw();
            
        },
        clearMyself: function(){
            ctx.fillStyle = "#FFFFFF";//使用颜色值为白色，透明为0的颜色填充
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 10, 11, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        },
        stop: function(){
            window.clearInterval( this.timer );
        },
        draw: function(){
            ctx.drawImage( img, this.x, this.y );
        },
        createHole: function(){
            this.hole.x = parseInt(Math.random()*(maxX - minX + 1) + minX+10); 
            this.hole.y = parseInt(Math.random()*(maxY - minY + 1) + minY+10); 
            this.drawHole();
        },
        drawHole: function(){
            ctx.fillStyle="#FF0000";
            ctx.beginPath();
            ctx.arc(this.hole.x,this.hole.y,20,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    if(window.DeviceMotionEvent) { 
//        var x = y = z = lastX = lastY = lastZ = 0;//重置所有数值 
        window.addEventListener('devicemotion', deviceMotionHandler, false);

        function deviceMotionHandler(event){
            var accGravity = event.accelerationIncludingGravity;
//            document.getElementById("xg").innerHTML = Math.round(accGravity.x * 100) / 100;
//            document.getElementById("yg").innerHTML = Math.round(accGravity.y * 100) / 100;
//            document.getElementById("zg").innerHTML = Math.round(accGravity.z * 100) / 100;
            
            xg = Math.round(accGravity.x);
            yg = Math.round(accGravity.y);
            zg = Math.round(accGravity.z);
            
//            lastXg = xg;
//            lastYg = yg;
//            lastZg = zg;
        }
    }
    
    $("#start").on("click", function(){
        if( running == false ){
            cvs.width = cvs.width;
            cvs.height = cvs.height;
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
    
    $("#test").on("click", function(){
        ball = new Ball();
        ball.init();
        running = true;
        window.setInterval(function(){
            xg = Math.random() * -10;
            yg = Math.random() * 10;
        }, 25);
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