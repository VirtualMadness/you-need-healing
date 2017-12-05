var started = false;
//var fullscreenElement;
var musicVol = 80;
var soundsVol = 80;
var inMainMenu = true;
var isMobile = false;
var isChromium = false;
var webApp = false;
var fullScreen = false;
var orientationLandscape = true;
var scene;
var gameLoop;
var ctx;
var id = 0;
var energyRec = null;

//resource variables
let sprND = new SpriteD(["assets/game/textures/cajaNoDestruible.png"], -1, Victor(-60, -60));      //sprite de los bloques normales
let sprDMG = new AnimationD(["assets/game/textures/boxDamage1.png", "assets/game/textures/boxDamage2.png", "assets/game/textures/boxDamage3.png", "assets/game/textures/boxDamage4.png",], 0.1, -1, Victor(-60, -60));       //sprite animado de los bloques con daño
let sprArrowNull = new Sprite(["assets/game/sprites/null.png"], -10, Victor(0, -9));
let sprArrow = new Sprite(["assets/game/sprites/arrow.png"], -10, Victor(0, -9));
let sprChargeNull = new Animation(["assets/game/sprites/null.png"],0, 0.5, Victor(-50, -50));
let sprCharge = new Animation([
    "assets/game/sprites/charge_frames/charge1.png",
    "assets/game/sprites/charge_frames/charge2.png",
    "assets/game/sprites/charge_frames/charge3.png",
    "assets/game/sprites/charge_frames/charge4.png",
    "assets/game/sprites/charge_frames/charge5.png",
    "assets/game/sprites/charge_frames/charge6.png",
    "assets/game/sprites/charge_frames/charge7.png",
    "assets/game/sprites/charge_frames/charge8.png",
    "assets/game/sprites/charge_frames/charge9.png",
    "assets/game/sprites/charge_frames/charge10.png",
    "assets/game/sprites/charge_frames/charge11.png",
    "assets/game/sprites/charge_frames/charge12.png",
    "assets/game/sprites/charge_frames/charge13.png",
    "assets/game/sprites/charge_frames/charge14.png",
    "assets/game/sprites/charge_frames/charge15.png",
    "assets/game/sprites/charge_frames/charge16.png",
    "assets/game/sprites/charge_frames/charge17.png",
    "assets/game/sprites/charge_frames/charge18.png",
    "assets/game/sprites/charge_frames/charge19.png",
    "assets/game/sprites/charge_frames/charge20.png",
    "assets/game/sprites/charge_frames/charge21.png",
    "assets/game/sprites/charge_frames/charge22.png",
    "assets/game/sprites/charge_frames/charge23.png",
    "assets/game/sprites/charge_frames/charge24.png",
    "assets/game/sprites/charge_frames/charge25.png",
    "assets/game/sprites/charge_frames/charge26.png",
    "assets/game/sprites/charge_frames/charge27.png",
    "assets/game/sprites/charge_frames/charge28.png",    
    "assets/game/sprites/charge_frames/charge29.png",
    "assets/game/sprites/charge_frames/charge30.png",
    "assets/game/sprites/charge_frames/charge31.png",
    "assets/game/sprites/charge_frames/charge32.png",
    "assets/game/sprites/charge_frames/charge33.png",
    "assets/game/sprites/charge_frames/charge34.png",
    "assets/game/sprites/charge_frames/charge35.png",
    "assets/game/sprites/charge_frames/charge36.png",
    "assets/game/sprites/charge_frames/charge37.png",
    "assets/game/sprites/charge_frames/charge38.png",
    "assets/game/sprites/charge_frames/charge39.png",
    "assets/game/sprites/charge_frames/charge40.png"], 0.35, 0.5, Victor(-50, -50));

let col = new RectCollider(120, 120, Victor(-60, -60, 0));  //collider estandar de los bloques normales y daño

//#region Sonidos
var snd_draw = "assets/game/snd/sfx/nin/draw-1.ogg";
var game_music = "assets/game/snd/music/boss.ogg";
var sounds_to_load = 
[
    game_music,
    snd_draw, 
];
//#endregion

function randomId(){
    id++;
    return id;
    //return new Date().getTime();
}

