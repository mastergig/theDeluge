var tempo    = 0; //tempo do jogo
var inimigos = 0; //numero de inimigos que passaram
var pontos   = 0; //numero de inimigos mortos
var energia  = 3; //vitalidade
var heroi    = "debug"; //nome do heroi
var pulando  = false; //se o jogador esta pulando, bug fix

function mudaAparencia(estado) //comportamento do heroi
{
    if(estado == "normal") water.className = "";
    else water.className = "nope";
    hero.className = heroi + " " + estado;
}

function tecla(evento, objeto)
{
    var keyCode = evento.keyCode || evento.which;

    if(keyCode == 32) //espaço
    {
        jumping(true);
    }
    
    if(keyCode == 80 || keyCode == 112)
    {
        pause(!paused);
    }

}

var minPos     = 75;    //posição teto
var maxPos     = 400;   //posição chão
var jump       = 150;   //tamanho do pulo
var jCount     = 0;     //contador de pulos
var maxJump    = 2;     //numero maximo de pulos
var gravidade  = 20;    //gravidade(?)
var tempoQueda = 0;     //tempo de queda
var pressed    = false; //fix do pulo
function jumping(keyboard)
{
    if(!pressed) if(!paused && !over) if(jCount < maxJump)
    {
        jCount += 1;
        var offset = hero.offsetTop; //posição atual y do heroi
        var pos = offset - jump;     //calculo do pulo
        if(pos < minPos) hero.style.top = minPos;
        else hero.style.top = pos;
        tempoQueda = 1;
        pressed = keyboard;
        mudaAparencia("pulando");
        playSound('Pulo.wav');
        pulando = true;
        setTimeout(function() { pulando = false; }, 90);
    }
}

function fixJump()
{
    pressed = false;
}

