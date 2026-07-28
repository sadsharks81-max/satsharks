# Exponential Equations & Modeling — Solutions

**35 Questions | Full Step-by-Step Solutions**

---

## Question 1 🟢
**Correct Answer: B) 15%**

**Step-by-step:**
The function is f(x) = 640(0.85)^x. In an exponential decay model y = a(1 − r)^x, the base (1 − r) = 0.85, so r = 0.15 = 15%.

**Why other options are wrong:**
- A) 0.85% — confuses the base with the rate.
- C) 85% — this is the retention rate (what's left), not the decrease.
- D) 640% — this is the initial value, not a rate.

🪤 TRAP ALERT: The most common trap is choosing C (85%). Students confuse "retains 85%" with "loses 85%." The question asks for the decrease, which is 100% − 85% = 15%.

💡 KEY INSIGHT: In y = a(b)^x, if b < 1, the percent decrease = (1 − b) × 100%.

⚡ FAST METHOD: Subtract the base from 1: 1 − 0.85 = 0.15 → 15%.

📱✍️ VERDICT: Hand-solve — this is a direct reading/interpretation question; Desmos adds no value.

---

## Question 2 🟢
**Correct Answer: B) P(t) = 4,200(1.07)^t**

**Step-by-step:**
"Increases by 7%" means the growth factor is 1 + 0.07 = 1.07. The initial population is 4,200. So P(t) = 4,200(1.07)^t.

**Why other options are wrong:**
- A) Uses 0.07 as the base — this models something shrinking toward 0 rapidly.
- C) Uses 7 as the base — this is absurd growth (700% per year).
- D) This is linear, not exponential.

🪤 TRAP ALERT: D is designed for students who confuse linear and exponential growth. A constant percent increase is exponential, not y = mx + b.

💡 KEY INSIGHT: "Increases by r%" → multiply by (1 + r/100) each period.

⚡ FAST METHOD: 7% increase → base = 1.07. Only B has 1.07 as the base.

📱✍️ VERDICT: Hand-solve — pure conceptual; no calculation needed.

---

## Question 3 🟢
**Correct Answer: B) There were 18 downloads when the app was released.**

**Step-by-step:**
In h(x) = 18(5)^x, when x = 0: h(0) = 18(5)^0 = 18(1) = 18. The coefficient is the initial value.

**Why other options are wrong:**
- A) "Increases by 18 each week" describes linear growth, not exponential.
- C) Misidentifies the roles of 18 and 5.
- D) Reverses the roles entirely.

🪤 TRAP ALERT: A is tempting for students who default to linear thinking. In exponential models, the coefficient is always the starting value, not the rate of change.

💡 KEY INSIGHT: In y = a·b^x, a = initial value (when x = 0), b = growth factor.

⚡ FAST METHOD: Plug in x = 0 to confirm: 18 · 5^0 = 18.

📱✍️ VERDICT: Hand-solve — interpretation only, no computation.

---

## Question 4 🟡
**Correct Answer: C) C(t) = 200(2)^(t/5)**

**Step-by-step:**
Doubles → growth factor = 2. Every 5 hours → the exponent should equal 1 when t = 5. Check: t/5 = 5/5 = 1. So after 5 hours: 200(2)^1 = 400. ✓

**Why other options are wrong:**
- A) 200(2)^(5t): When t = 5, exponent = 25, giving 200 × 2^25 ≈ 6.7 billion. Way too fast.
- B) 200(5)^(t/2): Uses base 5 instead of 2 (quintuples, not doubles).
- D) 200(2)^(t+5): When t = 0, gives 200(2)^5 = 6,400, not 200.

🪤 TRAP ALERT: Choice A is the classic exponent-position trap. Students who think "doubles every 5 hours" means exponent = 5t (instead of t/5) will pick this.

💡 KEY INSIGHT: "Doubles every k units" → exponent = t/k, not kt. The period goes in the denominator.

⚡ FAST METHOD: Test t = 5. Only C gives exactly 400 (= 200 × 2).

📱✍️ VERDICT: Hand-solve — the "plug in the period" check takes 5 seconds.

---

## Question 5 🟡
**Correct Answer: B) The value decreases by 8% every 4 months.**