function recoveryEnergy(){
   let ninM = scene.getEntity("nin").getComponent(ComponentType.Behaviour).memory;
    let energy = ninM.get("energy");
    if (energy < 5){
        ninM.set("energy", energy+1)
        let memo = scene.getEntity("HUD-energy").getComponent(ComponentType.Behaviour).memory;
        memo.set("energy", energy+1);
        memo.set("recover", true);            
    }   
}

function setEnergyRec(){
    if(energyRec != null){       
        clearInterval(energyRec); 
    }
    energyRec = setInterval(recoveryEnergy, 2000);
}

function toggleSettings(){
    var actualState = $("#settings-window").css("display");    
    actualState = actualState == "none"? false: true;
    if(!inMainMenu && !actualState && !started)
        return;
    if(started){
        $(".menu-subtitle").css({"height": "18%"})
        $(".subtitle-sm").css({"height": "14%"})
        if(!actualState){
            scene.pause();
        }else{
            scene.play();
        }
        toggleDisplay($("#exit-button"), true);
        toggleBlur($("#playground"), !actualState);        
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
    
    //inicializamos el canvas
    ctx = $("#playground").get(0).getContext("2d");
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    const C_WIDTH = parseInt(ctx.canvas.getAttribute("width"));
    const C_HEIGHT = parseInt(ctx.canvas.getAttribute("height"));
    //creamos la escena
    scene = new Scene("main", 1240, 800, C_WIDTH, C_HEIGHT);    
    //scene.debug = true;
    scene.margin = 60;
    started = true;
    gameLoop = new GameLoop(scene);    
    loadLevel(level);   
    scene.start();
    gameLoop.loop();    
    setEnergyRec();
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
    if(fullScreen && isMobile){
        //intentamos forcar el modo landscape
        screen.orientation.lock('landscape');
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
        if(started && scene != null){
            scene.pause();
        }        
    }    
    if(promptState && orientationLandscape){
        toggleDisplay($("#prompt-window"), false);
        if(started && scene != null){
            scene.play();
        } 
    }
}

function loadRanking(){
    /*$("#ranking").html('<caption style="font-size:34px"><b>LeaderBoard</b></caption> <tr> <th style="width:20%">Place</th> <th style="width:50%">Player</th> <th>Points</th> </tr>');*/
	for(var i = 0; i < ranking.length; i++){					
		$("#ranking").append("<tr><td>"+ranking[i].pos+"</td> <td>"+ranking[i].name+"</td> <td>"+ranking[i].points+"</td></tr>");
	}
}

$(function(){
    //inicializacion
    init_i18n();    
    detectDevice();
    detectFullscreen();
    detectOrientation();
    checkOrientation(); 
    loadRanking();
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
    })
    
    $("#1player-button").click(function(){toggleWindow($("#level-window"))});
    $("#level-close-button").click(function(){toggleWindow($("#level-window"))}); 
    
    $("#settings-button").click(toggleSettings);
    $("#settings-close-button").click(toggleSettings);   
    
    //listeners para actualizar las variables de audio cuando se cambien los sliders
    $("#music-volume-level").on("change", function(){
        musicVol = $(this).prop("value");
        if(started && scene.sound_manager != null){
            scene.setVolume(musicVol, soundsVol, 100);
        }
    })    
    $("#sounds-volume-level").on("change", function(){
        soundsVol = $(this).prop("value");
        if(started && scene.sound_manager != null){
            scene.setVolume(musicVol, soundsVol, 100);
        }
    })
    
    $("#highscore-button").click(function(){toggleWindow($("#highscore-window"))});    
    $("#highscore-close-button").click(function(){toggleWindow($("#highscore-window"))});

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
        clearInterval(energyRec); 
        inMainMenu = true;
        gameLoop = null;
        scene.stop();
        scene = null;     
        toggleBlur($("#playground"), false);
        toggleDisplay($("#level-window"), false);
        toggleDisplay($("#menu-window"), true);
        toggleDisplay($("#game-window"), false);
        toggleDisplay($("#settings-window"), false);
        toggleDisplay($("#credits-window"), false);
        changeButtonsState($(".menu-btn"), false);                   
        started = false;
    });
    
    //manejador botones de idiomas
    $("#bt-es").click(function (){changeLang($(this), "es")});
    $("#bt-en").click(function (){changeLang($(this), "en")});
    $("#bt-fr").click(function (){changeLang($(this), "fr")});
    $("#bt-de").click(function (){changeLang($(this), "de")});
    $("#bt-it").click(function (){changeLang($(this), "it")});    
});

