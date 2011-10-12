;(function($, window){
    $.fn.carousel = function(options){
        return this.each(function() {
            new Carousel(this, options);
        });
    };

    var Carousel = function(carouselSelector, options) {
        this.settings = $.extend({
            prev          : '.carousel__control_action_prev',
            next          : '.carousel__control_action_next',
            disabledClass : 'carousel__control_state_disabled',
            activeClass   : 'carousel__control_state_active',
            useEvents     : false,
            orientation   : 'horizontal' //there should be a better way, maybe detect css
                                         //or use a data-attribute
        }, options);

        this.$carousel = $(carouselSelector);
        this.controls = {
            $prev : $(this.settings.prev),
            $next : $(this.settings.next)
        };

        if ( this.settings.orientation == 'horizontal' ) {
            this.scrollProperty   =  'scrollWidth';
            this.dimension        =  'width';
            this.animatedProperty =  'scrollLeft';
        } else {
            this.scrollProperty   =  'scrollHeight';
            this.dimension        =  'height';
            this.animatedProperty =  'scrollTop';
        }

        this.init();
    };

    Carousel.prototype = {
        //some defaults
        velocity          : 0,
        direction         : 0,
        lastStep          : false,
        lastScroll        : 0,
        scrollAccumulator : null,
        init : function() {
            this.bindEvents();
            this.hidder();
            this.disabler();
        },
        hidder : function() {
            var scrollProp = this.$carousel.prop(this.scrollProperty);
            var dimension = this.$carousel[this.dimension]();

            if (scrollProp > dimension) {
                //we don't actually need carousel for now
                if (this.settings.useEvents) {
                    this.controls.$prev.triggerHandler('carousel.show');
                    this.controls.$next.triggerHandler('carousel.show');
                } else {
                    this.controls.$prev.removeClass(this.settings.disabledClass);
                    this.controls.$next.removeClass(this.settings.disabledClass);
                }
            } else {
                if (this.settings.useEvents) {
                    this.controls.$prev.triggerHandler('carousel.hide');
                    this.controls.$next.triggerHandler('carousel.hide');
                } else {
                    this.controls.$prev.addClass(this.settings.disabledClass);
                    this.controls.$next.addClass(this.settings.disabledClass);
                }
            }
        },
        disabler: function() {
            var scrollProp = this.$carousel.prop(this.scrollProperty),
                dimension = this.$carousel[this.dimension](),
                animatedProperty= this.$carousel[this.animatedProperty]();
           
            if (animatedProperty<= 0) {
                if (this.settings.useEvents) {
                    this.controls.$prev.triggerHandler('carousel.disable');
                } else {
                    this.controls.$prev.addClass(this.settings.disabledClass);
                }
            } else {
                if (this.settings.useEvents) {
                    this.controls.$prev.triggerHandler('carousel.enable');
                } else {
                    this.controls.$prev.removeClass(this.settings.disabledClass);
                }
            }
           
            if (animatedProperty + dimension >= scrollProp) {
                if (this.settings.useEvents) {
                    this.controls.$next.triggerHandler('carousel.disable');
                } else {
                    this.controls.$next.addClass(this.settings.disabledClass);
                }
            } else {
                if (this.settings.useEvents) {
                    this.controls.$next.triggerHandler('carousel.enable');
                } else {
                    this.controls.$next.removeClass(this.settings.disabledClass);
                }
            }
           
            
            return (animatedProperty<= 0) || (animatedProperty+ dimension >= scrollProp);
        },
        step: function() {
            var now = (new Date).getTime(),
                self = this;
           
            if (this.lastStep) {
                if (Math.abs(this.direction)) {         
                    this.velocity += this.direction * 1000 * (now - this.lastStep) / 1000;
                    if (Math.abs(this.velocity) > 800) {
                        this.velocity = this.direction * 800;
                    }
                } else {
                    this.velocity -= this.velocity / Math.abs(this.velocity) * 3000 * (now - this.lastStep) / 1000;

                }
                this.scrollAccumulator += this.$carousel[this.animatedProperty]() - this.lastScroll + this.velocity * (now - this.lastStep) / 1000;
                this.$carousel[this.animatedProperty](this.scrollAccumulator);
            } else {
                this.velocity = this.direction * 30;

                this.scrollAccumulator = this.$carousel[this.animatedProperty]();
            }
           
            this.disabler();
           

            if (Math.abs(this.velocity) < 50 && this.direction == 0) {
                this.velocity = 0;
                this.lastStep = false;
            } else {
                window.setTimeout(function() {
                    self.step();
                }, 10);

                this.lastStep = (new Date).getTime();
                this.lastScroll = this.$carousel[this.animatedProperty]();
            }
        },
        bindEvents: function() {
            var start = false,
                self  = this;

            self.controls.$prev.mousedown(function(){
                self.controls.$prev.addClass(self.settings.activeClass);
                start = (new Date).getTime();
                self.direction = -1;
                if ( ! self.lastStep){
                    self.step();
                }
                return false;
            }).click(function(){
                var now = (new Date).getTime();
                if (now - start < 200) {
                    self.velocity = -800;
                }
                return false;
            });
           
            self.controls.$next.mousedown(function(){
                self.controls.$next.addClass(self.settings.activeClass);
                start = (new Date).getTime();
                self.direction = 1;
                if ( ! self.lastStep){
                    self.step();
                }
                return false;
            }).click(function(){
                var now = (new Date).getTime();
                if (now - start < 200) {
                    self.velocity = 800;
                }
                return false;
            });
           
            $(document).bind('mouseup mouseleave', function(){
                self.direction = 0;
                self.controls.$next.removeClass(self.settings.activeClass);
                self.controls.$prev.removeClass(self.settings.activeClass);
            });
           
            self.$carousel.bind('carousel.fix', function(){
                //so we can trigger event outside
                self.hidder();
                self.disabler();
            });
           
            $(window).resize(function(){
                //just in case we have a horizontal fluid-width carousel
                self.hidder();
                self.disabler();
            });
        }
    }

})(jQuery, window)