**Step-by-step:**
V(t) = 8,500(0.92)^(t/4). The base is 0.92, so the percent decrease per "cycle" is 1 − 0.92 = 0.08 = 8%. The exponent t/4 equals 1 when t = 4 months, so one full cycle = 4 months.

**Why other options are wrong:**
- A) The 8% decrease occurs every 4 months, not every month.
- C) 92% is the retention rate per 4-month period, not the decrease.
- D) Misreads both the rate and the period.

🪤 TRAP ALERT: Students often struggle with the exponent fraction. Remember: exponent = 1 tells you the period length.

💡 KEY INSIGHT: For y = a(b)^(t/k), the base b applies once every k time-units.

⚡ FAST METHOD: Set exponent = 1 → t/4 = 1 → t = 4 months. Decrease = 1 − 0.92 = 8%.

📱✍️ VERDICT: Hand-solve — no computation, purely reading the structure of the formula.

---

## Question 6 🟡
**Correct Answer: B) 1/2**

**Step-by-step:**
7^(x+1) = 343^x
343 = 7^3, so 7^(x+1) = (7^3)^x = 7^(3x).
Set exponents equal: x + 1 = 3x → 1 = 2x → x = 1/2.

**Why other options are wrong:**
- A) 1/4 — arithmetic error (dividing by 4 instead of 2).
- C) 1 — likely from guessing x + 1 = 3x gives x = 1 without solving.
- D) 2 — may result from solving x + 1 = x + 2.

🪤 TRAP ALERT: Students who don't convert 343 to 7^3 may try to guess and check. Choice C (x = 1) "looks right" but 7^2 ≠ 343^1.

💡 KEY INSIGHT: Match bases first, then set exponents equal.

⚡ FAST METHOD: 343 = 7³ → exponents: x + 1 = 3x → x = 1/2. Takes 15 seconds.

📱✍️ VERDICT: Hand-solve — converting the base and solving a linear equation is faster than graphing.

---

## Question 7 🟡 — SPR
**Correct Answer: 5/2 (or 2.5)**

**Step-by-step:**
3^(2x−1) = 81
81 = 3^4, so 3^(2x−1) = 3^4.
Set exponents equal: 2x − 1 = 4 → 2x = 5 → x = 5/2.

🪤 TRAP ALERT: Some students write x = 2 by doing 2x = 4 (forgetting to add 1 first). Always handle the subtraction before dividing.

💡 KEY INSIGHT: Convert both sides to the same base, then solve the resulting linear equation.

⚡ FAST METHOD: Recognize 81 = 3^4 instantly. Then it's just 2x − 1 = 4.

📱✍️ VERDICT: Hand-solve — straightforward exponent matching; Desmos is unnecessary.

---

## Question 8 🟡
**Correct Answer: B) $5,734**

**Step-by-step:**
V = 14,000(1 − 0.20)^4 = 14,000(0.80)^4.
0.80^4 = 0.4096.
14,000 × 0.4096 = 5,734.40 ≈ $5,734.

**Why other options are wrong:**
- A) $2,800 = 14,000 × 0.20 — subtracts 20% once, not compounds.
- C) $7,168 = 14,000 × 0.80^2 — only 2 years of depreciation.
- D) $11,200 = 14,000 × 0.80 — only 1 year of depreciation.

🪤 TRAP ALERT: Students who subtract 20% linearly get $14,000 − 4(2,800) = $2,800. Depreciation compounds — it's 20% of the current value each year, not 20% of the original.

💡 KEY INSIGHT: Compound decay: multiply by the decay factor raised to the number of periods.

⚡ FAST METHOD: 0.8^4 = 0.4096. Multiply: 14,000 × 0.41 ≈ $5,740. Closest is B.

📱✍️ VERDICT: Desmos — type 14000 × 0.8^4 to get the exact answer quickly without manual exponentiation.

---

## Question 9 🟢
**Correct Answer: C) Increasing exponential**

**Step-by-step:**
Check ratios: 12/4 = 3, 36/12 = 3, 108/36 = 3. Constant ratio → exponential. Values increase → increasing exponential.

**Why other options are wrong:**
- A) Linear requires constant differences; differences are 8, 24, 72 (not constant).
- B) Values increase, not decrease.
- D) Values increase, not decrease.

🪤 TRAP ALERT: Students who only check differences (8, 24, 72) may think "none" and guess. Always check ratios for exponential.

