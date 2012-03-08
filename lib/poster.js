(function() {

  (function($) {
    var Poster;
    Poster = (function() {

      Poster.prototype.defaults = {
        padding: false,
        wrapAmpersand: true,
        headerBreakpoint: null,
        viewportBreakpoint: null,
        container: false
      };

      function Poster(el, options) {
        this.el = el;
        this.options = $.extend({}, this.defaults, options);
        this.keepSpans = $("span.lettering", el).length;
        this.text = String(_.trim(el.text()));
        this.words = (this.keepSpans ? [] : this.text.split(" "));
        this.viewportWidth = $(window).width();
        this.container = this.options.container ? this.el.parents(this.options.container) : this.el;
        this.ratio = 1;
        this.resize();
        this.origFontSize = 0;
      }

      Poster.prototype.fontSize = function() {
        var dummy, height;
        dummy = $("<div style=\"font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;\">&nbsp;</div>").appendTo(this.el);
        height = dummy.height();
        dummy.remove();
        return height;
      };

      Poster.prototype.resize = function() {
        var charsPerLine, counter, diff, err, finalText, i, idealCharPerLine, limit, lineHTML, lineHeight, lineNum, lineText, lines, otherratio, padHorz, padVert, postDiff, postText, preDiff, preText, sizeAvg, sizes, text, that, threshold, tmp, wordIndex, _i, _len;
        that = this;
        this.fontSize = this.fontSize();
        padHorz = this.options.padding ? this.options.padding * 2 : parseInt(this.el.parent().css('padding-left')) + parseInt(this.el.parent().css('padding-right'));
        padVert = this.options.padding ? this.options.padding * 2 : parseInt(this.el.parent().css('padding-top')) + parseInt(this.el.parent().css('padding-bottom'));
        this.containerSize = {
          width: this.container.width() - padHorz,
          height: this.container.height() - padVert
        };
        if (!(this.containerSize.width > 0 && this.containerSize.height > 0)) {
          err = new Error("Container not initialized");
          throw err;
          return false;
        }
        if (!this.keepSpans && this.origFontSize !== this.fontSize) {
          this.origFontSize = this.fontSize;
          threshold = 0;
          i = 0;
          charsPerLine = Math.min(60, Math.floor(this.containerSize.width / (this.fontSize * this.ratio)));
          while (true) {
            this.ratio += threshold;
            charsPerLine = Math.min(60, Math.floor(this.containerSize.width / (this.fontSize * this.ratio)));
            lineHeight = (this.fontSize * this.ratio) * 2;
            lines = this.containerSize.height / lineHeight;
            diff = lines - (this.text.length / charsPerLine);
            tmp = (this.text.length / 10) + 5;
            threshold = diff / ((this.text.length / 6) + 1);
            otherratio = this.containerSize.width / (this.fontSize * charsPerLine);
            limit = 0.1;
            if (!((threshold > limit || threshold < (0 - limit)) && i < 3)) break;
            ++i;
          }
          lineText = [];
          lineHTML = [];
          wordIndex = 0;
          counter = 0;
          preText = "";
          postText = "";
          finalText = "";
          if (charsPerLine !== idealCharPerLine) {
            idealCharPerLine = charsPerLine;
            while (wordIndex < this.words.length) {
              postText = "";
              while (postText.length < idealCharPerLine) {
                preText = postText;
                postText += this.words[wordIndex] + " ";
                if (++wordIndex >= this.words.length) break;
              }
              preDiff = idealCharPerLine - preText.length;
              postDiff = postText.length - idealCharPerLine;
              if ((preDiff < postDiff) && (preText.length > 4)) {
                finalText = preText;
                wordIndex--;
              } else {
                finalText = postText;
              }
              lineText.push(_.trim(finalText));
            }
            if (finalText.length < charsPerLine / 2) {
              lineText[lineText.length - 2] += ' ' + lineText.pop();
            }
            for (_i = 0, _len = lineText.length; _i < _len; _i++) {
              text = lineText[_i];
              lineHTML.push("<span class=\"lettering\">" + (this.options.wrapAmpersand ? text.replace("&", "<span class=\"amp\">&amp;</span>") : _.trim(text)) + "</span>");
            }
            this.el.html(lineHTML.join(""));
          }
        } else {
          this.origFontSize = this.fontSize;
        }
        sizes = [];
        lineNum = this.keepSpans ? this.keepSpans : lineHTML.length;
        $("span.lettering", this.el).each(function() {
          var $span, fontSize, innerText, ratio, wordSpacing;
          $span = $(this);
          innerText = $span.text();
          wordSpacing = innerText.split(" ").length > 2;
          $span.css("word-spacing", 0).css("letter-spacing", 0).css('white-space', 'nowrap');
          ratio = that.containerSize.width / $span.width();
          fontSize = parseFloat(this.style.fontSize) || that.fontSize;
          sizes.push(fontSize * ratio);
          $span.css("font-size", Math.round(fontSize * ratio) + "px");
          diff = that.containerSize.width - $span.width();
          if (diff) {
            return $span.css((wordSpacing ? "word" : "letter") + "-spacing", (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(3) + "px");
          }
        });
        sizeAvg = _.reduce(sizes, function(memo, num) {
          return memo + num;
        });
        i = 0;
        $("span.lettering", this.el).each(function() {
          var $span;
          $span = $(this);
          lineHeight = Math.round((sizes[i] / (sizeAvg / sizes.length)) * (that.containerSize.height / lineNum));
          $span.css("line-height", lineHeight + "px");
          return i++;
        });
        return this.el.addClass("posterized");
      };

      $("#page").addClass("posterized");

      return Poster;

    })();
    return $.fn.poster = function(options) {
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data("poster");
        if (!data) el.data("poster", data = new Poster(el, options));
        if (typeof options === "string") return data[options]();
      });
    };
  })(window.Zepto || window.jQuery);

}).call(this);
