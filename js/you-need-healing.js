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
var points = 0;

//#region Enums
class State extends Enum
{
    constructor(name)
    {
        super(name);
        this.classname = "State";
    }
}
State.Idle = new State("Idle");
State.Chase = new State("Chase");
State.Attack = new State("Shoot");
State.Surround = new State("Surround");
State.Wait = new State("Wait");

//resource variables
let sprND = new SpriteD(["assets/game/textures/cajaNoDestruible.png"], -1, Victor(-60, -60));      //sprite de los bloques normales
let sprCD = new AnimationD(["assets/game/textures/CajaDestruible1.png", "assets/game/textures/CajaDestruible2.png", "assets/game/textures/CajaDestruible3.png", "assets/game/textures/CajaDestruible4.png"],0 , -1, Victor(-50, -50));      //sprite del bloque destruible
let sprCD2 = new Sprite(["assets/game/textures/CajaDestruible4.png"], 0.5, Victor(-50, -50));      //sprite de los bloques normales
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
    "assets/game/sprites/charge_frames/charge40.png"], 0.5, 0, Victor(-50, -50));

//enemy Sprites
let offset = Victor(-20, -20);
let sprBolaA_S = new Sprite(["assets/game/sprites/enemys/robola-A/robolaS.png"], 0, offset);
let sprBolaA_Base = new SpriteD(["assets/game/sprites/enemys/robola-A/robola5.png"], -0.2, offset);
let sprBolaA_ruedas = new SpriteD(["assets/game/sprites/enemys/robola-A/robola4.png"], -0.4, offset);
let sprBolaA_armadura = new SpriteD(["assets/game/sprites/enemys/robola-A/robola3.png"], -0.6, offset);
let sprBolaA_cuello = new SpriteD(["assets/game/sprites/enemys/robola-A/robola2.png"], -0.9, offset);
let sprBolaA_cabeza = new SpriteD(["assets/game/sprites/enemys/robola-A/robola1.png"], -1, offset);
let sprBullet = new SpriteD(["assets/game/sprites/enemys/robola-A/bullet.png"], -0.5, Victor(-8, -8));

let col = new RectCollider(120, 120, Victor(-60, -60, 0));  //collider estandar de los bloques normales y daño
let colCD = new RectCollider(80, 80, Victor(-40, -40, 0));  //collider del bloque destruible

//#region Sonidos
var snd_draw = "assets/game/snd/sfx/nin/draw-1.ogg";
var snd_dmg = "assets/game/snd/sfx/nin/ktana_damage.wav";
var snd_death = "assets/game/snd/sfx/nin/ktana_death.wav";
var snd_robolaAttack = "assets/game/snd/sfx/enemies/RoboBolaA_attack.wav";
var snd_robolaDeath = "assets/game/snd/sfx/enemies/RoBolaA_death.wav";
var game_music = "assets/game/snd/music/boss.ogg";
var sounds_to_load = 
[
    game_music,
    snd_draw, 
    snd_dmg,
    snd_death,
    snd_robolaAttack,
    snd_robolaDeath
];
//#endregion

//#region AI
function positionToGrid(pos, grid_size, margin)
{
    return Victor(Math.floor((pos.x-margin)/grid_size.x), Math.floor((pos.y-margin)/grid_size.y));
}

function gridToPosition(grid_pos, grid_size, margin)
{
    return Victor(Math.floor(grid_pos.x * grid_size.x + grid_size.x/2 + margin), Math.floor(grid_pos.y * grid_size.y + grid_size.y/2 + margin));
}
var easystar = new EasyStar.js();
var activeLevel = lvl1Grid;
easystar.setGrid(lvl1Grid);
easystar.setAcceptableTiles([0]);
easystar.enableDiagonals();
easystar.disableCornerCutting();

easystar.setIterationsPerCalculation(200);
//#endregion