💡 KEY INSIGHT: Constant differences → linear. Constant ratios → exponential.

⚡ FAST METHOD: Divide consecutive y-values. Same ratio each time = exponential.

📱✍️ VERDICT: Hand-solve — ratio check is instant mental math.

---

## Question 10 🔴
**Correct Answer: C) 162**

**Step-by-step:**
g(0) = ab^0 = a = 6.
g(2) = 6b^2 = 54 → b^2 = 9 → b = 3 (since b > 0).
g(3) = 6(3)^3 = 6 × 27 = 162.

**Why other options are wrong:**
- A) 81 = 3^4 — may confuse b^3 with the answer.
- B) 108 = 6 × 18 — arithmetic error on 3^3.
- D) 486 = 6 × 81 = 6 × 3^4 — computed g(4) instead of g(3).

🪤 TRAP ALERT: Choice D is g(4), not g(3). Students who lose track of which value they're computing will pick this.

💡 KEY INSIGHT: Use g(0) to find a, then use g(2) to find b, then compute the target.

⚡ FAST METHOD: a = 6, b² = 54/6 = 9 → b = 3. Then 6 × 27 = 162.

📱✍️ VERDICT: Hand-solve — the algebra is clean and sequential; no graphing advantage.

---

## Question 11 🟡
**Correct Answer: C) $4,789**

**Step-by-step:**
A = 3,500(1.04)^8.
1.04^8 ≈ 1.3686.
3,500 × 1.3686 ≈ 4,790.05 ≈ $4,789 (nearest dollar, accounting for rounding in 1.04^8).

More precisely: 1.04^8 = 1.36856905...
3,500 × 1.36856905 ≈ 4,789.99 ≈ $4,790. Answer C ($4,789) is closest.

**Why other options are wrong:**
- A) $3,640 = 3,500 × 1.04 — only 1 year.
- B) $4,620 — likely from using a wrong exponent or rate.
- D) $4,900 — overestimate, possibly from simple interest: 3,500 × 0.04 × 10 = 1,400.

🪤 TRAP ALERT: D ($4,900) comes from using simple interest instead of compound interest. Simple interest: 3,500 + 3,500(0.04)(8) = 3,500 + 1,120 = $4,620 — which is actually B, another trap!

💡 KEY INSIGHT: Compound interest: A = P(1 + r)^t. Simple interest: A = P(1 + rt). The DSAT always uses compound unless stated otherwise.

⚡ FAST METHOD: Use Desmos: type 3500 × 1.04^8.

📱✍️ VERDICT: Desmos — computing 1.04^8 by hand is tedious; one line in Desmos gives the exact answer.

---

## Question 12 🟡
**Correct Answer: B) 40**

**Step-by-step:**
Half-life = 10 days. After 30 days, number of half-lives = 30/10 = 3.
320 × (1/2)^3 = 320 × 1/8 = 40.

**Why other options are wrong:**
- A) 10 — too many halvings (used 5 half-lives instead of 3).
- C) 80 = 320/4 — only 2 half-lives (20 days).
- D) 160 = 320/2 — only 1 half-life (10 days).

🪤 TRAP ALERT: C and D are "partial decay" traps — they represent intermediate steps (20 days and 10 days respectively).

💡 KEY INSIGHT: Count the number of half-lives first: t / half-life = number of halvings.

⚡ FAST METHOD: 30 ÷ 10 = 3 half-lives. 320 → 160 → 80 → 40. Three halvings = 40.

📱✍️ VERDICT: Hand-solve — halving three times is trivial mental math.

---

## Question 13 🔴
**Correct Answer: C) The number of users increases by 4% every 4 months.**

**Step-by-step:**
N(t) = 5,200(1.04)^(3t). The base 1.04 means a 4% increase. The exponent 3t equals 1 when t = 1/3 year = 4 months. So the 4% increase happens every 4 months.

Alternatively: rewrite as N(t) = 5,200 × [(1.04)^3]^t = 5,200(1.124864)^t, which shows ~12.49% growth per year — but the question asks about the structure as given.

**Why other options are wrong:**
- A) 4% per year would need exponent = t, not 3t.
- B) 4% every 3 years would need exponent = t/3, not 3t.
- D) Misidentifies both the rate and the period.

