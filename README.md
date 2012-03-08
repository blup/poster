# poster

Create BIG, **BOLD** poster text with little effort. In essence, this plugin resizes text to best fit it's parent container. The algorithm will first calculate the ideal number of characters per line based on the ammount of text and the vertical space available. It will then split the text into phrases and resize them accordingly. This plugin is based on [slabText](https://github.com/freqdec/slabText), which itself is based on the [slabtype algorithm](http://erikloyer.com/index.php/blog/the_slabtype_algorithm_part_1_background/). Poster, however, takes into account the container's height.

HTML:

```html
<div id="headline">I love deadlines. I like the whooshing sound they make as they fly by. -Douglas Adams</div>
```

CSS:

```css
#headline {
  width: 400px
  height: 600px
}

```

JS:

```js
$('#headline').poster()
```

Available settings:

```js
$('#headline').poster(
    padding: false              // Force padding
    wrapAmpersand: true         // Wrap ampersand with a div
    container: false            // Force containing element
)
```
