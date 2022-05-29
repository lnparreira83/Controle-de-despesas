const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


let transactions = [
    // {
    //     "id": "1",
    //     "name": "Bolo de brigadeiro",
    //     "amount": -10.00,
    // },
    // {
    //     "id": "2",
    //     "name": "Salario",
    //     "amount": 300.00,
    // },
    // {
    //     "id": "3",
    //     "name": "Torta de frango",
    //     "amount": -10.00,
    // },
    // {
    //     "id": "4",
    //     "name": "Violão",
    //     "amount": 150.00,
    // },
]

const localStorageTransaction = JSON.parse(localStorage.getItem('transactions'))

transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : []

const removeTransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id)
    init()
    updateLocalStorage()
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
     ${transaction.name} 
     <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
     </button>
     `
    transactionUl.appendChild(li)

}

function getExpenses() {
    const transactionsAmounts = transactions.map(transaction => transaction.amount)
    const total = transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)
    const income = transactionsAmounts.filter(transaction => transaction > 0).reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)
    const expense = transactionsAmounts.filter(transaction => transaction < 0).reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)
    return { total, income, expense }
}

const updateBalanceValues = () => {
    const { total, income, expense } = getExpenses()

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`

}

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}


init();

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName.length === 0 || transactionAmount.length === 0
    if (isSomeInputEmpty) {
        alert('Preencha todos os campos')
        return
    }

    addToTrasctionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
});



function cleanInputs() {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

function addToTrasctionsArray(transactionName, transactionAmount) {
    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    }

    transactions.push(transaction)
}
