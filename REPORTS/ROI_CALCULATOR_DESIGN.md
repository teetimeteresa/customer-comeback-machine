# Customer Churn ROI Calculator — Design & Logic

## 1. Concept
The "Leaky Bucket" ROI Calculator is a high-intent lead magnet designed to show local business owners the massive financial impact of customer churn (or "drift"). By inputting a few basic numbers, they see the "Hidden Revenue Leak" that Customer Comeback Machine is designed to plug.

---

## 2. Copy & Interface

### **Headline**
**Stop the Bleeding: How Much Revenue Are You Losing to "Customer Drift"?**

### **Sub-headline**
70% of first-time visitors never return to a local business. Use this calculator to see what that "one-and-done" habit is costing your bottom line.

---

### **Inputs**
| Field Label | Type | Default / Range | Help Text |
| :--- | :--- | :--- | :--- |
| **Average Customer Lifetime Value (LTV)** | Currency ($) | $500 | What is a loyal, repeat customer worth to you over time? |
| **New Customers per Month** | Number | 100 | How many new people walk through your door each month? |
| **Churn Rate ("One-and-Done" %)** | Percentage (%) | 70% | What % of new customers never come back for a second visit? |

---

### **Outputs (The "Ouch" Factor)**
- **Monthly Revenue Leak**: `(Monthly New Customers * Churn Rate * LTV)`
- **Annual "Hidden" Loss**: `(Monthly Revenue Leak * 12)`
- **Primary Result Headline**: "Your business is losing **$[Annual Loss]** every year to Customer Drift."

---

### **The "Machine" Solution (The ROI)**
- **Recovery Potential**: "If CCM helps you recover just **20%** of those lost customers..."
- **New Annual Revenue**: `(Annual Loss * 0.20)`
- **Investment**: "Customer Comeback Machine: **$49/mo** ($588/year)"
- **Projected ROI**: `(New Annual Revenue / 588) * 100`%

---

## 3. Mathematical Logic (JavaScript Example)

```javascript
function calculateLeak(ltv, newMonthly, churnRate) {
  const churnDecimal = churnRate / 100;
  const monthlyLeak = newMonthly * churnDecimal * ltv;
  const annualLeak = monthlyLeak * 12;
  
  const recoveryRate = 0.20; // conservative 20% recovery
  const recoveredRevenue = annualLeak * recoveryRate;
  
  const annualCost = 49 * 12;
  const roi = (recoveredRevenue / annualCost) * 100;

  return {
    monthlyLeak,
    annualLeak,
    recoveredRevenue,
    roi: roi.toFixed(0)
  };
}
```

---

## 4. Implementation Strategy
1.  **Placement**: Feature this prominently on the Homepage and Pricing page.
2.  **Lead Capture**: Show the "Monthly Leak" immediately, but require an email address to see the "Annual Loss" and the "Recovery ROI Report."
3.  **Sales Sequence**: Immediately trigger a customized email with their specific "Leak" numbers and how the "Machine" will fix it.
