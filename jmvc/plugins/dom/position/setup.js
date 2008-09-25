/**
 * @class MVC.Position
 * Provides helper functions that let you know if a coordinate is within an X,Y value
 */
MVC.Position = 
/*@Static*/
{
  /**
   * Needs to be called once before any calculations are made, but after
   * all CSS has been applied.  Sets deltaX and deltaY
   */
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  /**
   * Returns if a coordinate is within another element.
   * caches x/y coordinate pair to use with overlap
   * @param {HTMLElement} element
   * @param {Number} x
   * @param {Number} y
   * @return {Boolean} true if x, y is inside the element, false if otherwise.
   */
  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = MVC.Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },
  /**
   * Returns if a coordinate is within an element taking scrolling into account.
   * @param {HTMLElement} element
   * @param {Number} x
   * @param {Number} y
   * @return {Boolean} true if x, y is inside the element, false if otherwise.
   */
  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = MVC.Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = MVC.Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  }
}