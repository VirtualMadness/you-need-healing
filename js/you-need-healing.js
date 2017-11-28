var started = false;

function toggleSettings(){    
    var actualState = $("#settings-window").css("display");
    actualState = actualState == "none"? false: true;
    if(started){
        toggleDisplay($("#exit-button"), true);
        toggleBlur($("#menu-window"), !actualState);
        //myGame.pause();
    }else{
        toggleDisplay($("#exit-buttons"), false);
        changeButtonsState($(".menu-btn"), !actualState);
        toggleBlur($("#game-window"), !actualState);        
    }  
    toggleDisplay($("#settings-window"), !actualState);
}

function toggleBlur(view, state){
    if(state){
        view.css({"filter": "blur(7px)"});
    }
    else{
        view.css({"filter": "blur(0px)"});
    }
}

function toggleLang(view, state){
    if(state){
        view.css({"filter": "blur(7px)"});
    }
    else{
        view.css({"filter": "blur(0px)"});
    }
}

function toggleLevels(){
    var actualState = $("#level-window").css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".main-menu"), !actualState);
    toggleDisplay($("#level-window"), !actualState);
}

function changeButtonsState(container, newState){    
    container.each(function(){
        $(this).prop("disabled", newState);
    })
    
    /*let items = container.children("button");
    for(var i = 0; i < items.length; i++){
        var item = items[i];
        item.disabled = newState;            
    }*/
}

//cambia la visibilidad de un objeto (referenciado con el selector de jquery)
function toggleDisplay(item, newState){
    if(newState){
        item.css({"display": "block"});
    }else{
        item.css({"display": "none"});
    }
}

function play(level){
    toggleDisplay($("#level-window"), false);
    toggleDisplay($("#menu-window"), false);
    toggleDisplay($("#game-window"), true);
    //myGame = new Game();
    started = true;
}

function changeLang(lang){
    console.log("cambiando lenguaje " + lang)
    i18next.changeLanguage(lang);    
}

var myGame;

$(function(){
    init_i18n();    
    
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
    
    //manejador botones de idiomas
    $("#bt-es").click(function (){changeLang("es")});
    $("#bt-en").click(function (){changeLang("en")});
    $("#bt-de").click(function (){changeLang("de")});
    $("#bt-it").click(function (){changeLang("it")});
    $("#bt-es").click(function (){changeLang("es")});
    $("#bt-fr").click(function (){changeLang("fr")});
})