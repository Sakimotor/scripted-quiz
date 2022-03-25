# Scripted Quiz
A few months ago, this revolutionary feature was added on VGM Quiz. In this guide I will try to explain how quiz scripting works, and how much things it may allow you to do for your events. I will take my [Sakicore APPEND GOTTAMIX](https://www.vgm-quiz.com/event/5efb9af9cd7a6f7d1d536b2f) event, which implements some simple scripted features ([selectable categories represented as images](https://user-images.githubusercontent.com/20578016/159142657-2939e981-0de4-444d-a73d-cab1344cca68.png) and [scripted events depending on the  category selected by the player](https://user-images.githubusercontent.com/20578016/159142840-d163fd2e-f9ae-4225-a9c9-ff76436f4752.png)) as an example.



![image](https://user-images.githubusercontent.com/20578016/159157957-7f6caecb-46f6-49b7-890e-4094022bf95c.png)




## What is a Scripted Quiz ?

A Scripted Quiz is a Quiz that supports some custom features implemented/coded by the quiz maker. Thanks to the use of conditional specials, player variables, and of course, custom behaviour made possible by some pro coding. Technically speaking, this feature literally allows for endless possibilities of what can be done during an event, your imagination is (almost) the limit!


## Conditional Specials ? Player Variables ? coding ??????????

OK, let me explain and demonstrate all of these features step by step.

### Coding

As surprising as it may sound, using the Scripted Quiz will require to know a *slight* 🤏 bit of scripting. Once you tick the option to enable it, four tabs will get added on top of the page : the **Template**, the **Script**, the **CSS** and the **Files**.

⚠️ **Don't forget to press CTRL+S to save each code change on these tabs, there is no autosaving** ⚠️

![image](https://user-images.githubusercontent.com/20578016/159140709-95044426-b958-4394-8be7-b3a13a1b55a4.png)

#### The Script 
 This is the hardest part if you're not familiar with [AngularJS](https://angularjs.org/) nor [jQuery](https://developer.mozilla.org/en-US/docs/Glossary/jQuery), or perhaps even the basics of [JavaScript](https://www.w3schools.com/js/). This here tab is where you make your own rules : you make your own variables, you write your own functions and you implement your own scripted behaviour for the event to use. A very important variable that we have in Angular is the **$scope**. Adding data to the Scope allows to display it to the user in the Template.
Here is a sample script (provided by Ophi in the [Scripted Quiz documentation](https://www.vgm-quiz.com/dev/doc/scripted-quiz/)), where we allow a player to select a game category during a quiz:
 ```javascript
 /* Initialize a function that will allow us to interact with the quiz 
 (the $player variable in particular contains a lot of useful data, 
 while $scope allows us to interact with the quiz's display/template) */
function quiz($quiz, $player, $scope, $room, $chat, $me, $timeout){

  //Here we add a new variable into our scope, named "categories"
	$scope.categories = ['rpg','sport','strategy','action'];
  //We also create a function that will allow a player to choose their own category during the event
	$scope.selectCat = c => {
    /* The scope's "myCat" variable is set as the function's parameter, useful for display.
    More explanation in the "Template" part */
		$scope.myCat = c;
    //The player has the category stored as a new variable, useful for conditional specials
		$player.set('cat',c);
	}

	$quiz.on('init',()=>{
		// the quiz is ready, after it is launched or player join/F5 during                
		// we restore player variables needed in html scope
		$scope.myCat = $player.get('cat');
	});    

	$quiz.on('round-start',o=>{
    //Function that activates each time a round starts
		console.info('ROUNDSTART',o.current,o);
		if(o.current===1) $chat.warn('This is the first round');    		
	});

	$quiz.on('intro',()=>{
		$chat.warn('The intro STARTED');
	});

	$quiz.on('outro',()=>{
		$chat.warn('The outro STARTED');
	});

	$quiz.on('destroy',()=>{
		// remove eventual service listeners...        
	});
	
}
```
 
 
 #### The Template
 If you've never touched [HTML](https://www.w3schools.com/html/) before, imagine something like Microsoft Word, but instead of using shortcuts you actually have to write the tags you want to use to modify your page. By sticking to Ophi's example, here is a sample template (that also shows how we can use Angular to display and use the data from our script) :
 
 ```html
//Creates the div to show in the middle of the screen
<div class="my-super-quiz" >
     /* Angular writing which shows the category picked by the player if already chosen, 
     and shows a select prompt otherwise*/
    <b ng-if="myCat">YOUR CATEGORY: {{myCat}}</b>
    <div ng-if="!myCat">
        <span ng-repeat="c in ::categories">
            <button ng-click="selectCat(c)">{{::c}}</button>
        </span>
    </div>
</div>

``` 
 
 ![image](https://user-images.githubusercontent.com/20578016/159141967-2225aaf7-bd6d-48d8-b11a-e80766bc090e.png)
 ![image](https://user-images.githubusercontent.com/20578016/159142053-99fe99c4-3d0e-4fec-949c-4b90dff84200.png)



 #### The CSS
 
 Still in Ophi's example, the selected text is written in red, despite no such indication being present in the template code. How comes ? This is where [CSS](https://www.w3schools.com/css/) becomes useful ! Change colors and size of an element on the page, you can even ᴀɴɪᴍᴀᴛᴇ it if you're skillful enough, go crazy !
 
 
 ```css
 
 #quiz .my-super-quiz button {
	color:red;

}

#quiz .my-super-quiz {
    
    position: fixed;
    top: 10%;
    left: 50%;
    background: rgba(0,0,0,0.8);
    width: 500px;
    border-radius: 10px;
    color: white;
}
```

#### The Files

If you want to display some images in your script, you will have to use that tab.

* First, you need to upload the files that you want to use in that tab

![image](https://user-images.githubusercontent.com/20578016/159142280-3bf7a6df-3747-4e16-9d33-f2cc7804d808.png)

* Then, you need to get the id of each file, contained within the URL. Let's say that the URL of your file is ht<span>tps://qs546d879411qs3.cloudfront.net/myquiz/sq_**4894512058_1324654654824687410235f_sample**.png . The id needed to display the image would be the highlighted part.

* Finally, you need to use that id in your template, as in :
```js
<img  height="150" width="150" quiz-src="@sq_4894512058_1324654654824687410235f_sample.png" title="{{::t}}" />
```

* Alternatively, you can declare the image IDs in your Script, then pass it to the template :

Script example :
```js
//We write the first set of numbers and the filename, for better code readibility
var p = $scope.pics = [
        '4894512058_sample', 
        '1324870441_sample2'
    ];
    //We replace the underscore by the second set of numbers, which will be common to all the files of this quiz
    for(var i=0;i<p.length;i++) p[i]=p[i].replace('_','_1324654654824687410235f_');
```
Template example:
```js
<div class="theme-selection" >
    <div ng-if="!l_theme">
        <h3 class="h3_l">Select the company you know most about (2X points, no PUs, no hints)</h3>
        <br>
        <span ng-repeat="t in ::themes">
            <button class="theme-button" ng-click="selectLTheme(t)" ng-mouseover="current_desc(t)">
                <img ng-if="pics[$index]" height="150" width="150" quiz-src="@sq_{{::pics[$index]}}.png" title="{{::t}}" />
                <span ng-if="!pics[$index]">{{::s}}</span>
            </button>
        </span>
        <h4 class="desc_theme">{{cur_desc}}</h4>
    </div>
```

Aaaaand tada, you can now display images that you uploaded !
![image](https://user-images.githubusercontent.com/20578016/159142657-2939e981-0de4-444d-a73d-cab1344cca68.png)


### Player Variables & Conditional Specials

As shown before, Scripted Quiz allows to store multiple custom variables for a player, as well as creating events dependent on these new variables.

#### Player Variables


Creating a new variable is a very straightfoward process that can be done thanks to he `$player.set('variable_name',value)` function. If the variable depends on a player's interaction with the template (typical usage : a player wants to pick a category among multiple clickable buttons/images), the following steps are required to set the variable according to the player's choice :
	
* In the **Script** tab, create a function that takes a parameter, which will be used to initialize a new variable.
		
```js
	
$scope.themes = ['sega', 'konami', 'capcom', 'square', 'namco', 'taito'];
$scope.difficulties = ['Medium', 'Medium-Hard', 'Hard', 'Very Hard'];
	
$scope.pics = [
        '1640213313_sega',
        '1640213354_konmai',
        '1640213387_capcom',
        '1640213473_square',
        '1640213530_namco',
        '1640214216_taito'
    ];
	
/* Function launched when the quiz starts, and when a player F5s/joins it. */
$quiz.on('init',()=>{
        $scope.l_theme = $player.get('LthemeSaki'); //Scope variable made for practical purposes, see template
    });
    
    /* Here, "theme" is the name of a variable belonging to the function "selectLTheme".
    In order to be called from the template, the function needs to belong to the $scope. */
    $scope.selectLTheme = theme=>{
        $scope.l_theme = theme; 
        $player.set('LthemeSaki',theme); //Where we actually set the variable used by the Quiz
    };	
	
```

* In the **Template** tab, we attach a function to our buttons/images with  the `ng-click` tag.

```js
	
	<div class="theme-selection" >
    <div ng-if="!l_theme"> //Only show this div if the variable isn't already set
        <h3 class="h3_l">Select the company you know most about (2X points, no PUs, no hints)</h3>
        <br>
        <span ng-repeat="t in ::themes"> //shows a button for each theme in the $scope.themes array
            <button class="theme-button" ng-click="selectLTheme(t)"> //On click, set the player's theme
	/*Shows a picture belonging to the theme if found.
	More info on the $index variable here :	https://docs.angularjs.org/api/ng/directive/ngRepeat */
                <img ng-if="pics[$index]" height="150" width="150" quiz-src="@sq_{{::pics[$index]}}.png" title="{{::t}}" />
                <span ng-if="!pics[$index]">{{::s}}</span>
            </button>
        </span>
    </div>
		
		
```

		
#### Conditional Specials


Now that we know how to make custom variables, let's actually use them in our quiz. If you go back to the **Playlist** tab, then show the "special" options of a track, you will see that a lot of options end with an "if"
		
![image](https://user-images.githubusercontent.com/20578016/159179168-0f0b45fb-a2d9-4470-9afa-9542253e1d4b.png)

This is what is known as a "Conditional Special". By setting a custom variable, we can use it to trigger different events depending on the variable's value. To keep my previous example, I can display a picture when a track plays exclusively to players who picked "namco" as their theme by selecting "=" in the scrolling list :
		
![image](https://user-images.githubusercontent.com/20578016/159179264-1eacab93-34d6-451a-8e4b-1a7ad45359a3.png)

The following specials support conditions :
		
* **show a picture**
* **write a text**
* **change title/wallpaper/hue**		
* **ebb backgrounds**
* **bonus points**		
* **delay answer**
* **block/reload powerup**
* **post-fx**
* **hare tip**
* **custom hare/reminder**
* **script triggers**
		
More informations about the triggers below.		

#### Triggers
		
[WIP]


		
## Conclusion
		
That's pretty much all the basics you need to know in order to make something cool with the Scripted Quiz. Good luck and have fun in your event making.
