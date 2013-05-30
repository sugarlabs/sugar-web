Sugar Graphics
==============

Sugar widgets and graphics, implementing the [Sugar Interface
Guidelines](http://wiki.sugarlabs.org/go/Human_Interface_Guidelines).

Modifying the CSS
-----------------

We use [LESS](http://lesscss.org) and then compile the CSS.  This is
to be able to use calculations and variables for colors and measures.
And to be able to output different CSS files for different screen
resolutions, which is planned.

To compile the CSS do:

    lessc graphics/css/sugar.less graphics/css/sugar.css

Be sure to compile it before commit.
