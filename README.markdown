Yet Another Stinking Carousel
=============================

Plugin that makes continuous carousels with simple controls. Degrades nice.

  
Requires
--------

*  jquery 1.6.4 or higher (not tested on lower versions, but should
   work)

Default options 
----------------

``` javascript
prev          : '.carousel__control_action_prev',     //selector for a "prev" control
next          : '.carousel__control_action_next',     //selector for a "prev" control
disabledClass : 'carousel__control_state_disabled',   //class used on the control when carousel reaches the end
activeClass   : 'carousel__control_state_active',     //class used on the control when carousel reaches the end
useEvents     : false,                                //instead of predefined actions plugin will trigger certain prefixed events on carousel and controls
orientation   : 'horizontal'                          //or vertical, why not
```

Usage:
------

HTML:<br>

``` html
<ul class="carousel__list">
    <li class="carousel__item">
        <!-- whatever -->
    </li>
    ...
</ul>
<a href="#" class="carousel__control carousel__control_state_disabled carousel__control_action_prev">Prev</a>
<a href="#" class="carousel__control carousel__control_state_disabled carousel__control_action_next">Next</a>
```

Required portion of CSS:<br>

``` css
.carousel__list {
    /* lets pretend it's a horizontal one */
    overflow: hidden;
    white-space: nowrap;
}
.no-js .carousel__list {
    overflow-y: hidden;
    overflow-x: auto;
}
```

And that's it for required css actually, but I suggest you see a [demo](http://vxsx.github.com/Yet-Another-Carousel). Note that controls could be multiple and may be wherever you want.

And Javascript:<br>

``` javascript	
$('.carousel__list').carousel();
```

Compatibility
-------------

Plugin works in every browser I tested (IE6+, FF3+, Safari5+, Chrome, Opera10.60+)
