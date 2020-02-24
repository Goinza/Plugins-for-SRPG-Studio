Learnable Skills by Class
By Goinza
February 24, 2020
Version 1.0

This plugin allows to make a untis learns skill at a specific level and class.
By default, the engine only lets you specify the level required to make an unit learn a skill, but with this you can also specify the class.
To make this, you need to assign a custom parameter 'skills' to the class. 
Note that you don't have to assign the skills to the Learned Data of each unit. Ignore that part of the editor and just use the class custom parameter.

HOW TO USE THE CUSTOM PARAMETER
Here is an example of the custom parameter:
    {skills: [ {id:4, level:10}, {id:7, level:15}, {id:12, level: 20} ]}
In this example, the class can learn three skills: it will learn the skill with ID 4 at level 10, the skill with ID 7 at level 15 and the skill with ID 12 at level 20.
Note that if, for some reason, the unit is over the required level and has not learned the skill, then the next time it levels up, it will learn the skill.
Also, if an unit changes to a different class, it may be able to learn a new skill, assuming that the unit has the required level.

INCOMPATIBLITY ISSUES
This plugin is compatible with any other plugin.
