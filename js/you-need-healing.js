var started = false;
var fullscreenElement;
var musicVol = 80;
var soundsVol = 80;
var inMainMenu = true;
var isMobile = false;
var isChromium = false;
var webApp = false;
var fullScreen = false;
var orientationLandscape = true;

function toggleSettings(){
    var actualState = $("#settings-window").css("display");    
    actualState = actualState == "none"? false: true;
    if(!inMainMenu && !actualState && !started)
        return;
    if(started){
        $(".menu-subtitle").css({"height": "18%"})
        $(".subtitle-sm").css({"height": "14%"})
        toggleDisplay($("#exit-button"), true);
        toggleBlur($("#playground"), !actualState);
        //myGame.pause();
    }else{
        $(".menu-subtitle").css({"height": "20%"})
        $(".subtitle-sm").css({"height": "14%"})
        toggleDisplay($("#exit-button"), false);
        changeButtonsState($(".menu-btn"), !actualState);
        toggleBlur($("#menu-window"), !actualState);        
    }  
    toggleDisplay($("#settings-window"), !actualState);
    inMainMenu = !started && actualState;
}

function toggleWindow(window){    
    var actualState = window.css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".menu-btn"), !actualState);
    toggleBlur($("#menu-window"), !actualState);
    toggleDisplay(window, !actualState);
    inMainMenu = actualState;
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

/*function toggleLevels(){
    var actualState = $("#level-window").css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".menu-btn"), !actualState);
    toggleDisplay($("#level-window"), !actualState);
    inMainMenu = actualState;
}*/

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
    toggleBlur($("#menu-window"), false);
    toggleDisplay($("#level-window"), false);
    toggleDisplay($("#menu-window"), false);
    toggleDisplay($("#game-window"), true);
    //myGame = new Game();
    started = true;
}

function resetLanguageButtons(){
    $("#bt-es").children().removeClass("language-selected");
    $("#bt-en").children().removeClass("language-selected");
    $("#bt-fr").children().removeClass("language-selected");
    $("#bt-de").children().removeClass("language-selected");    
    $("#bt-it").children().removeClass("language-selected");
}

function changeLang(but, lang){
    //console.log("cambiando lenguaje " + lang)
    if(i18next.language == "lang")
            return;
    resetLanguageButtons();
    i18next.changeLanguage(lang);    
    but.children().addClass("language-selected");
}

//funciones para el modo fullscreen
// mozfullscreenerror event handler
function errorHandler() {
   alert('mozfullscreenerror');
}
document.documentElement.addEventListener('mozfullscreenerror', errorHandler, false);

// toggle full screen
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function detectDevice(){
    isChromium = !!window.chrome;
    /*if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        isMobile = true;        
    }*/
    
    if (/Mobi/.test(navigator.userAgent)) {
        isMobile = true;
    }
}

function detectFullscreen(){
    //detectamos si estamos en full screen
    if (document.fullscreenElement ||    // alternative standard method
      document.mozFullScreenElement || document.webkitFullscreenElement){
         $("#full-screen").get(0).checked = true;
        fullScreen = true;
    }else{
         $("#full-screen").get(0).checked = false;
        fullScreen = false;
    }
}

function detectOrientation(){
    //detectamos si se ha cambiado la orientación del movil
    if (matchMedia("(orientation: portrait)").matches) {
        orientationLandscape = false;
      $("#landscape-button").children().removeClass("glyphicon-folder-close");
      $("#landscape-button").children().addClass("glyphicon-file");
    }
    if (matchMedia("(orientation: landscape)").matches) {
        orientationLandscape = true;
        $("#landscape-button").children().addClass("glyphicon-folder-close");
        $("#landscape-button").children().removeClass("glyphicon-file");
    }
}

function checkOrientation(){
    var promptState = $("#prompt-window").css("display") == "none" ? false : true;
    if(!webApp && /*isMobile &&*/ !orientationLandscape && !promptState){
        toggleDisplay($("#prompt-window"), true);
    }    
    if(promptState && orientationLandscape){
        toggleDisplay($("#prompt-window"), false);
    }
}

var myGame;

$(function(){
    init_i18n();    
    detectDevice();
    detectFullscreen();
    detectOrientation();
    checkOrientation();
    
    if(isMobile){
        toggleDisplay($("#change-mode-button"), true);   
        if(isChromium){
            toggleDisplay($("#webApp-hint"), true);      
        }
    }
    
    //definimos los valores por defecto de los sliders de audio
    $("#music-volume-level").prop("value", musicVol);
    $("#sounds-volume-level").prop("value", soundsVol);
        
    //detectamos si la web se esta cargando como una web app desde el escritorio android
    if (matchMedia('(display-mode: standalone)').matches) {
        webApp = true;
        fullScreen = true;
    }  
    
    window.addEventListener("resize", function(){
        detectFullscreen();
        detectOrientation();     
        checkOrientation();        
    }, false);
    
    $("#full-screen").click(function(){
        toggleFullScreen();       
    })  
    
    $("#change-mode-button").click(function(){
        //intentamos activar el modo fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        //intentamos forcar el modo landscape
        screen.orientation.lock('landscape');
    })
    
    $("#1player-button").click(function(){toggleWindow($("#level-window"))});
    $("#level-close-button").click(function(){toggleWindow($("#level-window"))}); 
    
    $("#settings-button").click(toggleSettings);
    $("#settings-close-button").click(toggleSettings);   
    
    //listeners para actualizar las variables de audio cuando se cambien los sliders
    $("#music-volume-level").on("change", function(){
        musicVol = $(this).prop("value");
    })    
    $("#sounds-volume-level").on("change", function(){
        soundsVol = $(this).prop("value");
    })    
    
    $("#credits-button").click(function(){toggleWindow($("#credits-window"))});    
    $("#credits-close-button").click(function(){toggleWindow($("#credits-window"))});
    
    $("#2players-button").click(function(){toggleWindow($("#2players-window"))});    
    $("#2players-close-button").click(function(){toggleWindow($("#2players-window"))});
    
    $("#pause-button").click(toggleSettings);
    // Manejador esc para pause
    $(document).keydown(function(e)
    {   
        if(e.which == 27){
            toggleSettings();
        }                              
    });
    
    //manejador boton salir del juego
    $("#exit-button").click(function(){
        toggleBlur($("#game-window"), false);
        toggleDisplay($("#level-window"), false);
        toggleDisplay($("#menu-window"), true);
        toggleDisplay($("#game-window"), false);
        toggleDisplay($("#settings-window"), false);
        toggleDisplay($("#credits-window"), false);
        changeButtonsState($(".menu-btn"), false);
        inMainMenu = true;
        //myGame.end();
        started = false;
    });
    
    //manejador botones de idiomas
    $("#bt-es").click(function (){changeLang($(this), "es")});
    $("#bt-en").click(function (){changeLang($(this), "en")});
    $("#bt-fr").click(function (){changeLang($(this), "fr")});
    $("#bt-de").click(function (){changeLang($(this), "de")});
    $("#bt-it").click(function (){changeLang($(this), "it")});    
})