/* 
OBS: o código não está 100%
Eu sei que os nomes das variaveis estão pessimos

Próximas Atualizações: Dêem dicas para atualizar
- Um botão para reiniciar
- Randomizar a primeira jogada
- Por CSS
*/



const buttons = document.getElementsByTagName("input")
const res = document.getElementById('res')
const vez = document.getElementById('vez')
const button_Reset = document.getElementById('button_Reset')
let move = ''
let win = false
let draw = 0
let counter_play = 0

vez.innerHTML = `[ X ] Começa`

for (const button of buttons) {

    button.addEventListener('click', () => {
        move = jogada(counter_play)

        if (!win && button.value === ' ') {
            vez.innerHTML = `Agora é [ ${move === "X" ? "O": "X"} ]`

            button.value = move

            counter_play++

            if (counter_play >= 5) {

                let result = verSeGanhou(move, buttons)

                if (result === 'Vitoria') {

                    res.innerHTML = `${move} - Ganhou!`
                    vez.innerHTML = 'FIM'
                    win = true
                    mostra_button_Reset(button_Reset)

                } else if (result === 'Continua') {

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
    counter_play = draw = 0
    vez.innerText = '[ X ] - Começa'
    res.innerText = ''
    win = false

    for (const button of buttons) {

        button.value = ' '

    }
})

function jogada(_counter) {
    if (_counter % 2 === 0) {
        return "X"
    } else {
        return "O"
    }
}

function verSeGanhou(_move, _buttons) {
    console.log(_buttons);
    let counter_possibility = 0
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

    for (const possibility of wins) {
        
        counter_possibility = 0

        for (const index of possibility) {

            if (_buttons[index].value === _move) {

                counter_possibility++

                if (counter_possibility === 3) {
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


function mostra_button_Reset(_button_Reset) {

    if (_button_Reset.style.display == 'none') {
        document.getElementById('button_Reset').style.display = 'block'
    }

}