class GameLoop{    
    constructor(currentScene){
        var self = this;
        this.nt = new Date().getTime();
        this.t = new Date().getTime();
        this.dt = 0;
        this.scene = currentScene;
    };
    
    loop(){
        this.scene.getInput().earlyUpdate();
        this.nt = new Date().getTime();
        this.dt = (this.nt - this.t) * 0.001;
        
        // Bucle
        this.scene.update(this.dt);
        this.scene.render(ctx);
        this.scene.checkPause();

        // Render
        requestAnimationFrame(function(){if(gameLoop != null) gameLoop.loop()});

        this.t = this.nt;

        // Manages input
        this.scene.getInput().lateUpdate();
    }    
}

//#region Behaviours
//#region Camera
var cameraCreate = (e, m)=>
{
    m.set("target", "nin");
    m.set("smoothing", 0.1);
};

var follow = (e, m)=>
{
    let target = e.scene.getEntity(m.get("target"));
    if(target == null) 
        return;

    let smoothing = m.get("smoothing");
    let t = e.getComponent(ComponentType.Transform);

    let target_pos = target.getComponent(ComponentType.Transform).position;
    let target_rot = target.getComponent(ComponentType.Transform).rotation;

    t.position = Victor(lerp(t.position.x, target_pos.x, smoothing), lerp(t.position.y, target_pos.y, smoothing));
    t.rotation = target_rot;
};

/*var followCam = (e, m)=>
{
    let target = e.scene.getEntity(m.get("target"));
    if(target == null) 
        return;

    let smoothing = m.get("smoothing");
    let t = e.getComponent(ComponentType.Transform);

    let target_pos = target.getComponent(ComponentType.Transform).position;
    let target_rot = target.getComponent(ComponentType.Transform).rotation;

    t.position.x = clamp(lerp(t.position.x, target_pos.x, smoothing), e.scene.canvas_width/2, e.scene.width - e.scene.canvas_width/2);
    t.position.y = clamp(lerp(t.position.y, target_pos.y, smoothing), e.scene.canvas_height/2, e.scene.height - e.scene.canvas_height/2);
    t.rotation = target_rot;
};*/


//#endregion

//#region Nin
var ninCreate = (e, m) =>
{
    m.set("energy", 5);
    m.set("hp", 3);
    m.set("base_speed", 100);
    m.set("press_count", 0);
};