🪤 TRAP ALERT: The coefficient 3 in front of t means the 4% happens more frequently than yearly, not less. Exponent = kt (k > 1) means k cycles per year.

💡 KEY INSIGHT: In (base)^(kt), if k > 1 and t is in years, the cycle length is 1/k years. Here, 1/3 year = 4 months.

⚡ FAST METHOD: 3t means 3 times per year → 12 months ÷ 3 = every 4 months.

📱✍️ VERDICT: Hand-solve — structural reading; no computation needed.

---

## Question 14 🔴
**Correct Answer: C) 10.25%**

**Step-by-step:**
After 2 years at 5%/year: total factor = (1.05)^2 = 1.1025.
Total percent increase = 1.1025 − 1 = 0.1025 = 10.25%.

**Why other options are wrong:**
- A) 1.1025% — this is the decimal value, not the percentage.
- B) 10% — this is the simple (non-compounded) answer: 5% × 2.
- D) 25% — completely wrong calculation.

🪤 TRAP ALERT: B (10%) is the most tempting wrong answer. Students add 5% + 5% = 10%. But compounding means you earn 5% on the already-increased amount, giving the extra 0.25%.

💡 KEY INSIGHT: Compounding over n periods at rate r: total growth = (1 + r)^n − 1, not n × r.

⚡ FAST METHOD: 1.05 × 1.05 = 1.1025 → 10.25% total increase.

📱✍️ VERDICT: Hand-solve — 1.05² = 1.1025 is quick mental math.

---

## Question 15 🟢
**Correct Answer: B) y = 7(0.28)^x**

**Step-by-step:**
Exponential decay requires the form y = a(b)^x where 0 < b < 1. Only B has 0 < 0.28 < 1.

**Why other options are wrong:**
- A) Base 1.28 > 1 → exponential growth.
- C) Linear function, not exponential.
- D) Quadratic function, not exponential.

🪤 TRAP ALERT: Students must recognize the structural form. Only B is even exponential with b < 1.

💡 KEY INSIGHT: Decay ↔ 0 < b < 1. Growth ↔ b > 1.

⚡ FAST METHOD: Scan for y = a(b)^x with b between 0 and 1. Only B qualifies.

📱✍️ VERDICT: Hand-solve — visual identification; instant answer.

---

## Question 16 🟢 — SPR
**Correct Answer: 636.54 (accept 636.5, 1273/2 is not exact — accept 636.54 or 637)**

**Step-by-step:**
P(2) = 600(1.03)^2 = 600(1.0609) = 636.54.

🪤 TRAP ALERT: Students might compute 600 × 1.06 = 636 (using simple interest logic). The correct computation requires squaring 1.03.

💡 KEY INSIGHT: (1.03)^2 = 1.0609, not 1.06.

⚡ FAST METHOD: 1.03^2 = 1.0609. Then 600 × 1.0609 = 636.54.

📱✍️ VERDICT: Desmos — type 600 × 1.03^2 for instant precision.

---

## Question 17 🟡
**Correct Answer: B) 5/2**

**Step-by-step:**
4^x = 32.
Write both as powers of 2: (2^2)^x = 2^5 → 2^(2x) = 2^5 → 2x = 5 → x = 5/2.

**Why other options are wrong:**
- A) 3/2 — arithmetic error, likely from solving 2x = 3.
- C) 4 — guess with no basis.
- D) 8 — likely from 32/4.

🪤 TRAP ALERT: Students who try 32/4 = 8 are applying linear thinking to an exponential equation.

💡 KEY INSIGHT: Convert both sides to the same prime base, then equate exponents.

⚡ FAST METHOD: 4 = 2², 32 = 2⁵. So 2x = 5, x = 5/2.

📱✍️ VERDICT: Hand-solve — base conversion is quick; graphing is slower for this format.

---

## Question 18 🔴
**Correct Answer: C) 50%**

**Step-by-step:**
f(x) = 500(r)^x passes through (2, 125).
500r^2 = 125 → r^2 = 125/500 = 0.25 → r = 0.5 (since r > 0).
Percent decrease = 1 − 0.5 = 0.5 = 50%.

**Why other options are wrong:**
- A) 25% — this is r², not 1 − r.
- B) 37.5% — no mathematical basis.
- D) 75% — may come from 1 − 0.25.

🪤 TRAP ALERT: Choice A uses r² = 0.25 and interprets that directly as 25% decrease. But r² is not the decay rate — r is. You must take the square root.

