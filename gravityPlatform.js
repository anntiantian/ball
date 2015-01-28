/**
 * @fileOverview: 重力平台demo
 * @email: tiantian5@leju.com
 * @date: 2014-12-08
 */
define(function (require, exports) {
    var $ = require("zepto");
    var xg = 0;
    var yg = 0;
    var running = false;
    var timer = 0;
    var timerMarker = 0;
    var cvs = document.getElementById("canvas");
    var cxt = cvs.getContext('2d');
    var imageData = null;
    var pixels = null;
    var gravThreshold = 0.5; //重力感应阀值
    var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isMobile = window.navigator.userAgent.toLowerCase().indexOf('mobile') != -1 ? true : false;

    var cvsWidth = cvs.width;
    var ball = null;
    
    function Ball(){
        this.l = 18; // 直径 
        this.r = this.l / 2; // 半径
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
            imageData = cxt.getImageData(0, 0, cvs.width, cvs.height);
            pixels = imageData.data;
    
            this.createHole();
            
            this.draw();
            this.timer = window.setInterval(function(){that.move();}, 50);
        },
        canMove: function( p1, p2 ){
            for( var j = p1.y; j < p2.y; j++ ){
                for( var i = p1.x; i < p2.x; i++ ){
                    var pos = j * cvsWidth + i;
                    if( pixels[ pos * 4 ] == 51 ){
                        return false;
                    }
                }
            }
            // debug
//            pixels[(p1.y * cvsWidth + p1.x)*4] = 255; // Red
//            pixels[(p1.y * cvsWidth + p1.x)*4 + 1] = 0; // Red
//            pixels[(p1.y * cvsWidth + p1.x)*4 + 2] = 0; // Red
//            pixels[(p2.y * cvsWidth + p2.x)*4] = 0; // Blue
//            pixels[(p2.y * cvsWidth + p2.x)*4 + 1] = 0; // Blue
//            pixels[(p2.y * cvsWidth + p2.x)*4 + 2] = 255; // Blue
//            cxt.putImageData(imageData, 0, 0);
            return true;
        },
        move: function(){
            
            var wallPos1 = {x: this.x, y: this.y };
            var wallPos2 = {x: this.x, y: this.y };
            var direction = null;
            if( xg > 0 ){ // W
                direction = "W";
            }else if( xg < 0 ){ // E
                direction = "E";
            }else{  // xg == 0
                if( yg < 0 ){ // N
                    direction = "N";
                }else if( yg > 0 ){ // S
                    direction = "S";
                }                
            }
            switch (direction){
                case "W":
                    wallPos1.x = this.x - xg - 1;// - xg 
                    wallPos1.y = this.y;
                                        
                    wallPos2.x = this.x - 1;
                    wallPos2.y = this.y + this.l;
                    for( var j = wallPos1.y; j < wallPos2.y; j++ ){
                        for( var i = wallPos2.x; i > wallPos1.x; i-- ){
                            var pos = j * cvsWidth + i;
                            if( pixels[ pos * 4 ] == 51 ){
                                xg = (i - this.x + 1) * -1;
                                flag = 1;
                                break;
                            }
                        }
                        if( flag === 1 ){
                            break;
                        }
                    }
                    $("#time").html("W");
                    break;
                case "E":
                    wallPos1.x = this.x + this.l - 1;
                    wallPos1.y = this.y;
                    
                    wallPos2.x = this.x + this.l - xg;
                    wallPos2.y = this.y + this.l;
                    
                    for( var j = wallPos1.y; j < wallPos2.y; j++ ){
                        for( var i = wallPos1.x; i < wallPos2.x; i++ ){
                            var pos = j * cvsWidth + i;
                            if( pixels[ pos * 4 ] == 51 ){
                                xg = (i - this.x - this.l) *-1;
                                flag = 1;
                                break;
                            }
                        }
                        if( flag === 1 ){
                            break;
                        }
                    }
                    $("#time").html("E");
                    break;
                case "N":
                    wallPos1.x = this.x;
                    wallPos1.y = this.y - 1 + yg;
                    
                    wallPos2.x = this.x + this.l;
                    wallPos2.y = this.y - 1;
                    
                    for( var j = wallPos2.y; j > wallPos1.y; j-- ){
                        for( var i = wallPos1.x; i < wallPos2.x; i++ ){
                            var pos = j * cvsWidth + i;
                            if( pixels[ pos * 4 ] == 51 ){
                                yg = (j - this.y + 1);
                                flag = 1;
                                break;
                            }
                        }
                        if( flag === 1 ){
                            break;
                        }
                    }
                    $("#time").html("N");
                    break;
                case "S":
                    wallPos1.x = this.x;
                    wallPos1.y = this.y + this.l;
                    
                    wallPos2.x = this.x + this.l;
                    wallPos2.y = this.y + this.l + yg;
                    
                    for( var j = wallPos1.y; j < wallPos2.y; j++ ){
                        for( var i = wallPos1.x; i < wallPos2.x; i++ ){
                            var pos = j * cvsWidth + i;
                            if( pixels[ pos * 4 ] == 51 ){
                                yg = (j - this.y - this.l);
                                flag = 1;
                                break;
                            }
                        }
                        if( flag === 1 ){
                            break;
                        }
                    }
                    $("#time").html("S");
                    break;
            }
            this.clearMyself();
                
            Math.abs(xg) > Math.abs(yg) ? this.x += xg * (-1) : this.y += yg;
            
            if( this.x > 299 && this.y >299 ){
                this.drawHole();
            }
            this.draw();
            if( this.x > 318 && this.y > 318 ){
                $("#start").trigger("click");
                alert("win");
                ball = null;
                xg = yg = 0;
            }
        },
        clearMyself: function(){
            cxt.fillStyle = "#eeeeee";
            cxt.fillRect(this.x, this.y, this.l, this.l);
        },
        stop: function(){
            window.clearInterval( this.timer );
        },
        draw: function(){
            var grd = cxt.createRadialGradient(this.x + this.r/2, this.y + this.r/2, 0, this.x + this.r, this.y + this.r, this.r);
            grd.addColorStop(0.1, 'rgb(187,187,187)');  
            grd.addColorStop(1, 'rgb(0,0,0)');

            cxt.fillStyle = grd;
            cxt.beginPath();
            cxt.arc(this.x + this.r, this.y + this.r, this.r, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
        },
        createHole: function(){
            this.drawHole();
        },
        drawHole: function(){
            cxt.fillStyle="#FF0000";
            cxt.beginPath();
            cxt.arc(this.hole.x,this.hole.y,10,0,Math.PI*2,true);
            cxt.closePath();
            cxt.fill();
        }
    }
    
    if( isMobile && window.DeviceMotionEvent ) { 
        window.addEventListener('devicemotion', deviceMotionHandler, false);

        function deviceMotionHandler(event){
            var accGravity = event.accelerationIncludingGravity;
            if( Math.abs(accGravity.x) > Math.abs(accGravity.y) ){
                xg = Math.round( accGravity.x );
                isIOS && (xg *= -1);
                yg = 0;
            }else{
                xg = 0;
                yg = Math.round( accGravity.y );
                isIOS && (yg *= -1);
            }
            
        }
    }
    
    $("#reload").on("click", function(){
        location.reload();
    });
    
    $("#start").on("click", function(){
        if( running == false ){
            if( !ball ){
                ball = new Ball();
                ball.init();
            }else{
                ball.move();
            }
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
                yg--;
//                yg = -1;
                xg = 0;
                break;
            case 40://下
                yg++;
//                yg = 1;
                xg = 0;
                break;
            case 37://左
                xg++;
//                xg = 1;
                yg = 0;
                break;
            case 39://右
                xg--;
//                xg = -1;
                yg = 0;
                break;
        }
    });
    
    function startTimer(){
        var $time = $("#time");
        if( start ){
//            timerMarker = window.setInterval(function(){
//                $time.html(timer++ < 9 ? "0" + timer : timer);
//            }, 100);
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