var ninUpdate = (e, m) =>
{
    // Params
    let dir = m.get("direction");
    let spd = m.get("base_speed");
    let energy = m.get("energy");
    let hp = m.get("hp");
    
    // Input
    let input = e.scene.getInput();

    // Components
    let k = e.getComponent(ComponentType.Kinematic);
    let t = e.getComponent(ComponentType.Transform);
    let c = e.getComponent(ComponentType.Collider);

    let base_spd_w_dir = Victor(spd, 0).rotateBy(k.speed.horizontalAngle());
    let actualSpeed = k.speed.clone().multiply(Victor(gameLoop.dt, gameLoop.dt));
    let nextPosition = t.position.clone().add(actualSpeed);
    
    //check for collisions
    let obj = c.placeMeeting(nextPosition, Tag.Solid, -1);
        if(obj != null)
        {       
            //variables usadas para calcular la normal del impacto, se usa la funcion rayCollision que necesita 2 
            //esquinas opuestas del collider total (sumando el ancho y alto de cada collider), la direccion y el punto de origen.
            let otherC = obj[0].getComponent(ComponentType.Collider);
            let otherT = obj[0].getComponent(ComponentType.Transform);            
            let minCorner = Victor(otherT.position.x - ((c.width + otherC.width)/2),otherT.position.y - ((c.height + otherC.height)/2));
            let maxCorner = Victor(otherT.position.x + ((c.width + otherC.width)/2),otherT.position.y + ((c.height + otherC.height)/2));
            let coll = rayCollision(actualSpeed.normalize(), nextPosition, minCorner, maxCorner); 
            //la funcion devuelve un array donde la pos 0 indica si se ha producido collision 
            //(en este caso sera siempre true ya que la collision se ha chequeado antes) y la pos 1 es un vector con la normal
            if(coll[1] != null){
                k.speed = reflect(k.speed.clone(), coll[1]);
                t.rotation = k.speed.horizontalAngleDeg();
            }
            if(e.scene.debug){
                console.log("collision with " + obj[0].id);
                console.log("normal "+coll[1]);
            }
            if(obj[0].id.search("dmg") != -1){
                console.log("vida perdida");
                //el objeto es una caja dañina                
                m.set("hp", hp--);
                scene.getEntity("HUD-life").getComponent(ComponentType.Behaviour).memory.set("damaged", true);
            }
        }
    k.speed = Victor(lerp(k.speed.x, base_spd_w_dir.x, 0.1), lerp(k.speed.y, base_spd_w_dir.y, 0.1));
    
    if(input.getMouseDown(MouseButton.Left))
    {
        m.set("i_mp", input.mouseCanvasPosition);
        m.set("ready", false);        
    }

    if(input.getMousePressed(MouseButton.Left))
    {
        let pc = m.get("press_count");

        if(pc == 8)
        {
            e.scene.getEntity("arrow").addComponent(sprArrow.clone());
            e.scene.getEntity("charge").addComponent(sprCharge.clone());
            m.set("ready", true);
            if(e.scene.debug)
                console.log("Stage 1");
        }
        if(pc == 30)
        {   
            if(energy >= 2){
                if(e.scene.debug)
                console.log("Stage 2");
            }else{
                pc--;
            }            
        }
        if(pc == 60)
        {   
            if(energy >= 3){
                if(e.scene.debug)
                console.log("Stage 3");
            }else{
                pc--;
            }            
        }
        if(pc >= 8){
            //movemos la flecha y la carga
            let i_mp = m.get("i_mp");
            var mouseDir = input.mouseCanvasPosition.clone().subtract(i_mp).normalize();
            let arrowT = e.scene.getEntity("arrow").getComponent(ComponentType.Transform);
            let chargeT = e.scene.getEntity("charge").getComponent(ComponentType.Transform);
            arrowT.rotation = mouseDir.horizontalAngleDeg();
            arrowT.position = t.position;
            chargeT.position = t.position;
        }
        m.set("press_count", pc+1);
    }

    if(input.getMouseUp(MouseButton.Left))
    {
        if(m.get("ready") === true)
        {
            if(e.scene.debug)
                console.log("Dash");             
            let i_mp = m.get("i_mp");
            let pc = m.get("press_count");
            let new_spd = spd;            
            let wastedEnergy = 1;
            /*
            if(pc > 60)
            {
                new_spd *= 2;
                wastedEnergy++;               
            }            
            if(pc > 30)
            {
                new_spd *= 1.5;
                wastedEnergy++;
            }*/
            let power = e.scene.getEntity("charge").getComponent(ComponentType.Sprite).image_index;
            console.log(power);
            if(power >= 36){
                new_spd *= 2;
                wastedEnergy++;
            }
            if(power >= 18){
                new_spd *= 1.5;
                wastedEnergy++;
            }
            if(wastedEnergy > 1){
                wasteEnergy(wastedEnergy);
            }            
            new_spd *= 5;
            k.speed = input.mouseCanvasPosition.clone().subtract(i_mp).normalize().multiply(Victor(new_spd, new_spd));
            t.rotation = k.speed.horizontalAngleDeg();
            e.scene.getEntity("arrow").addComponent(sprArrowNull.clone());
            e.scene.getEntity("charge").addComponent(sprChargeNull.clone());
        }
        else
        {   if(e.scene.debug)
                console.log("Slash");
            wasteEnergy(1);
            let draw = e.scene.sound_manager.getSound(snd_draw);
            draw.play();
        }
        m.set("press_count", 0);        
    }
    
    function wasteEnergy(value){
        let energy_ = m.get("energy");
        energy_ = clamp(energy-value, 1, 5);
        if(scene.debug){
            console.log("wasting energy "+value);
        }        
        m.set("energy", energy_);
        let memo = e.scene.getEntity("HUD-energy").getComponent(ComponentType.Behaviour).memory;
        memo.set("changed", true);
        memo.set("energy", energy_);
        setEnergyRec();        
    }
    // Lerp Speed
};

