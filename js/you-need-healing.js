var started = false;
var gameLoop;
var ctx;

function toggleSettings(){    
    var actualState = $("#settings-window").css("display");
    actualState = actualState == "none"? false: true;
    if(started){
        toggleDisplay($("#exit-button"), true);
        //myGame.pause();
    }else{
        toggleDisplay($("#exit-button"), false);
        changeButtonsState($(".main-menu"), !actualState);
    }    
    toggleDisplay($("#settings-window"), !actualState);
}

function toggleLevels(){
    var actualState = $("#level-window").css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".main-menu"), !actualState);
    toggleDisplay($("#level-window"), !actualState);
}

function changeButtonsState(container, newState){
    let items = container.children("button");
    for(var i = 0; i < items.length; i++){
        var item = items[i];
        item.disabled = newState;            
    }
}

//cambia la visibilidad de un objeto (referenciado con el selector de jquery)
function toggleDisplay(item, newState){
    if(newState){
        item.css({"display": "block"});
    }else{
        item.css({"display": "none"});
    }
}

function gameLoopF(){
    console.log(myGame.movables.size);
    if(started){
        myGame.update(1);
        myGame.render(ctx);
        requestAnimationFrame(gameLoopF);
    }
}

function play(level){
    toggleDisplay($("#level-window"), false);
    toggleDisplay($("#menu-window"), false);
    toggleDisplay($("#game-window"), true);
    myGame = new Scene("level"+level);
    started = true;
    loadLevel(level);    
    myGame.start();
    gameLoop = requestAnimationFrame(gameLoopF);
}

function loadLevel(lvl){
    let ninja;
    ninja = new Entity("ninja", null, new Transform(ninja, new Victor(20, 20), new Victor(1, 1)));
    ninja.addComponent(new Sprite(ninja, "assets/sprites/ninja0.png"));
    ninja.addComponent(new Kinematic(ninja, new Victor(0,5)));
    ninja.addComponent(new Collider(ninja));
    myGame.addEntity(ninja);    
}

var myGame;

$(function(){
    init_i18n();    
    ctx = $("#playground").get(0).getContext("2d");
    
    $("#settings-button").click(toggleSettings);
    $("#settings-close-button").click(toggleSettings);
    
    $("#1player-button").click(toggleLevels);
    $("#level-close-button").click(toggleLevels);
    
    // Manejador esc para pause
    $(document).keydown(function(e)
    {   
        if(e.which == 27){
            toggleSettings();
        }                              
    });
    
    //manejador boton salir del juego
    $("#exit-button").click(function(){
        toggleDisplay($("#level-window"), false);
        toggleDisplay($("#menu-window"), true);
        toggleDisplay($("#game-window"), false);
        toggleDisplay($("#settings-window"), false);
        changeButtonsState($(".main-menu"), false);
        //myGame.end();
        started = false;
    });
})