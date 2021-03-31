/* 
OBS: o código não está 100%
Eu sei que os nomes das variaveis estão pessimos

Próximas Atualizações: Dêem dicas para atualizar
- Um botão para reiniciar
- Randomizar a primeira jogada
- Por CSS
*/



var btn = document.getElementsByTagName("input")
var res = document.getElementById('res')
var vez = document.getElementById('vez')
var rest = document.getElementById('rest')
vez.innerHTML = `[ X ] Começa`
var id = null
var jogadaXO = Array()
var win = false
var empate = 0


for (let i = 0; i < 9; i++) {

    var cont = 0
    btn[i].addEventListener('click', () => {
        jogadaXO = jogada(cont)
        id = Number(btn[i].id.toString().slice(-1)) - 1


        //Adiciona valores nos btn
        if (win == false && btn[i].value == ' ') {
            vez.innerHTML = `Agora é [ ${jogadaXO == "X" ? "O": "X"} ]`

            btn[i].value = jogadaXO

            cont++

            // Verifica se houve um ganhado aparti da 5 jogada
            if (cont >= 5) {

                var resultado = verSeGanhou(jogadaXO, btn)

                if (resultado == 'Vitoria') {

                    res.innerHTML = `${jogadaXO} - Ganhou!`
                    vez.innerHTML = 'FIM'
                    win = true
                    mostra_Btn_Rest(rest)

                } else if (resultado == 'Continua') {

                    res.innerHTML = ''

                } else {

                    res.innerHTML = `Deu empate!`
                    mostra_Btn_Rest(rest)

                }
            }
        }


    })
}

// Reseta tuda para uma nova partida!
rest.addEventListener('click', () => {
    rest.style.display = 'none'
    cont = empate = 0
    vez.innerText = '[ X ] - Começa'
    res.innerText = ''
    win = false

    for (let i = 0; i < 9; i++){

        btn[i].value = ' '

    }

})

//define se quem vai jogar
function jogada(cont) {
    if (cont % 2 == 0) {
        return "X"
    } else {
        return "O"
    }
}

function verSeGanhou(jogadaXO, btn) {
    let cont = 0
    let wins = [ //são todas as possibilidades de vitorias
        // 0 - Linahs

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // 1 - Colunas

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // 2 - Diagonais

        [0, 4, 8],
        [2, 4, 6]

    ]

    for (let ind = 0; ind < wins.length; ind++) {

        cont = 0

        for (let inde = 0; inde < wins[ind].length; inde++) {

            if (btn[wins[ind][inde]].value == jogadaXO) {

                cont++
                
                if (cont == 3) {
                    return 'Vitoria'
                }
            }
        }

    }

    empate++
    
    if (empate == 5) {

        return 'Emapte'

    }

    return 'Continua'

}

function mostra_Btn_Rest(rest) {

    if (rest.style.display == 'none') {
        document.getElementById('rest').style.display = 'block'
    }
    
}