var paused = false; //se esta pausado
var over   = false; //se perdeu o jogo
function pause(valor)
{
    paused = valor;
    if(paused)
    {
        pauser.className ="yes";
        pauser.top = 0;
        pauser.left = 0;
    }
    else
    {
        pauser.className ="nope";
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function run() //executa variaveis do jogo
{
    if(tempo == 0) //inicia o jogo
    {
        try {
            heroi = getParameterByName("hero");
            mudaAparencia("normal");
        }
        catch(err) {
            heroi = "debug";
        }
    }
    if(!paused && !over)//se esta pausado, não executa
    {
        if(!pulando)
        {
            var offset = hero.offsetTop;
            var pos = tempoQueda * gravidade / 2;
            pos += offset;
            if(pos > maxPos)
            {
                hero.style.top = maxPos;
                tempoQueda = 1;
                jCount = 0;
                mudaAparencia("normal");
            }
            else
            {
                mudaAparencia("caindo");
                hero.style.top = pos;
                tempoQueda += 1;
            }
        }
        tempo += 1;

        if(tempo == 50) newEnemy();

        if(hasClass(enemyA, "vivo")) enemyPos("enemyA", false);
        if(hasClass(enemyB, "vivo")) enemyPos("enemyB", false);

        score.innerHTML = tempo + (pontos * 500);
    }
    setTimeout(run, 100); //roda apos n milisegundos
}

var enCounter = 0;
function newEnemy()
{
    var enemy;
    var nextEnemy = Math.floor((Math.random() * 1500) + 751);

    if(enCounter/2 == 0)
    { //par
        enemy = document.getElementById('enemyA');
        if(hasClass(enemy, "vivo")) enemy = document.getElementById('enemyB');
    }
    else
    { //impar
        enemy = document.getElementById('enemyB');
        if(hasClass(enemy, "vivo")) enemy = document.getElementById('enemyA');
    }

    if(!hasClass(enemy, "vivo")) //trata se o inimigo atual esta em jogo
    {
        enCounter += 1;
        var enemyKind = Math.floor((Math.random() * 16) + 1);
        
        enemy.className = enemyType(enemyKind);
        
        var enXY = enemyPos(enemy.id, true);
    }

    setTimeout(newEnemy, nextEnemy);
}

function enemyType(enemyKind)
{
    var retorno = "vivo ";
    switch(enemyKind)
    {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        retorno += "onda";
        break;
        case 6:
        case 7:
        retorno += "gas modeloA";
        break;
        case 8:
        case 9:
        case 10:
        retorno += "fridge";
        break;
        case 11:
        case 12:
        case 13:
        retorno += "fuscaAzul";
        break;
        case 14:
        case 15:
        case 16:
        retorno += "fuscaAmarelo";
        break;
    }
    return retorno;
}

function enemyPos(id, start)
{
    var object = document.getElementById(id); 
    if (start)
    {
        var posicao = [501, 501]; //0 = x; 1 = y
        if(hasClass(object, "onda")) posicao[1] = 375;
        if(hasClass(object, "gas")&&hasClass(object, "modeloA")) posicao[1] = 400;
        if(hasClass(object, "fridge")) posicao[1] = 425;
        if(hasClass(object, "fuscaAzul")) posicao[1] = 425;
        if(hasClass(object, "fuscaAmarelo")) posicao[1] = 425;

        object.style.left = posicao[0] + "px";
        object.style.top  = posicao[1] + "px";

        //if(hasClass(object, "gas")) playSound('gas.wav');
    }
    else
    {
        if(hasClass(object, "onda")) object.style.left = (object.offsetLeft - 30) + "px";
        if(hasClass(object, "gas")) object.style.left = (object.offsetLeft - 20) + "px";
        if(hasClass(object, "fridge")) object.style.left = (object.offsetLeft - 45) + "px";
        if(hasClass(object, "fuscaAzul")) object.style.left = (object.offsetLeft - 26) + "px";
        if(hasClass(object, "fuscaAmarelo")) object.style.left = (object.offsetLeft - 28) + "px";
    }
    if(!hasClass(object, "dead") && !start)
    {
        if(object.offsetLeft < (-object.offsetWidth)) 
        {
            if(!hasClass(object, "hit")) pontos++;
            object.className = "dead";
            inimigos++;
        }
    }
    if(!hasClass(object, "dead") && !hasClass(object, "hit")) enemyHit(id);
}

function enemyHit(id)
{
    var object = document.getElementById(id); 

    if((object.offsetLeft < (hero.offsetLeft + hero.offsetWidth)) && (hero.offsetLeft < (object.offsetLeft + (object.offsetWidth * 0.8 ))))
    {
        if(object.offsetTop < (hero.offsetTop + hero.offsetHeight))
        {
            object.className += " hit";
            if(hasClass(object, "onda")) playSound('Onda_dano.wav');
            if(!hasClass(object, "gas"))
            {
                if(energia == 0)
                {
                    over = true;
                    gamer.className ="yes";
                    setTimeout(gotoScore, 5000); //roda apos n milisegundos
                }
                else
                {
                    document.getElementById("gas"+energia).className = "nope";
                    energia--;
                }
            }
            else
            {
                if(energia < 3)
                {
                    energia++;
                    document.getElementById("gas"+energia).className = "yes";
                }
                object.className = "dead";
                pontos++;
                inimigos++;
            }
        }
    }
}

function gotoScore()
{
    window.location="score.html?score="+ (tempo + (pontos * 500));
}

function getParameterByName(name, url) {
    if (!url) {
    url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function escreveScore()
{
    var score = getParameterByName("score");
    body.innerHTML = "<br/>"+score+"<div id='rain'></div><a href='index.html'>Play Again</a>";
}

function playSound(fileName)
{
    var audio = new Audio('sfx/'+fileName);
    audio.play();
}

function openLink(qual)
{
    if(qual == 'hadard')
    {
        playSound('Haddad.wav');
    }
    else if(qual == 'dorian')
    {
        playSound('Dorian.wav');
    }
    else if(qual == 'zeka')
    {
        playSound('Zeca.wav');
    }
    setTimeout(function(){window.location = "game.html?hero="+qual;},3000);
}