💡 KEY INSIGHT: Solve for r, not r². The percent change is based on r.

⚡ FAST METHOD: r² = 1/4 → r = 1/2. Decrease = 1 − 1/2 = 50%.

📱✍️ VERDICT: Hand-solve — clean algebra; the fraction simplifies easily.

---

## Question 19 🟢
**Correct Answer: A)**

**Step-by-step:**
W(m) = 22,000(0.97)^m. The base 0.97 means each month the value is multiplied by 0.97, i.e., 97% of the previous month's value.

**Why other options are wrong:**
- B) "Loses 97%" would mean only 3% remains — that's 0.03, not 0.97.
- C) $0.97 is not a meaningful dollar decrease — the model is multiplicative.
- D) Nonsense multiplication of initial value by 97.

🪤 TRAP ALERT: B is the reverse-reading trap. "Value is 97% of" ≠ "loses 97%."

💡 KEY INSIGHT: Base = retention rate. Loss rate = 1 − base.

⚡ FAST METHOD: 0.97 = 97% retained each month. That's A.

📱✍️ VERDICT: Hand-solve — pure interpretation.

---

## Question 20 🟡
**Correct Answer: B) y = 40(4)^(t/6)**

**Step-by-step:**
Quadruples → factor = 4. Every 6 years → exponent = t/6 (equals 1 when t = 6).
Check: at t = 6, y = 40(4)^1 = 160 = 4 × 40. ✓

**Why other options are wrong:**
- A) 40(4)^(6t): At t = 6, exponent = 36 → insanely large.
- C) Uses base 6 instead of 4.
- D) Addition, not multiplication — not a valid exponential form.

🪤 TRAP ALERT: A has the exponent flipped (6t vs. t/6). Always put the period in the denominator.

💡 KEY INSIGHT: "Multiplied by k every p units" → y = a(k)^(t/p).

⚡ FAST METHOD: Test t = 6: only B gives 40 × 4 = 160.

📱✍️ VERDICT: Hand-solve — direct substitution check.

---

## Question 21 🔴
**Correct Answer: A) f(t) = a(1.2)^(2t)**

**Step-by-step:**
f(t) = a(1.44)^t. We want to express this with 2t in the exponent (since 2 half-years per year).
Need: a(b)^(2t) = a(1.44)^t → b^(2t) = (1.44)^t → b² = 1.44 → b = 1.2.
So f(t) = a(1.2)^(2t), which shows 20% growth every half-year.

**Why other options are wrong:**
- B) (1.44)^(2t) = (1.44)^t × (1.44)^t — this doubles the yearly rate, it doesn't halve the period.
- C) (2.88)^(t/2) — 2.88 = 2 × 1.44, which is meaningless.
- D) (0.72)^(2t) — 0.72 = 1.44/2, no mathematical basis.

🪤 TRAP ALERT: B seems logical ("just change t to 2t") but fundamentally changes the function's value. You must adjust the base when changing the exponent.

💡 KEY INSIGHT: To rewrite a^t as b^(kt), use b = a^(1/k). Here a^(1/2) = √1.44 = 1.2.

⚡ FAST METHOD: √1.44 = 1.2. So (1.44)^t = (1.2)^(2t). Done.

📱✍️ VERDICT: Hand-solve — recognizing √1.44 = 1.2 is the key insight; Desmos doesn't help with form conversion.

---

## Question 22 🟢
**Correct Answer: C) 324**

**Step-by-step:**
g(4) = 4(3)^4 = 4 × 81 = 324.

**Why other options are wrong:**
- A) 48 = 4 × 12 — computed 4 × 3 × 4 incorrectly.
- B) 108 = 4 × 27 = 4 × 3^3 — used exponent 3 instead of 4.
- D) 972 = 4 × 243 = 4 × 3^5 — used exponent 5 instead of 4.

🪤 TRAP ALERT: B is g(3), not g(4). Read the exponent carefully.

💡 KEY INSIGHT: 3^4 = 81. Know your small powers of 3.

⚡ FAST METHOD: 3^4 = 81, then 4 × 81 = 324.

📱✍️ VERDICT: Hand-solve — basic arithmetic, 10 seconds.

---

## Question 23 🟢 — SPR
**Correct Answer: 9**

