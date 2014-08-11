(function (window, document, FT, undefined) {
    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    FT = FT || {};

    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    FT._ads = FT._ads || {};

    /**
     * @namespace All public functions are stored in the FT._ads.utils object for global access.
     */
    FT._ads.utils = FT._ads.utils || {};

    function now() {
        return (new Date()).valueOf();
    }

    function Timer(interval, fn, maxTicks, opts) {
        this.interval = (parseFloat(interval) || 1)  * 1000;
        this.maxTicks = parseInt(maxTicks, 10) || 0;
        this.fn = fn;
        this.ticks = 0;
        this.opts = opts || {};
        this.start();
        return this;
    }

    Timer.prototype.tick = function() {
        var Timer = this;
        return function () {
            Timer.ticks++;
            Timer.fn.apply(Timer);
            Timer.lastTick = now();

            if (Timer.ticks === Timer.maxTicks) {
                Timer.stop();
            }
        };
    };

    Timer.prototype.start = function(){
        this.startTime = this.lastTick = now();
        this.id = setInterval(this.tick(), this.interval);
        return true;
    };

    Timer.prototype.resume = function(){
        if (this.timeLeft){
            this.id = setInterval(this.tick(), this.timeLeft);
            delete this.timeLeft;
            return true;
        }
        return false;
    };

    Timer.prototype.pause = function(){
        if (this.id){
            this.timeLeft = (this.interval) - (now() - this.lastTick);
            this.kill();
            return true;
        }
        return false;
    };

    Timer.prototype.rebase = function() {
        if (!!this.startTime) {
            this.startTime = now();
            return true;
        } else{
            return false;
        }
    };

    Timer.prototype.kill = function(){
        if (this.id) {
            clearInterval(this.id);
            delete this.id;
            return true;
        }
        return false;
    };

    Timer.prototype.stop = function(){
        if (this.id || this.timeLeft){
            this.ticks = 0;
            this.kill();
            delete this.timeLeft;
            return true;
        }
        return false;
    };

    function Timers() {
        var scope =  this;
        this.timers = [];

        function all(method) {
            return function () {
                var timer, i = scope.timers.length - 1;

                while (timer = scope.timers[i]) {
                    timer[method]();
                    i--;
                }
            };
        }

        function hasExecutionPaused(fn){
            return function () {
                var Timer = this,
                    rebase = Timer.opts.rebase || false,
                    reset = Timer.opts.reset || false,
                    time = now() - Timer.lastTick - Timer.interval,
                    threshhold = Timer.interval * 2;

                if ( threshhold < time) {
                    console.warn('paused', now());
                    if (rebase ){
                        Timer.rebase();
                    }
                }

                fn.apply(Timer);
            };
        }

        function create(interval, fn, maxTicks, opts) {
            if( (opts && opts.rebase) || (opts && opts.reset) ){
                fn = hasExecutionPaused(fn);
            }

            timer  = new Timer(interval, fn, maxTicks, opts);
            scope.timers.push(timer);
            return timer;
        }

        return {
            create: create,
            resumeall: all('resume'),
            pauseall: all('pause'),
            stopall: all('stop')
        };
    }

    FT._ads.utils.timers = new Timers();
})(window, document, FT);
