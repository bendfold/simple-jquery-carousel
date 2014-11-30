# Simple jQuery Driven Carousel

This is just bare bones simple carousel that I have made to serve as a quick starting point for any carousels I am required to build going forwards.

## To get it working:
- Include the following scripts on the page:

		<script src="./js/vendor/jquery-1.10.2.min.js"></script>
		<script src="./js/simpleCaro.js"></script>
		
- Include the following markup on your page:
		
		div.your-class-name#orId > ul.panel-list > li.panel*4
		
- Select your element from the DOM and kick off the plugin:
	
		$( '#SimpleCaro' ).simpleCaro();

## It assumes:
- The following markup structure	

		div.your-class-name#orId > ul.panel-list > li.panel*4

	You can use whatever hook you like on the outter div, class name or ID, it doesn't matter. So long as you referrence it correctly once you fire off the plugin.
	The class names on the ``ul`` & ``li`` are referenced in the JS, so you should keep these the same. If you want to change them you can do so in the defaults section at the top of the plugin.
- Either the ``.panel`` element itself or it's contents will have a fixed width, each element should be of equal width to it's sibblings.
- Each panel should be of equal height, either by adding in block level images that have been cut to the same height. Or that the ``.panel`` element has this fixed in the CSS.
- You will set the following CSS:
		
		.viewport {
			overflow: hidden;
			position: relative;
		}
		.panel-list {
			position: absolute;
		}
	This is required to allow the animation to take place.
- You will position the prev/next controls as you require.

## It creates:
- A viewport element, currently set to be ``div.viewport``. This element should have position realtive set in the CSS.
- A set of prev / next controls.
- A set of thumbnails for navigation.

## You can:
- Pass in overides for things like class names and scroll speed either via:
	- The ``data-simple-caro='{}'`` attribute on the outter div of the carousel, like so:
			
			data-simple-caro='{"scrollSpeed" : 300}'
	
	- Passing a config object into the plugin initialisation, like so:
	
			$( '#SimpleCaro' ).simpleCaro({"scrollSpeed" : 300});
				 


 