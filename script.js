let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const list = document.getElementById("transactionList");
const balance = document.getElementById("balance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const form = document.getElementById("transactionForm");

function updateTransaction(filtered = transactions) {
  list.innerHTML = "";
  let income = 0, expense = 0;

  filtered.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = `flex justify-between p-2 rounded ${t.amount < 0 ? 'bg-red-100' : 'bg-green-100'}`;
    li.innerHTML = `
      <span>${t.desc} - <strong>$${t.amount.toFixed(2)}</strong></span>
      <div class="space-x-2">
       <button onclick="editTransaction(${index})" class="text-blue-500">
  <i class="fas fa-edit mr-1"></i>
</button>

        <button onclick="deleteTransaction(${index})" class="text-red-500">
     <i class="fas fa-trash-alt mr-1"></i>
        </button>
      </div>
    `;

    list.appendChild(li);

    if (t.amount >= 0) income += t.amount;
    else expense += t.amount;
  });

  totalIncome.textContent = `$${income.toFixed(2)}`;
  totalExpense.textContent = `$${Math.abs(expense).toFixed(2)}`;
  balance.textContent = `$${(income + expense).toFixed(2)}`;

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  transactions.push({ desc, amount });
  form.reset();
  updateTransaction();
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateTransaction();
}

function editTransaction(index) {
  const t = transactions[index];
  document.getElementById("desc").value = t.desc;
  document.getElementById("amount").value = t.amount;
  deleteTransaction(index);
}

// Filter

document.querySelectorAll("input[name='filter']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const type = radio.value;
    if (type === "all") updateTransaction();
    else updateTransaction(transactions.filter(t => type === "income" ? t.amount >= 0 : t.amount < 0));
  });
});

updateTransaction();