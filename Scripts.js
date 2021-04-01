/* 
OBS: o código não está 100%
Eu sei que os nomes das variaveis estão pessimos

Próximas Atualizações: Dêem dicas para atualizar
- Um botão para reiniciar
- Randomizar a primeira jogada
- Por CSS
*/



var button = document.getElementsByTagName("input")
var res = document.getElementById('res')
var vez = document.getElementById('vez')
var button_Reset = document.getElementById('button_Reset')
var move = Array()
var win = false
var draw = 0
var counter = 0

vez.innerHTML = `[ X ] Começa`

for (let i = 0; i < 9; i++) {

    button[i].addEventListener('click', () => {
        move = jogada(counter)

        if (win == false && button[i].value == ' ') {
            vez.innerHTML = `Agora é [ ${move == "X" ? "O": "X"} ]`

            button[i].value = move

            counter++

            if (counter >= 5) {

                let result = verSeGanhou(move, button)

                if (result == 'Vitoria') {

                    res.innerHTML = `${move} - Ganhou!`
                    vez.innerHTML = 'FIM'
                    win = true
                    mostra_button_Reset(button_Reset)

                } else if (result == 'Continua') {

                    res.innerHTML = ''

                } else {

                    res.innerHTML = `Deu Empate!`
                    mostra_button_Reset(button_Reset)

                }
            }
        }

    })
}

button_Reset.addEventListener('click', () => {
    button_Reset.style.display = 'none'
    counter = draw = 0
    vez.innerText = '[ X ] - Começa'
    res.innerText = ''
    win = false

    for (let i = 0; i < 9; i++) {

        button[i].value = ' '

    }
})

function jogada(counter) {
    if (counter % 2 == 0) {
        return "X"
    } else {
        return "O"
    }
}

function verSeGanhou(move, button) {
    let counter = 0
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

        counter = 0

        for (let inde = 0; inde < wins[ind].length; inde++) {

            if (button[wins[ind][inde]].value == move) {

                counter++

                if (counter == 3) {
                    return 'Vitoria'
                }
            }
        }

    }

    draw++

    if (draw == 5) {

        return 'Emapte'

    }

    return 'Continua'

}


function mostra_button_Reset(button_Reset) {

    if (button_Reset.style.display == 'none') {
        document.getElementById('button_Reset').style.display = 'block'
    }

}