var uiLifeUpdate = (e, m) =>{
    let t = e.getComponent(ComponentType.Transform);
    let image_index = e.getComponent(ComponentType.Sprite).image_index;
    let scene_ = e.scene;
    t.position = (Victor(scene_.view_x + scene_.canvas_width - 32, scene_.view_y + scene_.canvas_height - 10));
    
    if(m.get("damaged") === true){
        e.getComponent(ComponentType.Sprite).setImageIndex(image_index+1);
        m.set("dmg_counter", 20);
        m.set("damaged", false);
    }   
    let count = m.get("dmg_counter");
    if(count > 0){
        if (count == 1){
            e.getComponent(ComponentType.Sprite).setImageIndex(image_index+1);
        }
        m.set("dmg_counter", count-1);
    }    
}

var uiEnergyUpdate = (e, m) =>{
    let energy = m.get("energy");
    let image_index = e.getComponent(ComponentType.Sprite).image_index;
    
    let t = e.getComponent(ComponentType.Transform);
    let scene_ = e.scene;
    t.position = (Victor(scene_.view_x + scene_.canvas_width - 8, scene_.view_y + scene_.canvas_height - 10));
    
    if(m.get("changed") === true){
        switch (energy){
            case 4: 
                e.getComponent(ComponentType.Sprite).setImageIndex(1);
                m.set("energy_counter", 15);
                break;   
            case 3: 
                e.getComponent(ComponentType.Sprite).setImageIndex(3);
                m.set("energy_counter", 15);
                break;     
            case 2: 
                e.getComponent(ComponentType.Sprite).setImageIndex(5);
                m.set("energy_counter", 15);
                break;  
            case 1: 
                if(image_index < 7){
                    e.getComponent(ComponentType.Sprite).setImageIndex(7);
                    m.set("energy_counter", 15);
                }else{
                    e.getComponent(ComponentType.Sprite).setImageIndex(9);
                    m.set("energy_counter", 15);
                }                
                break; 
            }        
        m.set("changed", false);
    }else{
        if(m.get("recover") === true){
        switch (energy){
            case 5: 
                e.getComponent(ComponentType.Sprite).setImageIndex(1);
                m.set("recovery_counter", 15);
                break;   
            case 4: 
                e.getComponent(ComponentType.Sprite).setImageIndex(3);
                m.set("recovery_counter", 15);
                break;     
            case 3: 
                e.getComponent(ComponentType.Sprite).setImageIndex(5);
                m.set("recovery_counter", 15);
                break;  
            case 2: 
                e.getComponent(ComponentType.Sprite).setImageIndex(7);
                m.set("recovery_counter", 15);
                break; 
            }        
        m.set("recover", false);
        } 
    }    

    let count = m.get("energy_counter");
    if(count > 0){
        if (count == 1){
            if(image_index != 9){
                e.getComponent(ComponentType.Sprite).setImageIndex(image_index+1);
            }else{
                e.getComponent(ComponentType.Sprite).setImageIndex(8);
            }            
        }
        m.set("energy_counter", count-1);
    }else{
        let countRec = m.get("recovery_counter");
        if(countRec > 0){
            if (countRec == 1){
                e.getComponent(ComponentType.Sprite).setImageIndex(image_index-1);
            }
            m.set("recovery_counter", countRec-1);
        }
    }  
}
//#endregion

var chargeUpdate = (e, m) =>{
    let s = e.getComponent(ComponentType.Sprite);
    if(s.image_speed == 0){
        return;
    }
    let image_index = s.image_index;
    let energy = e.scene.getEntity("nin").getComponent(ComponentType.Behaviour).memory.get("energy");    
    
    if(image_index == 8 && energy == 1){
        //no puede cargarse el dash más del nivel 1
        s.setImageIndex(5);
    }
    if(image_index == 21 && energy <= 2){
        //no puede cargarse el dash más del nivel 2
        s.setImageIndex(18);
    }
    if(image_index >= 39){
        //carga al nivel 3
        s.setImageIndex(36);
    }  
}

