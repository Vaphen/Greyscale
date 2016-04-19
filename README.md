# Greyscale

Greyscale is a simple, leightweight JQuery compatible Javascript library, that supports animated (faded) greyscaling of images.
Feel free to us it the way you like on your own Webpage.

##Usage

Following is an example of the usage of the greyscale library:
```Javascript
  $(document).ready(function() {
	  $(".greyscale").hover(function() {
	    $(this).greyscaleOff(200);
	  }, function() {
	    $(this).greyscaleOn(200);
	  });
	});
```

It provides 3 simple JQuery-compatible functions:
```Javascript
  // animate the element with id 'myImage' to 50% greyscale over 500 ms.
  $("#myImage").greyscale(50, 500);
  
  // animate the element with id 'myImage' to 100% greyscale (uncolored) over 500ms.
  $("#myImage").greyscaleOn(500);
  
  // set the element with id 'myImage' to 0% greyscale (colored) in 500 ms.
  $("#myImage").greyscaleOff(500);
```

## Known Bugs:
  
