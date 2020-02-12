/**
 * Script by Goinza
 * 
 * Here are all the variables that can be easily edited by users with no coding knowledge. *
 */


/**
 * This is the rank system.
 * Each rank has a number assigned. The default values of each rank are equal to the ones used in the GBA FE games.
 * You can change those values if you want a different amount of points to reach each rank, 
 * and you can also add more ranks or remove the ones that are here.
 * The only two things you must keep is that the first rank must have a value of 0,
 * and that each rank must have a bigger value than the one before and lower that the one next to it.
 */
var RANK_SYSTEM = [ ["", 0], ["E", 1], ["D", 31], ["C", 71], ["B", 121], ["A", 181] ];

/**
 * If this variable is true, then all the weapon types will be shown on the weapon ranks window, even the ones the unit cannot use.
 * But if the variable is false, then all the weapon types that the unit can't use will not show up.
 */
var SHOW_UNUSED_WEAPONS = true;

/**
 * This value represent the color of the gauge used by this script.
 * By default, all gagues have the following values for colors:
 *  1 - Blue
 *  2 - Green
 *  3 - Red
 * 0 is the value used for the empty bar, don't select that value as the color.
 * 
 * If you are using a custom gauge, the first gauge must be the empty gauge. That is the gauge with the 0 value.
 * The one below is the gauge 1, and so on.
 * NOTE: to insert a custom gauge or change the gauge to another of the default gauges, read the instruction on the readme
 */
var GAUGE_COLOR = 2; //Green