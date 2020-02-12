# Plugins-for-SRPG-Studio
## A collection of plugins made by Goinza for use in SRPG Studio


NOTE: To make explanations shorter, in general I will refer to the SRPG Studio program as "the engine".


### HOW TO USE PLUGINS ON SRPG STUDIO
Each folder in this project correspond to one of the plugins. Each plugin 
has at least one .js (Javascript) file, and another file called $readme.txt. \
The readme file has specific instructions on how to make the plugin work.\
To use the plugin, drag the folder to the Plugin folder of your project and follow
the instructions of the readme file.\
Note that all readme files start with the '$' character. That is because every
file that doesn't start with that character will be considered as part of the code,
and that can crash the game.


### GENERIC INSTRUCTIONS FOR ALL PLUGINS
There are some aspects that are common to most plugins, so instead of explaining them
in each indivdual file, they will be covered here: 

  #### Custom Parameters
  This are custom information that you can write in an object on your project's database.
  Those parameters are used for some plugins. For example, the Weapon Rank plugin has a parameter to set the rank
  of an unit. \
  Generally, in the place where you can modify something, there is a button called Custom Parameters where you can write them.
  How each parameter works depends on the plugin, but in general, all parameter must be separated by a ',' and
  must be under a pair of brackets {}. Even if the parameter are from different plugins, all must be insisde the
  same brackets. For example: {paramA: "Hello", paramB: 15, paramC: true} \
  Here we wrote three parameters with different types of values. The first is a string of characters,
  the second a number and the third a boolean value (true or false). 
   
  #### Global Parameters
  This works exactly the same as the custom parameters, but instead of being something applied to an object,
  they apply to the entire game. The global parameters are located in Database->Config-Script->Global Parameters. 
  
  #### ID 
  Almost every element in the engine has an ID. Units, classes, weapons, items, weapon types, etc. \
  The ID is a number that identifies that object in its own category. This means that if an weapon has a number assigned,
  no other weapon has the same number assigend. But a different object, like a class, could have the same ID as that weapon,
  as long as that number has not been used already for some other class. \
  This is used in some plugins as a value for some custom parameters. For example, a plugin could need the ID of a skill
  in the custom parameter of an unit. If the skill has ID 15, the something like {skill:15} could be used in some plugin. \
  Note that by default, the engine doesn't show the ID's of the objects in the database. To make them visible, you need 
  to go to Tools->Options->Data and check the option "Display id next to data name". \
    
  #### Compatibility issues
  Just like mods in other games, plugins are not always compatible with each other. \
  Unfortunely, the problem is a bit technical, so a person that doesn't know about programming may not understand it.
  In simple words, everything in the code is around a system of functions made by the developres of the engine. \
  To make a plugin, you modify those functions, and sometimes if two plugins try to modify the same function,
  only one of them will be executed. This will bring a problem with the plugin that can't use the function,
  making the plugin have issues or even crashing the game. \
  In general, the readme file will specify if there is some compatibility issue. That is, it will have a list of all
  the functions that have incompatibility with other plugins. This means that if other plugins use those functions, those
  plugins may not work correctly.
    
  #### Execute Script
  In some cases, a plugin may ask you to make an Execute Script event to make it work.
  To do this, you need to create an event, inside that event make a event command and choose the Execute Script event.
  In that event, you need to check the option "Execute Code" and write in the text box the code that the plugin asks you
  to write.
    
    
### CONTACT
If you have problem with some of the instructions (here or in the plugin's readme) or some of the plugins are
not working correctly, you can contact me through Discord. You can use direct message or, if you are in the
/r/SRPGStudio Discord server, you can ping me there. \
My username in Discord is Goinza#5058 and you can enter the server here https://discord.gg/yRbuKUd


### MIT License

Copyright (c) 2020 Goinza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
