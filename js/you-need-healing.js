function toggleSettings(){    
    var actualState = $("#settings-window").css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".main-menu"), !actualState);
    toggledisplay($("#settings-window"), !actualState);
}

function toggleLevels(){
    var actualState = $("#level-window").css("display");
    actualState = actualState == "none"? false: true;
    changeButtonsState($(".main-menu"), !actualState);
    toggledisplay($("#level-window"), !actualState);
}

function changeButtonsState(container, newState){
    let items = container.children("button");
    for(var i = 0; i < items.length; i++){
        var item = items[i];
        item.disabled = newState;            
    }
}

//cambia la visibilidad de un objeto (referenciado con el selector de jquery)
function toggledisplay(item, newState){
    if(newState){
        item.css({"display": "block"});
    }else{
        item.css({"display": "none"});
    }
}

$(function(){
    init_i18n();    
    
    $("#settings-button").click(toggleSettings);
    $("#settings-close-button").click(toggleSettings);
    
    $("#1player-button").click(toggleLevels);
    $("#level-close-button").click(toggleLevels);
})