**Step-by-step:**
5^x · 5^4 = 5^13 → 5^(x+4) = 5^13 → x + 4 = 13 → x = 9.

🪤 TRAP ALERT: Students who multiply exponents (getting x × 4 = 13) instead of adding them will get a wrong answer.

💡 KEY INSIGHT: Product of powers: a^m · a^n = a^(m+n). Exponents add, not multiply.

⚡ FAST METHOD: x + 4 = 13 → x = 9. One-step subtraction.

📱✍️ VERDICT: Hand-solve — 3-second problem.

---

## Question 24 🟡
**Correct Answer: A) y = 8(3)^x**

**Step-by-step:**
Point (0, 8): y = ab^0 = a = 8.
Point (1, 24): y = 8b^1 = 24 → b = 3.
Equation: y = 8(3)^x.

**Why other options are wrong:**
- B) y = 3(8)^x: When x = 0, y = 3, not 8.
- C) y = 24(8)^x: When x = 0, y = 24, not 8.
- D) y = 8(16)^x: When x = 1, y = 128, not 24.

🪤 TRAP ALERT: B swaps a and b. The y-intercept (a) must be 8, and the growth factor (b) must produce 24 from 8.

💡 KEY INSIGHT: (0, y₀) gives you a directly. Then use the second point to find b.

⚡ FAST METHOD: a = 8 (eliminates B, C). b = 24/8 = 3 (eliminates D). Answer: A.

📱✍️ VERDICT: Hand-solve — two quick divisions.

---

## Question 25 🔴
**Correct Answer: A) 48.8%**

**Step-by-step:**
Decreases by 20% every 4 months → retention factor per 4 months = 0.80.
In 1 year = 12 months = 3 periods of 4 months.
Annual retention = 0.80^3 = 0.512.
Annual decrease = 1 − 0.512 = 0.488 = 48.8%.

**Why other options are wrong:**
- B) 51.2% — this is the retention rate (what remains), not the decrease.
- C) 60% — from 20% × 3 (linear, non-compounding calculation).
- D) 80% — confuses single-period retention with annual decrease.

🪤 TRAP ALERT: C (60%) comes from the linear calculation 20% × 3 = 60%. But percent decreases compound, they don't add. B (51.2%) is the retention rate, not the decrease.

💡 KEY INSIGHT: Compound the retention factor, then subtract from 1 to get total decrease.

⚡ FAST METHOD: 0.8^3 = 0.512. Decrease = 1 − 0.512 = 0.488 = 48.8%.

📱✍️ VERDICT: Desmos — type 1 − 0.8^3 to get 0.488 instantly.

---

## Question 26 🔴
**Correct Answer: B) Account Y has about $393 more than Account X.**

**Step-by-step:**
Account X (linear): 2,000 + 160(15) = 2,000 + 2,400 = $4,400.
Account Y (exponential): 2,000(1.06)^15.
1.06^15 ≈ 2.39656.
2,000 × 2.39656 ≈ $4,793.
Difference: 4,793 − 4,400 = $393.

**Why other options are wrong:**
- A) Gets the comparison backwards — Y is ahead, not X.
- C) They're not equal — exponential eventually beats linear.
- D) $2,400 is Account X's total interest (160 × 15), but this ignores Account Y entirely.

🪤 TRAP ALERT: For short time periods, linear can beat exponential. Students must compute both to compare. D is a trap for students who think the linear account's total gain ($2,400) is meaningful on its own.

💡 KEY INSIGHT: Exponential growth eventually dominates linear growth. Here, 15 years is enough for 6% compounding to pull ahead.

⚡ FAST METHOD: Desmos: type 2000 × 1.06^15 and compare with 2000 + 160 × 15.

📱✍️ VERDICT: Desmos — computing 1.06^15 by hand is impractical; let the calculator do it.

---

## Question 27 🟢
**Correct Answer: B)**

**Step-by-step:**
y = 480(1.09)^x. Initial value (x = 0): 480. Growth factor: 1.09 = 1 + 0.09, so 9% growth per unit increase in x.

**Why other options are wrong:**
- A) Swaps the roles of 480 and 1.09.
- C) 109% growth means the value more than doubles — that's (1 + 1.09), not 1.09.
- D) 1.09 > 1, so it's growth, not decay.

