'use strict';

//inicia el plugin para traduciones i18next
function init_i18n(){
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
      lng: 'es',
      debug: true,
      resources: {
        es: {
          translation: {
            "1_jugador": "1 Jugador",
            "2_jugadores": "2 Jugadores",
            "creditos": "Créditos",
            "ajustes": "Ajustes",
            "lenguaje": "Lenguaje seleccionado: ",
            "volumen_musica": "Volumen de la Música:",
            "volumen_efectos": "Volumen de Efectos:",
          }
        },
        en: {
          translation: {
            "1_jugador": "1 Player",
            "2_jugadores": "2 Players",
            "creditos": "Credits",
            "ajustes": "Settings",
            "lenguaje": "Language selected: ",     
            "volumen_musica": "Music volume:",
            "volumen_efectos": "Effects volume:",
          }
        },
        fr: {
          translation: {
            "1_jugador": "1 Joueur",
            "2_jugadores": "2 Joueurs",
            "creditos": "Crédits",
            "ajustes": "Configuration",
            "lenguaje": "Langue sélectionnée: ",              
          }
        },
        de: {
          translation: {
            "1_jugador": "1 Spieler",
            "2_jugadores": "2 Spieler",
            "creditos": "Kredite",
            "ajustes": "Konfiguration",
            "lenguaje": "Ausgewählte Sprache: ",              
          }
        },
        it: {
          translation: {
            "1_jugador": "1 Giocatore",
            "2_jugadores": "2 giocatori",
            "creditos": "Crediti",
            "ajustes": "Configuración",
            "lenguaje": "Lingua selezionata: ",              
          }
        }
          
      }
    }, function(err, t) {
      // init set content
      updateContent();
    });
}

function updateContent() {
    var valores = $(".traducible");
    for(var i = 0; i < valores.length; i++){
        var item = valores[i];
        item.innerHTML = i18next.t(item.title);
    }
    //cambia el texto para mostrar el lenguaje seleccionado
    $("#lang").html(i18next.language);
}

function changeLng(lng) {
  i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
  updateContent();
});

function toggleSettings(){
    var actualState = $("#settings-window").css("display");
    actualState = actualState == "none"? false: true;
    console.log(actualState);
    if(!actualState){
        $("#settings-window").css({"display": "block"});
    }else{
        $("#settings-window").css({"display": "none"});
    }
}

$(function(){
    init_i18n();    
    
    $("#settings-button").click(toggleSettings);
    $("#settings-close-button").click(toggleSettings);
})