function loadLevel(level){
    let mar = scene.margin;
    let w = scene.width;
    let h = scene.height;
    //background
    loadBg();    
    let spritesPath = "assets/game/sprites/";    
    //Ninja
    var nin = new Entity("nin", scene, Tag.Player, new Transform(Victor(580, 360), 0, Victor(1, 1)));
    nin.addComponent(new SpriteD([spritesPath + "nin.png"], -0.5, Victor(-30, -20)));
    nin.addComponent(new Kinematic(new Victor(50, 0), new Victor(0, 0), new Victor(0, 0)));
    nin.addComponent(new RectCollider(30, 30, Victor(-15, -15, 0)));
    nin.addComponent(new Behaviour([ninCreate], [ninUpdate], []));
    scene.addEntity(nin);
    
    var shadow = new Entity("nin-shadow", scene, Tag.Default, new Transform(Victor(560, 340), 0, Victor(1, 1)));
    shadow.addComponent(new Sprite([spritesPath + "nin-shadow.png"], 0, Victor(-25, -15)));
    shadow.addComponent(new Behaviour([], [follow], [], new Map().set("target", "nin").set("smoothing", 1)));
    scene.addEntity(shadow);
    
    var arrow = new Entity("arrow", scene, Tag.Default, new Transform(Victor(0, 0), 0, Victor(1, 1)));
    arrow.addComponent(sprArrowNull.clone());
    scene.addEntity(arrow);
    
    var charge = new Entity("charge", scene, Tag.Default, new Transform(Victor(0, 0), 0, Victor(1, 1)));
    charge.addComponent(sprChargeNull.clone());
    charge.addComponent(new Behaviour([], [chargeUpdate], [],));
    scene.addEntity(charge);
    
    //Camara
    var cam = new Entity("camera", scene, Tag.Camera, new Transform(Victor(580, 360), 0, Victor(0.1, 0.1)));
    //cam.addComponent(new Sprite([spritesPath + "robola.png"], -2, Victor(0, 0)));
    cam.addComponent(new Behaviour([cameraCreate], [follow], []));
    scene.addEntity(cam);
    scene.setCamera(cam);
    
    scene.setInput(new Input(), ctx.canvas);
    // Sound    
    scene.setSoundManager(new SoundManager(sounds, sounds_to_load, ()=>{     
        scene.setVolume(musicVol, soundsVol, 100);
        let bso = scene.sound_manager.getSound(game_music);
        bso.loop = true;
        bso.play();  
    }));
    
    let uiLife = new Entity("HUD-life", scene, Tag.UI, new Transform(Victor(50, 0), 0, Victor(1, 1)));
    uiLife.addComponent(new Animation([spritesPath + "health1.png", spritesPath + "health2.png", spritesPath + "health3.png", spritesPath + "health4.png", spritesPath + "health5.png", spritesPath + "health6.png", spritesPath + "health7.png"], 0, -100, Victor(-20, -81)));
    uiLife.addComponent(new Behaviour([], [uiLifeUpdate], []));
    scene.addEntity(uiLife);
    
    let uiEnergy = new Entity("HUD-energy", scene, Tag.UI, new Transform(Victor(50, 0), 0, Victor(1, 1)));
    uiEnergy.addComponent(new Animation([spritesPath + "power1.png", spritesPath + "power2.png", spritesPath + "power3.png", spritesPath + "power4.png", spritesPath + "power5.png", spritesPath + "power6.png", spritesPath + "power7.png", spritesPath + "power8.png", spritesPath + "power9.png", spritesPath + "power10.png", spritesPath + "power11.png"], 0, -100, Victor(-20, -81)));
    uiEnergy.addComponent(new Behaviour([], [uiEnergyUpdate], [], new Map().set("energy", 5)));
    scene.addEntity(uiEnergy);
    
    let lvl = lvl1;
    if(level == 2){
        lvl = lvl2;
    }else if(level == 3){
        lvl = lvl3;
    }
    $.each(lvl, function(index, ent){
             if(ent.type == "nd"){                               
                createND(scene, Victor(40 * ent.x + mar, 40* ent.y + mar), ent.rot, Victor(ent.scaleX, ent.scaleY));
            }else if(ent.type == "dmg"){
                createDMG(scene, Victor(40 * ent.x + mar, 40* ent.y + mar), ent.rot, Victor(ent.scaleX, ent.scaleY));                
            }   
    });  
}

function createND(scene_, pos, rot, scale){
    let e = new Entity("b#"+randomId(), scene, Tag.Solid);
    e.addComponent(sprND.clone());
    e.addComponent(new Transform(pos, rot, scale));
    e.addComponent(col);
    scene_.addEntity(e); 
}

