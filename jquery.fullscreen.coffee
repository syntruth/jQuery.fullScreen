###
jQuery.fullScreen - v1.0 - 2010-09-21
 
Copyright (c) 2010 Randy Carnahan
Dual licensed under the MIT and GPL licenses.
###

methods =
  init: (options) ->
    this.each () ->
      $this   = $(this)
      ozindex = $this.css('zIndex')
      otop    = $this.offset().top
      oleft   = $this.offset().left

      oborders =
        top:    $this.css('border-top-width')
        left:   $this.css('border-left-width')
        bottom: $this.css('border-bottom-width')
        right:  $this.css('border-right-width')
      
      omargins =
        top:    $this.css('margin-top')
        left:   $this.css('margin-left')
        bottom: $this.css('margin-bottom')
        right:  $this.css('margin-right')

      owidth            = $this.width()
      oheight           = $this.height()
      afterMaximizeAnim = $.noop
      afterRestoreAnim  = $.noop
      afterMaximize     = $.noop
      afterRestore      = $.noop

      if typeof options is 'object'
        if $.isFunction options.afterMaximizeAnim
          afterMaxAnim = options.afterMaximizeAnim

        if $.isFunction options.afterRestoreAnim
          afterRestoreAnim = options.afterRestoreAnim

        if $.isFunction options.afterMaximize
          afterMax = options.afterMaximize

        if $.isFunction options.afterRestore
          afterRestore = options.afterRestore

      data =
        expanded:          false
        otop:              otop
        oleft:             oleft
        owidth:            owidth
        oheight:           oheight
        oborders:          oborders
        omargins:          omargins
        ozindex:           ozindex
        afterMaximizeAnim: afterMaximizeAnim
        afterRestoreAnim:  afterRestoreAnim
        afterMaximize:     afterMaximize
        afterRestore:      afterRestore

      $this.data 'fullScreen', data

  maximize: (options) ->
    this.each () ->
      $this = $(this)
      data  = $this.data 'fullScreen'

      unless data.expanded
        $('body').css overflow: 'hidden'

        $this.css
          position:   'absolute'
          top:         data.otop
          left:        data.oleft
          margin:      0
          borderWidth: 0
          zIndex:      500

        animProperties =
          top:    0
          left:   0
          width:  $(window).width()
          height: $(window).height()

        $this.animate animProperties, complete: data.afterMaximizeAnim

        data.afterMaximize $this

        $('document').scrollTo 0, {duration: 1000, queue: true}

        data.expanded = true

        $this.data 'fullScreen', data

  restore: () ->
    $this = $(this)
    data  = $this.data 'fullScreen'

    if data.expanded
      otop      = data.otop
      oleft     = data.oleft
      ozindex   = data.ozindex
      owidth    = data.owidth
      oheight   = data.oheight
      omargins  = data.omargins
      oborders  = data.oborders
      winheight = $(window).height()

      if otop > winheight or (oheight + otop) > winheight
        $(window).scrollTo $this, {duration: 1000, queue: true}

      $this.data 'expanded', false

      animProperties =
        top:    otop
        left:   oleft
        width:  owidth
        height: oheight

      $this.animate animProperties,
        complete: () =>
          data.afterRestoreAnim $this

          $this.css
            position:          'relative'
            top:               0
            left:              0
            marginTop:         omargins.top
            marginLeft:        omargins.left
            marginBottom:      omargins.bottom
            marginRight:       omargins.right
            borderTopWidth:    oborders.top
            borderLeftWidth:   oborders.left
            borderBottomWidth: oborders.bottom
            borderRightWidth:  oborders.right
            zIndex:            ozindex

      data.afterRestore $this

      $('body').css overflow: 'auto'

      data.expanded = false

      $this.data 'fullScreen', data

jQuery.fn.fullScreen = (method) ->
  if methods[method]
    args = Array.prototype.slice.call arguments, 1
    return methods[method].apply this, args

  else if typeof method is 'object' or not method
    return methods.init.apply this, arguments

  else
    $.error "Method #{method} does not exist in jQuery.fullScreen"
