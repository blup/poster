#--------
# poster
#--------

(($) ->
  class Poster
    defaults:
      padding: false
      wrapAmpersand: true
      headerBreakpoint: null
      viewportBreakpoint: null
      container: false

    constructor: (el, options) ->
      @el = el
      @options = $.extend({}, @defaults, options)
      @keepSpans = $("span.lettering", el).length
      @text = String(_.trim(el.text()))
      @words = (if @keepSpans then [] else @text.split(" "))
      @viewportWidth = $(window).width()
      @container = if @options.container then @el.parents(@options.container) else @el
      @ratio = 1
      @resize()
      @origFontSize = 0

    fontSize: ->
      dummy = $("<div style=\"font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;\">&nbsp;</div>").appendTo(@el)
      height = dummy.height()
      dummy.remove()
      height

    resize: ->
      that = @
      @fontSize = @fontSize()
      padHorz = if @options.padding then @options.padding * 2 else (parseInt(@el.parent().css('padding-left')) + parseInt(@el.parent().css('padding-right')))
      padVert = if @options.padding then @options.padding * 2 else (parseInt(@el.parent().css('padding-top')) + parseInt(@el.parent().css('padding-bottom')))
      @containerSize =
        width: @container.width() - padHorz
        height: @container.height() - padVert
      unless @containerSize.width > 0 and @containerSize.height > 0
        err = new Error("Container not initialized")
        throw err
        return false
      if not @keepSpans and @origFontSize isnt @fontSize
        @origFontSize = @fontSize
        threshold = 0
        i = 0
        charsPerLine = Math.min(60, Math.floor(@containerSize.width / (@fontSize * @ratio)))
        loop
          @ratio += threshold
          charsPerLine = Math.min(60, Math.floor(@containerSize.width / (@fontSize * @ratio)))
          lineHeight = (@fontSize * @ratio) * 2
          lines = @containerSize.height / lineHeight
          diff = lines - (@text.length / charsPerLine)
          tmp = ((@text.length / 10) + 5)
          threshold = diff / ((@text.length / 6) + 1)
          otherratio = @containerSize.width / (@fontSize * charsPerLine)
          limit = 0.1
          break unless (threshold > limit or threshold < (0 - limit)) and i < 3
          ++i

        lineText = []
        lineHTML = []
        wordIndex = 0
        counter =  0
        preText = ""
        postText = ""
        finalText = ""

        unless charsPerLine is idealCharPerLine
          idealCharPerLine = charsPerLine
          while wordIndex < @words.length
            postText = ""
            while postText.length < idealCharPerLine
              preText = postText
              postText += @words[wordIndex] + " "
              break  if ++wordIndex >= @words.length
            preDiff = idealCharPerLine - preText.length
            postDiff = postText.length - idealCharPerLine
            if (preDiff < postDiff) and (preText.length > 4)
              finalText = preText
              wordIndex--
            else
              finalText = postText
            lineText.push _.trim(finalText)
          if finalText.length < charsPerLine / 2
            lineText[lineText.length - 2] += ' ' + lineText.pop()
          for text in lineText
            lineHTML.push "<span class=\"lettering\">" + (if @options.wrapAmpersand then text.replace("&", "<span class=\"amp\">&amp;</span>") else _.trim(text)) + "</span>"
          @el.html lineHTML.join("")
      else
        @origFontSize = @fontSize
      sizes = []
      lineNum = if @keepSpans then @keepSpans else lineHTML.length
      $("span.lettering", @el).each ->
        $span = $(@)
        innerText = $span.text()
        wordSpacing = innerText.split(" ").length > 2
        $span.css("word-spacing", 0).css("letter-spacing", 0).css('white-space', 'nowrap')
        ratio = that.containerSize.width / $span.width()
        fontSize = parseFloat(@style.fontSize) or that.fontSize
        sizes.push(fontSize * ratio)
        $span.css "font-size", Math.round(fontSize * ratio) + "px"
        diff = that.containerSize.width - $span.width()
        $span.css (if wordSpacing then "word" else "letter") + "-spacing", (diff / (if wordSpacing then innerText.split(" ").length - 1 else innerText.length)).toFixed(3) + "px"  if diff
      sizeAvg = _.reduce(sizes, (memo, num) -> memo + num)
      i = 0
      $("span.lettering", @el).each ->
        $span = $(@)
        lineHeight = Math.round((sizes[i] / (sizeAvg / sizes.length)) * (that.containerSize.height / lineNum))
        $span.css "line-height", lineHeight + "px"
        i++

      @el.addClass "posterized"
    $("#page").addClass "posterized"


  $.fn.poster = (options) ->
    @each ->
      el = $(this)
      data = el.data("poster")
      unless data
        el.data "poster", data = new Poster(el, options)
      data[options]() if typeof options is "string"

) window.Zepto || window.jQuery
