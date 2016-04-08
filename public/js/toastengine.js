//Variables de connection et Variables globales
var socket = io.connect();
var tabListToastsLoop = [];

//Fonctions d'update des Titres

function updateTitle(id) {
    var duration = parseInt(document.getElementById("duration"+id+"").value, 10) || undefined;
    socket.emit('setNewTitle', { text : document.getElementById("title"+id+"").value, timeout: duration});
}

function updateTitleLoop(paramTitle, paramDuration) {
    socket.emit('setNewTitle', { text : paramTitle, timeout: paramDuration});
}

//Fonctions de boucles
function loopToasts(LastToast,loopEnd){
    
    for (i=0;i<=LastToast;i++){

        var paramTitle = tabListToastsLoop[i][1];
        var paramDuration = tabListToastsLoop[i][2];
        
        function toastTimer(Input){
            var nextToast = Input + 4
            return nextToast + 4;
        }
        
        window.setTimeout(updateTitleLoop(paramTitle,paramDuration), new toastTimer(paramDuration));
        //retour au premier toast si on arrive à la fin du tableau
    }
    while (Date.now().getTime() < loopEnd){
        loopToasts(LastToast, loopEnd)
    }
}
function configLoopToasts(LoopDuration){
    //récupération du nombre de toast dans l'array, retranche 1 car array start à 0
    toastNumbers = tabListToastsLoop.length - 1;
    //Point d'arrivée de la boucle
    var loopEnd = new Date().getTime() + (LoopDuration * 1000);
    //Si le nombre de toast en boucle n'est pas nul
    if (toastNumbers != 0){
    //Création du Scénarion de boucle,
        //Déclaration du timer et de la fonction de boucle
        var timeoutID;
        
        var LastToast = toastNumbers;
        //mise en variable du nombre de toast à afficher
        loopToasts(LastToast, loopEnd)
    }
    else{
        window.alert("Aucun toast sélectionné !");
    }
}
function updateLoopList() {
//Prépare la liste des toast qui seront affichés dans la boucle
    //remise à 0 du tableau qui contient les toasts
    tabListToastsLoop = [];
    //Nombre total de toast sur la page
    var x = 5;
    
    //Boucle qui check chaque toast et regarde si la coche "loop" est cochée
    for (i=1;i<=x;i++){
        var check = false;
        //mise en variable de la valeur de loop
        check = document.getElementById("loop"+i+"").checked;
        //SI les checkers sont à true
        if (check == true) {
            //Enregistre le titre et la durée
            var toastTitle = document.getElementById("title"+i+"").value;
            var toastduration = document.getElementById("duration"+i+"").value;
            //Ordre, Titre et Durée intégrée dans l'array de boucle
            var toastNumbers = tabListToastsLoop.length
            tabListToastsLoop[toastNumbers] = [i,toastTitle,toastduration];
        } 
    }
    //MàJ terminée, passage à la configuration de la boucle
    configLoopToasts(document.getElementById("durationloop").value);
}

//Fonctions futures
function addLayout() {
    //
}
function changeImage() {
    //
}