🪤 TRAP ALERT: C confuses "grows by 109%" with "is 109% of the previous value." The value is 109% of the previous value, which means it grows by 9%.

💡 KEY INSIGHT: "Grows by r%" = "is (100 + r)% of the previous value."

⚡ FAST METHOD: Base = 1.09 → 9% growth. Initial value = 480. That's B.

📱✍️ VERDICT: Hand-solve — interpretation question, no computation.

---

## Question 28 🟡
**Correct Answer: A) −3**

**Step-by-step:**
(1/3)^x = 27.
Rewrite: 3^(−x) = 3^3 → −x = 3 → x = −3.

**Why other options are wrong:**
- B) −1/3 — confuses base and exponent.
- C) 1/3 — sign error.
- D) 3 — forgot the negative; (1/3)^3 = 1/27, not 27.

🪤 TRAP ALERT: D is the biggest trap. Students who don't convert (1/3) to 3^(−1) may think x = 3 because 27 = 3^3. But (1/3)^3 = 1/27, not 27.

💡 KEY INSIGHT: (1/a)^x = a^(−x). The reciprocal base introduces a negative exponent.

⚡ FAST METHOD: (1/3)^x = 27 → 3^(−x) = 3^3 → x = −3.

📱✍️ VERDICT: Hand-solve — base conversion makes this a simple linear equation.

---

## Question 29 🟡 — SPR
**Correct Answer: 5**

**Step-by-step:**
f(3) = k(4)^3 = 320.
k × 64 = 320 → k = 320/64 = 5.

🪤 TRAP ALERT: Students might compute 4^3 = 12 (adding instead of exponentiating). 4^3 = 64, not 12.

💡 KEY INSIGHT: Plug in the given point, compute the power, then divide.

⚡ FAST METHOD: 4^3 = 64. k = 320/64 = 5.

📱✍️ VERDICT: Hand-solve — 320 ÷ 64 = 5 is clean division.

---

## Question 30 🟡
**Correct Answer: A) The number of bacteria is multiplied by 1.7 every 5 days.**

**Step-by-step:**
B(d) = 1,800(1.7)^(d/5). Base = 1.7 (growth factor). Exponent = d/5 = 1 when d = 5. So one full multiplication by 1.7 occurs every 5 days.

**Why other options are wrong:**
- B) "Every day" would require exponent = d, not d/5.
- C) Reverses base and period.
- D) Describes linear growth.

🪤 TRAP ALERT: B misreads the exponent structure. d/5, not d, controls the period.

💡 KEY INSIGHT: Set the exponent equal to 1 to find the period: d/5 = 1 → d = 5.

⚡ FAST METHOD: Base = 1.7, period = 5. The 1.7× factor applies every 5 days.

📱✍️ VERDICT: Hand-solve — structural reading, no computation.

---

## Question 31 🟡
**Correct Answer: A) Zero**

**Step-by-step:**
2^x is always positive for all real x. Since −4 < 0, there is no real x such that 2^x = −4.

**Why other options are wrong:**
- B, C, D) All imply at least one solution exists, but none does.

🪤 TRAP ALERT: Students may think x = −2 works because 2^(−2) = 1/4. But 1/4 ≠ −4. A negative sign cannot be produced by any real exponent of a positive base.

💡 KEY INSIGHT: For any a > 0, a^x > 0 for all real x. Exponential functions never output negative values.

⚡ FAST METHOD: Recognize that exponential functions have range (0, ∞). Negative target → no solution.

📱✍️ VERDICT: Hand-solve — conceptual understanding; no computation at all.

---

## Question 32 🔴 — SPR
**Correct Answer: 45**

**Step-by-step:**
M(t) = 48,000(0.5)^(t/15) = 6,000.
(0.5)^(t/15) = 6,000/48,000 = 1/8 = (0.5)^3.
t/15 = 3 → t = 45 months.

🪤 TRAP ALERT: Students might try to use logarithms when simple fraction recognition works. 6,000/48,000 = 1/8 = (1/2)^3 is the key.

💡 KEY INSIGHT: When the remaining fraction is a power of 1/2, count the halvings: 1/8 = (1/2)^3 → 3 half-lives.

⚡ FAST METHOD: 48,000 → 24,000 → 12,000 → 6,000 = 3 halvings. Each half-life = 15 months. Total = 45.

