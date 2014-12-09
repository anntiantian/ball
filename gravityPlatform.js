/**
 * @fileOverview: 重力平台demo
 * @email: tiantian5@leju.com
 * @date: 2014-12-08
 */
define(function (require, exports) {
    var $ = require("zepto");
    var xg = yg = zg = 0;
    var running = false;
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext('2d');
    var img = document.createElement("img");
    img.src = "./ball.png";
    img.onload = function(){
        $("#start").removeAttr("disabled");
    }
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
    }

    Ball.prototype = { 
        init: function(){
            var that = this;
            ctx.drawImage( img, this.x, this.y );
            this.timer = window.setInterval(function(){that.move();}, 25);
        },
        move: function(){
            var x = this.x + xg * (-1); //x轴重力加速度于x轴相反
            var y = (this.y + yg);
            this.x = Math.max( Math.min( x, maxX ), minX );
            this.y = Math.max( Math.min( y, maxY ), minY );
            this.draw();
        },
        stop: function(){
            window.clearInterval( this.timer );
        },
        draw: function(){
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage( img, this.x, this.y );
        }
    }
    
    if(window.DeviceMotionEvent) { 
//        var x = y = z = lastX = lastY = lastZ = 0;//重置所有数值 
        window.addEventListener('devicemotion', deviceMotionHandler, false);

        function deviceMotionHandler(event){
            var accGravity = event.accelerationIncludingGravity;
            document.getElementById("xg").innerHTML = Math.round(accGravity.x * 100) / 100;
            document.getElementById("yg").innerHTML = Math.round(accGravity.y * 100) / 100;
            document.getElementById("zg").innerHTML = Math.round(accGravity.z * 100) / 100;
            
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
            ball = new Ball();
            ball.init();
            running = true;
            this.value = "stop";
        }else{
            ball.stop();
            running = false;
            this.value = "start";
        }
    });
    
    $("#test").on("click", function(){
        ball = new Ball();
        ball.init();
    })
})