function gameOver(){
    scene.restart();
}

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
    points = 0;
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
        console.log(ranking[i])
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
        easystar.calculate();
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

    let pos_smoothing = m.has("pos_smoothing") ? m.get("pos_smoothing") : 1;
    let rot_smoothing = m.has("rot_smoothing") ? m.get("rot_smoothing") : 1;
    let t = e.getComponent(ComponentType.Transform);

    let target_pos = target.getComponent(ComponentType.Transform).position;
    let target_rot = target.getComponent(ComponentType.Transform).rotation;

    t.position = Victor(lerp(t.position.x, target_pos.x, pos_smoothing), lerp(t.position.y, target_pos.y, pos_smoothing));
    t.rotation = lerpAngle(t.rotation, target_rot, rot_smoothing);
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

var rayCast = (from, to, tag)=>
{

};

//intenta acercarse al personaje para dispararle
var robolaRangedAct = (e, m)=>
{
    let target = e.scene.getEntity(m.get("target"));
    if(target == null) 
        return;

    let t = e.getComponent(ComponentType.Transform);
    let k = e.getComponent(ComponentType.Kinematic);

    let t_t = target.getComponent(ComponentType.Transform);

    let shoot_dir;

    let head = e.scene.getEntity(m.get("cabeza"));
    head.getComponent(ComponentType.Transform).rotation = lerpAngle(head.getComponent(ComponentType.Transform).rotation, t_t.position.clone().subtract(t.position).horizontalAngleDeg(), 0.3);
    switch(m.get("state"))
    {
        case State.Surround:
            chase(e, m);
            if(t_t.position.clone().distance(t.position) < 160)
            {
                m.set("state", State.Shoot);
            }
            break;

        case State.Shoot:            
            shoot_dir = t_t.position.clone().subtract(t.position).horizontalAngleDeg();            
            k.speed = Victor(-10, 0).rotateByDeg(shoot_dir);
            let bolaShoot = e.scene.sound_manager.getSound(snd_robolaAttack);
            bolaShoot.play();
            createBala(Math.random()*10000, t.position.clone(), e.scene, shoot_dir, 200);

            m.set("state", State.Wait);
            m.set("wait_time", 50);
            break;

        case State.Wait:
            if(m.get("wait_time") <= 0)
                m.set("state", State.Surround);
            else
                m.set("wait_time", m.get("wait_time")-1);
    }
};

var lagartoAct = (e, m, dt)=>
{
    let target = e.scene.getEntity(m.get("target"));
    if(target == null)
        return;

    let t = e.getComponent(ComponentType.Transform);
    let k = e.getComponent(ComponentType.Kinematic);
    let c;
    let t_t = target.getComponent(ComponentType.Transform);

    let charge_dir;

    switch(m.get("state"))
    {
        case State.Chase:
            //console.log("chasing");
            chase(e, m);
            if(t_t.position.clone().distance(t.position) < 220)
            {
                console.log("CHARGE");
                m.set("state", State.Charge);
                charge_dir = t_t.position.clone().subtract(t.position).horizontalAngleDeg();
                k.speed = Victor(330, 0).rotateByDeg(charge_dir);
                t.rotation = charge_dir;
            }
            break;

        case State.Charge:
            //console.log("charging");
            c = e.scene.getEntity(m.get("collider_holder")).getComponent(ComponentType.Collider);

            if(c.placeMeeting(t.position.clone().add(k.speed.clone().multiply(Victor(dt, dt))), Tag.Solid, -1) !== null)
            {
                while(c.placeMeeting(t.position.clone().add(k.speed.clone().normalize().multiply(Victor(dt, dt))), Tag.Solid, -1) === null)
                {
                    t.position.add(k.speed.clone().normalize().multiply(Victor(dt, dt)));
                }               
                
                k.speed = Victor(0, 0);
                m.set("state", State.Wait);
                console.log("WAIT");
                m.set("wait_time", 80);
            }
            break;

        case State.Wait:
            //console.log("waiting");
            if(m.get("wait_time") <= 0)
            {
                m.set("state", State.Chase);
                console.log("CHASE");
            }
            else
            {
                m.set("wait_time", m.get("wait_time")-1);
                t.rotation = lerpAngle(t.rotation, t.rotation + Math.sin(m.get("wait_time")*0.01) * 120, 0.4);
            }
            break;
    }
};