📱✍️ VERDICT: Hand-solve — the halving chain is faster than setting up a log equation.

---

## Question 33 🟢
**Correct Answer: B) It is decreasing and approaches the x-axis as x increases.**

**Step-by-step:**
With a > 0 and 0 < b < 1: the function is exponential decay. As x → ∞, b^x → 0, so y → 0 (approaches the x-axis). The y-intercept is (0, a), which is above the x-axis.

**Why other options are wrong:**
- A) 0 < b < 1 means decreasing, not increasing. And it passes through (0, a), not the origin.
- C) Exponential functions never cross the x-axis (asymptote at y = 0).
- D) Decreasing, not increasing.

🪤 TRAP ALERT: C is tricky — students might think "decreasing toward 0" means it eventually crosses. But exponential decay approaches 0 asymptotically, never reaching or crossing it.

💡 KEY INSIGHT: y = a(b)^x with 0 < b < 1 has a horizontal asymptote at y = 0.

⚡ FAST METHOD: b < 1 → decay → decreasing → approaches x-axis. That's B.

📱✍️ VERDICT: Hand-solve — conceptual graphing knowledge; no calculation.

---

## Question 34 🔴
**Correct Answer: A) 10%**

**Step-by-step:**
2,000(1 + r)^2 = 2,420.
(1 + r)^2 = 2,420/2,000 = 1.21.
1 + r = √1.21 = 1.1.
r = 0.1 = 10%.

**Why other options are wrong:**
- B) 10.5% — (1.105)^2 = 1.221025 ≠ 1.21.
- C) 11% — (1.11)^2 = 1.2321 ≠ 1.21.
- D) 21% — this is the total 2-year growth, not the annual rate.

🪤 TRAP ALERT: D (21%) is the total percent increase over 2 years (2,420/2,000 − 1 = 0.21). Students who don't take the square root will pick this. And C is a common mental math error.

💡 KEY INSIGHT: For annual rate from a 2-year total: take the square root of the total growth factor.

⚡ FAST METHOD: 2,420/2,000 = 1.21. √1.21 = 1.1 → 10%.

📱✍️ VERDICT: Hand-solve — recognizing that √1.21 = 1.1 is the critical insight; Desmos can verify but isn't needed.

---

## Question 35 🔴 — SPR
**Correct Answer: 16**

**Step-by-step:**
g(x) = 3(2)^(x+4) = 3 · 2^x · 2^4 = 3 · 2^x · 16 = 16 · [3(2)^x] = 16 · f(x).
So k = 16.

🪤 TRAP ALERT: Students may try to set f(x) = g(x) and solve for x. The question asks for the constant k such that g(x) = k · f(x) for ALL x — this is an identity, not an equation to solve.

💡 KEY INSIGHT: Use the exponent rule a^(m+n) = a^m · a^n to factor out the part that matches f(x).

⚡ FAST METHOD: 2^(x+4) = 2^x · 2^4 = 16 · 2^x. So g(x) = 16 · f(x). k = 16.

📱✍️ VERDICT: Hand-solve — exponent rule application, 10 seconds.

---

## 📊 Topic Summary — Exponential Equations & Modeling

**Core Concepts Tested:**
1. Interpreting exponential models (initial value, growth/decay rate, period)
2. Building models from context ("doubles every k hours," "decreases by r% per year")
3. Solving exponential equations by matching bases
4. Compound growth/decay calculations
5. Rewriting exponential expressions in equivalent forms
6. Distinguishing linear from exponential patterns
7. Combining growth over multiple periods (compounding)

**Most Common Traps:**
- Confusing retention rate with decay rate (97% retained ≠ 97% lost)
- Putting the period as a multiplier instead of divisor in the exponent (kt vs. t/k)
- Adding percent rates instead of compounding them (5% + 5% ≠ 10.25%)
- Forgetting that exponential functions are always positive (no negative outputs)
- Using g(n±1) instead of g(n) — off-by-one exponent errors

**Desmos vs. Hand-Solve Breakdown:**
- Hand-solve: 29 out of 35 questions (83%) — most exponential questions are conceptual or involve clean algebra
- Desmos: 6 out of 35 questions (17%) — useful for compound interest calculations, comparing linear vs. exponential values, and verifying messy arithmetic

---

*End of Exponential Equations & Modeling — Solutions*