function createDMG(scene_, pos, rot, scale){
    let e = new Entity("dmg#"+randomId(), scene, Tag.Solid);
    e.addComponent(sprDMG.clone());
    e.addComponent(new Transform(pos, rot, scale));
    e.addComponent(col);
    scene_.addEntity(e); 
}

function loadBg(){
    let mar = scene.margin;
    let w = scene.width;
    let h = scene.height;
    let bg = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg.addComponent(new Sprite(["assets/game/textures/bg.png"], 1));
    bg.addComponent(new Transform(Victor(mar, mar)));
    scene.addEntity(bg);    
    //borders
    let bg2 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg2.addComponent(new Sprite(["assets/game/textures/bordeAncho0.png"], 0, Victor(-560, -10)));
    bg2.addComponent(new Transform(Victor(w/2, mar-10)));    
    bg2.addComponent(new RectCollider(1120, 20, Victor(-560, -10, 0)));
    scene.addEntity(bg2);
    let bg2b = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg2b.addComponent(new SpriteD(["assets/game/textures/bordeAncho1.png"], -2.5, Victor(-560, -30), true));
    bg2b.addComponent(new Transform(Victor(w/2, mar-20), 0, Victor(1, 1)));
    scene.addEntity(bg2b);
    
    let bg3 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg3.addComponent(new SpriteD(["assets/game/textures/bordeAncho0.png"], 0, Victor(-560, -10)));
    bg3.addComponent(new Transform(Victor(w/2, h-mar+10), 180));
    bg3.addComponent(new RectCollider(1120, 20, Victor(-560, -10, 0)));
    scene.addEntity(bg3);    
    let bg3b = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg3b.addComponent(new SpriteD(["assets/game/textures/bordeAncho1.png"], -2.5, Victor(-560, -30), true));
    bg3b.addComponent(new Transform(Victor(w/2, h-mar+20), 180, Victor(1, 1)));
    scene.addEntity(bg3b);
    
    let bg4 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg4.addComponent(new SpriteD(["assets/game/textures/bordeAlto0.png"], 0, Victor(-10, -340) ));
    bg4.addComponent(new Transform(Victor(mar-10, h/2)));
    bg4.addComponent(new RectCollider(20, 680, Victor(-10, -340)));
    scene.addEntity(bg4);
    let bg4b = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg4b.addComponent(new SpriteD(["assets/game/textures/bordeAlto1.png"], -2.5, Victor(-30, -340), false, true));
    bg4b.addComponent(new Transform(Victor(mar-4, h/2), 0, Victor(1, 1)));
    scene.addEntity(bg4b);
    
    let bg5 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg5.addComponent(new SpriteD(["assets/game/textures/bordeAlto0.png"], 0, Victor(-10, -340)));
    bg5.addComponent(new Transform(Victor(w-mar+10, h/2), 180));
    bg5.addComponent(new RectCollider(20, 680, Victor(-10, -340)));
    scene.addEntity(bg5);
    let bg5b = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg5b.addComponent(new SpriteD(["assets/game/textures/bordeAlto1.png"], -2.5, Victor(-30, -340), false, true));
    bg5b.addComponent(new Transform(Victor(w-mar+4, h/2), 180, Victor(1, 1)));
    scene.addEntity(bg5b);
    
    //corners
    let bg6 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg6.addComponent(new SpriteD(["assets/game/textures/corner0.png"], 0, Victor(-10, -10)));
    bg6.addComponent(new Transform(Victor(mar-10, mar-10), 90));
    scene.addEntity(bg6);
    let bg7 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg7.addComponent(new SpriteD(["assets/game/textures/corner0.png"], 0, Victor(-10, -10)));
    bg7.addComponent(new Transform(Victor(mar-10, h-mar+10), 0));
    scene.addEntity(bg7);
    let bg8 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg8.addComponent(new SpriteD(["assets/game/textures/corner0.png"], 0, Victor(-10, -10)));
    bg8.addComponent(new Transform(Victor(w-mar+10, mar-10), 180));
    scene.addEntity(bg8);
    let bg9 = new Entity("bg#"+randomId(), scene, Tag.Solid);
    bg9.addComponent(new SpriteD(["assets/game/textures/corner0.png"], 0, Victor(-10, -10)));
    bg9.addComponent(new Transform(Victor(w-mar+10, h-mar+10), 270));
    scene.addEntity(bg9);
}