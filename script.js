document.getElementById('authForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!users[email]) {
    users[email] = {
      password,
      walletId: 'WALLET-' + Date.now(),
      balance: { BTC: 0, ETH: 0, LTC: 0, USDT: 0, BNB: 0 },
      transactions: []
    };
    if (email === 'theresamatt009@gmail.com') {
      users[email].balance = { BTC: 250, ETH: 2000, LTC: 100000, USDT: 0, BNB: 0 };
    }
  }

  if (users[email].password === password) {
    localStorage.setItem('currentUser', email);
    localStorage.setItem('users', JSON.stringify(users));
    location.href = 'dashboard.html';
  } else {
    alert('Incorrect password');
  }
});
