function computeIRR(cashflows, guess = 0.1) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const normalized = cashflows.map((cf) => ({
    date: new Date(
      cf.date.getFullYear(),
      cf.date.getMonth(),
      cf.date.getDate()
    ),
    amount: cf.amount,
  }));

  const t0 = normalized[0].date.getTime();
  let rate = guess;
  const maxIter = 1000;
  const tol = 1e-10;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;

    for (const { date, amount } of normalized) {
      const days = (date.getTime() - t0) / MS_PER_DAY;
      const frac = days / 365;
      const denom = Math.pow(1 + rate, frac);
      npv += amount / denom;
      dnpv += (-frac * amount) / (denom * (1 + rate));
    }

    if (Math.abs(npv) < tol) return rate * 100;

    const newRate = rate - npv / dnpv;
    if (!isFinite(newRate)) return null;
    if (Math.abs(newRate - rate) < tol) return newRate * 100;
    rate = newRate;
  }

  return rate * 100;
}

module.exports = { computeIRR };