var chase = (e, m)=>
{
    // Get variables
    let target = e.scene.getEntity(m.get("target"));
    if(target == null) 
        return;

    let t = e.getComponent(ComponentType.Transform);
    let k = e.getComponent(ComponentType.Kinematic);

    let pos_smoothing = m.has("pos_smoothing") ? m.get("pos_smoothing") : 1;
    let rot_smoothing = m.has("rot_smoothing") ? m.get("rot_smoothing") : 1;
    
    
    // Approach to next step
    let next_pos = m.has("next_pos") ? m.get("next_pos") : t.position;
    
    let next_speed = next_pos.clone().subtract(t.position).normalize().multiply(Victor(m.get("speed"), m.get("speed")));
    let next_rot = next_speed.clone().horizontalAngleDeg();
    
    t.rotation = lerpAngle(t.rotation, next_rot, rot_smoothing);

    k.speed = Victor(lerp(k.speed.x, next_speed.x, pos_smoothing), lerp(k.speed.y, next_speed.y, pos_smoothing));
    //k.speed = next_speed;
    //if(Math.random()>0.99) console.log(k.speed);
    
    // Find next point
    let target_position = target.getComponent(ComponentType.Transform).position.clone();
    let spd_to_add = 0;
    let aux;
    let aux_grid_pos;
    let past;

    switch(m.get("state"))
    {
        case State.Chase:
            target_position = Victor(clamp(target_position.x, e.scene.margin * 1.5, e.scene.width - e.scene.margin * 1.5), clamp(target_position.y, e.scene.margin * 1.5, e.scene.height - e.scene.margin * 1.5));
            break;
        
        case State.Surround:
            spd_to_add = target.getComponent(ComponentType.Kinematic).speed.clone().normalize().multiply(Victor(120, 120));
            aux = target_position.clone().add(spd_to_add);
            aux_grid_pos = positionToGrid(aux, Victor(40, 40), scene.margin);

            aux_grid_pos.x = clamp(aux_grid_pos.x, 0, activeLevel[0].length-1);
            aux_grid_pos.y  = clamp(aux_grid_pos.y, 0, activeLevel.length-1);

            while(activeLevel[aux_grid_pos.y][aux_grid_pos.x] === 1)
            {
                past = aux_grid_pos.clone();

                aux_grid_pos.x = clamp(aux_grid_pos.x + Math.sign(spd_to_add.x), 0, activeLevel[0].length - 1);
                aux_grid_pos.y  = clamp(aux_grid_pos.y + Math.sign(spd_to_add.y), 0, activeLevel.length - 1);

                if(aux_grid_pos.x == past.x && aux_grid_pos.y == past.y) 
                {
                    aux = target.getComponent(ComponentType.Transform).position.clone();
                    break;
                }
            }

            aux = gridToPosition(aux_grid_pos, Victor(40, 40), scene.margin);
            target_position = Victor(clamp(aux.x, scene.margin * 1.5, e.scene.width-scene.margin * 1.5), clamp(aux.y, scene.margin * 1.5, e.scene.height-scene.margin * 1.5));
            break;
    }
     
    let grid_target_pos = positionToGrid(target_position, Victor(40, 40), e.scene.margin);
    let grid_this_pos = positionToGrid(t.position, Victor(40, 40), e.scene.margin);
    
    easystar.findPath(grid_this_pos.x, grid_this_pos.y, grid_target_pos.x, grid_target_pos.y, (path)=>
    {
        if(path !== null && path[0] !== undefined)
        {
            m.set("next_pos", gridToPosition(path[1] !== undefined ? Victor(path[1].x, path[1].y) : Victor(path[0].x, path[0].y), Victor(40, 40), e.scene.margin));
        }
        return;
    });
};

