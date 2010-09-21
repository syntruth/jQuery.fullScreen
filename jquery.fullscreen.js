/*
 * jQuery.fullScreen - v1.0b - 2010-09-21
 *
 * Copyright (c) 2010 Randy Carnahan
 * Dual licensed under the MIT and GPL licenses.
 */
(function( $ ){

  var methods = {

    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data('fullscreen');

        // Default z-index will be 500.
        var zindex = 500;

        // Default animation, maximize, and restore
        // completion methods.
        var after_max_anim     = $.noop;
        var after_restore_anim = $.noop;
        var after_max          = $.noop;
        var after_restore      = $.noop;

        if (typeof options === 'object') {
          if (options['afterMaximizeAnimation']) {
            after_max_anim = options['afterMaximizeAnimation'];
          }

          if (options['afterRestoreAnimation']) {
            after_restore_anim = options['afterRestoreAnimation'];
          }

          if (options['afterMaximize']) {
            after_max = options['afterMaximize'];
          }

          if (options['afterRestore']) {
            after_restore = options['afterRestore'];
          }

          if (options['zIndex']) {
            zindex = options['zIndex'];
          }
        }

        var otop  = $this.offset().top;
        var oleft = $this.offset().left;

        if ($.browser.msie) {
          var owidth  = $this.outerWidth();
          var oheight = $this.outerHeight();
        }
        else {
          var owidth  = $this.width();
          var oheight = $this.height();
        }

        var oborders = {
          top   : $this.css("border-top-width"),
          left  : $this.css("border-left-width"),
          bottom: $this.css("border-bottom-width"),
          right : $this.css("border-right-width")
        };

        var omargins = {
          top   : $this.css("margin-top"),
          left  : $this.css("margin-left"),
          bottom: $this.css("margin-bottom"),
          right : $this.css("margin-right")
        }

        if (!data) {
          $this.data('fullscreen', {
            'expanded'        : false,
            'target'          : target,
            'otop'            : otop,
            'oleft'           : oleft,
            'owidth'          : owidth,
            'oheight'         : oheight,
            'oborders'        : oborders,
            'omargins'        : omargins,
            'zindex'          : zindex,
            'aftermaxanim'    : after_max_anim,
            'afterrestoreanim': after_restore_anim,
            'aftermax'        : after_max,
            'afterrestore'    : after_restore
          });
        }
      });

    // End init
    },

    maximize: function(options) {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data('fullscreen');

        if (data.expanded == false) {

          $('body').css({overflow: "hidden"});

          $this.css({
            position   : 'absolute',
            top        : data.otop,
            left       : data.oleft,
            margin     : 0,
            borderWidth: 0,
            zIndex     : data.zindex
          })
          .animate({
            top   : 0,
            left  : 0,
            width : $(window).width(),
            height: $(window).height()
          }, {
            complete: data.aftermaxanim
          });

          data.aftermax($this);

          $(document).scrollTo(0, {
            duration: 1000,
            queue:    true
          })

          data['expanded'] = true;
          $this.data('fullscreen', data);
        }    
      });
    // End maximize
    },

    restore: function() {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data('fullscreen');

        if (data.expanded == true) {

          var otop     = data.otop;
          var oleft    = data.oleft;
          var owidth   = data.owidth;
          var oheight  = data.oheight;
          var omargins = data.omargins;
          var oborders = data.oborders;

          var winheight = $(window).height();

          if (otop > winheight || (oheight + otop) > winheight) {
            $(window).scrollTo($this, {
              duration: 1000,
              queue:    true
            });
          }

          $this.data('expanded', false)
          .animate({
            top   : data.otop,
            left  : data.oleft,
            width : data.owidth, 
            height: data.oheight
          }, {
            complete: function() {

              data.afterrestoreanim($this);       

              $this.css({
                position         : 'relative', 
                top              : 0,
                left             : 0,
                marginTop        : data.omargins.top,
                marginLeft       : data.omargins.left,
                marginBottom     : data.omargins.bottom,
                marginRight      : data.omargins.right,
                borderTopWidth   : data.oborders.top,
                borderLeftWidth  : data.oborders.left,
                borderBottomWidth: data.oborders.bottom,
                borderRightWidth : data.oborders.right,
                zIndex           : 1
              });  
            }
          })

          data.afterrestore($this);
          
          $('body').css({overflow: "auto"});

          data['expanded'] = true;
          $this.data('fullscreen', data);
        }
      });
    // End restore
    }
  };

  jQuery.fn.fullScreen = function(options) {

    if (methods[method]) {
      return methods[method].apply(this, 
        Array.prototype.slice.call(arguments, 1)
      );
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.fullScreen');
    }

  };

})( jQuery );