var bullet = (e, m)=>
{
    let c = e.getComponent(ComponentType.Collider);
    let t = e.getComponent(ComponentType.Transform);
    if(c.placeMeeting(t.position, Tag.Solid, -1) != null)
        e.destroy();
};

//#region Nin
var ninCreate = (e, m) =>
{
    m.set("energy", 5);
    m.set("hp", 3);
    m.set("base_speed", 100);
    m.set("press_count", 0);
    m.set("iframes", 0);
};

var ninUpdate = (e, m) =>
{    
    // Params
    let dir = m.get("direction");
    let spd = m.get("base_speed");
    let energy = m.get("energy");
    let hp = m.get("hp");
    let iframes = m.get("iframes");
    
    // Input
    let input = e.scene.getInput();

    // Components
    let k = e.getComponent(ComponentType.Kinematic);
    let t = e.getComponent(ComponentType.Transform);
    let c = e.getComponent(ComponentType.Collider);

    let base_spd_w_dir = Victor(spd, 0).rotateBy(k.speed.horizontalAngle());
    let actualSpeed = k.speed.clone().multiply(Victor(gameLoop.dt, gameLoop.dt));
    let nextPosition = t.position.clone().add(actualSpeed);
    
    //check for collisions with solids
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
                if(dashing() >= 1 && obj[0].id.search("cd") != -1){         //comprobamos si es un bloque destruible y si estamos en un dash lo bastante potente
                    //destruimos el bloque
                    obj[0].removeComponent(ComponentType.Collider);
                    obj[0].getComponent(ComponentType.Sprite).image_speed = 0.2;
                }else{
                    k.speed = reflect(k.speed.clone(), coll[1]);
                    t.rotation = k.speed.horizontalAngleDeg();
                }                
            }
            if(e.scene.debug){
                console.log("collision with " + obj[0].id);
                console.log("normal "+coll[1]);
            }
            if(obj[0].id.search("dmg") != -1){
                //el objeto es una caja dañina                
                doDamage(hp-1);
            }
        }
    
    k.speed = Victor(lerp(k.speed.x, base_spd_w_dir.x, 0.1), lerp(k.speed.y, base_spd_w_dir.y, 0.1));    
    
    //check for collisions with enemys
    obj = c.placeMeeting(nextPosition, Tag.Enemy, -1);
    if(obj != null){
        //colision con enemigos
        if(obj[0].id.search("bullet") != -1){
            //destruimos la bala
            obj[0].destroy();
        }
        let dashPower = dashing();
        if(dashPower == 0){
            //daño personaje
            if(iframes == 0){
                console.log("colision con "+obj[0].id)
                doDamage(hp-1);
                m.set("iframes", 90);                
            }            
        }else{
            //daño a enemigo
            if(obj[0].id.search("robola") != -1){
                //enemigo robola
                let arrayEnt = obj[0].getComponent(ComponentType.Behaviour).memory.get("ent_array");
                for(let i = 0; i < arrayEnt.length; i++){
                    e.scene.getEntity(arrayEnt[i]).destroy();
                }
                obj[0].destroy();
                let bolaDeath = e.scene.sound_manager.getSound(snd_robolaAttack);
                bolaDeath.play();
            }
        }        
    }
    
    if(input.getMouseDown(MouseButton.Left))
    {
        m.set("i_mp", input.mouseCanvasPosition);
        m.set("ready", false);      
        e.scene.getEntity("charge").addComponent(sprCharge.clone());
    }

    if(input.getMousePressed(MouseButton.Left))
    {
        
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
        {   
            e.scene.getEntity("charge").addComponent(sprChargeNull.clone());
            if(e.scene.debug)
                console.log("Slash");
            wasteEnergy(1);
            let draw = e.scene.sound_manager.getSound(snd_draw);
            draw.play();
        }
        m.set("press_count", 0);        
    }
    
    if(iframes > 0){
        m.set("iframes", iframes-1);
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
    
    function dashing(){        
        if(k.speed.magnitude() >= spd * 10)
            return 3;
        if(k.speed.magnitude() >= spd * 4)
            return 2;
        if(k.speed.magnitude() >= spd * 3)
            return 1;
        return 0;
    }
    
    function doDamage(value){
        console.log("dañado");
        let dmg = e.scene.sound_manager.getSound(snd_dmg);
        dmg.play();
        let newHp = hp - value;        
        m.set("hp", newHp);
        scene.getEntity("HUD-life").getComponent(ComponentType.Behaviour).memory.set("damaged", true);
        if(newHp <= 0){
            //TODO implementar metodo gameOver
            gameOver();
        }
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
        m.set("recovery_counter", 0);
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
    // Input
    let input = e.scene.getInput();
    let t = e.getComponent(ComponentType.Transform);
    let image_index = s.image_index;
    let ninMem = e.scene.getEntity("nin").getComponent(ComponentType.Behaviour).memory;
    let energy = ninMem.get("energy");  
    
    let i_mp = ninMem.get("i_mp");
    var mouseDir = input.mouseCanvasPosition.clone().subtract(i_mp).normalize();
    let arrowT = e.scene.getEntity("arrow").getComponent(ComponentType.Transform);
    let ninT = e.scene.getEntity("nin").getComponent(ComponentType.Transform);
    arrowT.rotation = mouseDir.horizontalAngleDeg();
    arrowT.position = t.position;
    t.position = ninT.position;
    
    if(image_index == 8 && ninMem.get("ready") !== true){
            e.scene.getEntity("arrow").addComponent(sprArrow.clone());
            ninMem.set("ready", true);
        }    
    
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

var breakBoxUpdate = (e, m) =>{
    let s = e.getComponent(ComponentType.Sprite);
    if(s.image_speed == 0){
        return;
    }
    let image_index = s.image_index;
    if(image_index == 3){
        s.image_speed = 0;
        e.addComponent(sprCD2);
        e.scene.addToRun(e);
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
    nin.addComponent(new SpriteD([spritesPath + "nin.png"], -1.4, Victor(-30, -20)));
    nin.addComponent(new Kinematic(new Victor(50, 0), new Victor(0, 0), new Victor(0, 0)));
    nin.addComponent(new RectCollider(30, 30, Victor(-15, -15, 0)));
    nin.addComponent(new Behaviour([ninCreate], [ninUpdate], []));
    scene.addEntity(nin);
    
    var shadow = new Entity("nin-shadow", scene, Tag.Default, new Transform(Victor(560, 340), 0, Victor(1, 1)));
    shadow.addComponent(new Sprite([spritesPath + "nin-shadow.png"], 0, Victor(-30, -20)));
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
    
    createRobolaRanged(randomId(), Victor(400, 400, 0), 0, Victor(1,1), scene);
    createRobolaRanged(randomId(), Victor(100, 100, 0), 0, Victor(1,1), scene);
    createRobolaRanged(randomId(), Victor(600, 600, 0), 0, Victor(1,1), scene);
    createRobolaRanged(randomId(), Victor(600, 200, 0), 0, Victor(1,1), scene);
    createRobolaRanged(randomId(), Victor(600, 600, 0), 0, Victor(1,1), scene);
    
    let lvl = lvl1;
    activeLevel = lvl1Grid;
    easystar.setGrid(lvl1Grid);
    if(level == 2){
        lvl = lvl2;
        activeLevel = lvl2Grid;
        easystar.setGrid(lvl2Grid);
    }else if(level == 3){
        lvl = lvl3;
        activeLevel = lvl3Grid;
        easystar.setGrid(lvl3Grid);
    }
    $.each(lvl, function(index, ent){
             if(ent.type == "nd"){                               
                createND(scene, Victor(40 * ent.x + mar, 40* ent.y + mar), ent.rot, Victor(ent.scaleX, ent.scaleY));
            }else if(ent.type == "dmg"){
                createDMG(scene, Victor(40 * ent.x + mar, 40* ent.y + mar), ent.rot, Victor(ent.scaleX, ent.scaleY));                
            }else if(ent.type == "d"){
                createD(scene, Victor(40 * ent.x + mar, 40* ent.y + mar), ent.rot, Victor(ent.scaleX, ent.scaleY));                
            }    
    });  
}

function createND(scene_, pos, rot, scale){
    let e = new Entity("nd#"+randomId(), scene, Tag.Solid);
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

function createD(scene_, pos, rot, scale){
    let e = new Entity("cd#"+randomId(), scene, Tag.Solid);
    e.addComponent(sprCD.clone());
    e.addComponent(new Transform(pos, rot, scale));
    e.addComponent(colCD.clone());
    e.addComponent(new Behaviour([],[breakBoxUpdate],[]));
    scene_.addEntity(e); 
}

let createRobolaRanged = (id, pos, rot, scale, scene_) =>
{
    let offset = Victor(-20, -20);

    let robolaSombra = new Entity("robola_shadow#"+id, scene_, Tag.Enemy, new Transform(pos, rot, scale));
    robolaSombra.addComponent(sprBolaA_S.clone());
    robolaSombra.addComponent(new Behaviour([], [robolaRangedAct], [], new Map().set("target", "nin").set("pos_smoothing", 1).set("rot_smoothing", 1).set("speed", 100).set("state", State.Surround).set("cabeza", "robola_cabeza#"+id).set("ent_array", ["robola_base#"+id, "robola_ruedas#"+id, "robola_armadura#"+id, "robola_cuello#"+id, "robola_cabeza#"+id])));
    robolaSombra.addComponent(new Kinematic(new Victor(32, 18), new Victor(0, 0), new Victor(0, 0)));
    robolaSombra.addComponent(new RectCollider(40, 40, offset));

    let robolaBase = new Entity("robola_base#"+id, scene_);
    robolaBase.addComponent(sprBolaA_Base.clone());
    robolaBase.addComponent(new Behaviour([], [follow], [], new Map().set("target", "robola_shadow#"+id)));
    
    let robolaRuedas = new Entity("robola_ruedas#"+id, scene_);
    robolaRuedas.addComponent(sprBolaA_ruedas.clone());
    robolaRuedas.addComponent(new Behaviour([], [follow], [], new Map().set("target", "robola_base#"+id)));
    
    let robolaArmadura = new Entity("robola_armadura#"+id, scene_);
    robolaArmadura.addComponent(sprBolaA_armadura.clone());
    robolaArmadura.addComponent(new Behaviour([], [follow], [], new Map().set("target", "robola_cuello#"+id).set("rot_smoothing", 0.5)));

    let robolaCuello = new Entity("robola_cuello#"+id, scene_);
    robolaCuello.addComponent(sprBolaA_cuello.clone());
    robolaCuello.addComponent(new Behaviour([], [follow], [], new Map().set("target", "robola_cabeza#"+id).set("rot_smoothing", 0.3)));

    let robolaCabeza = new Entity("robola_cabeza#"+id, scene_);
    robolaCabeza.addComponent(sprBolaA_cabeza.clone());
    robolaCabeza.addComponent(new Behaviour([], [follow], [], new Map().set("target", "robola_ruedas#"+id).set("rot_smoothing", 0)));

    scene_.addEntity(robolaSombra);
    scene_.addEntity(robolaBase);
    scene_.addEntity(robolaRuedas);
    scene_.addEntity(robolaCabeza);
    scene_.addEntity(robolaCuello);
    scene_.addEntity(robolaArmadura);
};

let createBala = (id, pos, scene, rot, speed) =>
{
    let c = new Entity("bullet#"+ id, scene, Tag.Enemy);
    c.addComponent(sprBullet.clone());
    c.addComponent(new Transform(pos, rot, Victor(1, 1)));
    c.addComponent(new Kinematic(Victor(speed, 0).rotateByDeg(rot), Victor(0, 0), Victor(0, 0)));
    c.addComponent(new RectCollider(-8, -8));
    c.addComponent(new Behaviour([], [bullet], []));
    scene.addToRun(c);
};

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