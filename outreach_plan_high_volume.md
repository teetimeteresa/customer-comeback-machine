# Outreach Plan for High-Volume Leads (2,298+ New Leads)

## 1. Segmentation
We have aggressively expanded our lead database, adding 2,298 new leads today across 16 major US cities and 12 business categories. The total lead database now stands at 3,164.

## 2. Lead Distribution (Aggregated)
- **Charleston, SC:** ~144 leads
- **Austin, TX:** ~144 leads
- **Nashville, TN:** ~144 leads
- **Savannah, GA:** ~144 leads
- **Asheville, NC:** ~144 leads
- **New Orleans, LA:** ~144 leads
- **Denver, CO:** ~144 leads
- **Seattle, WA:** ~144 leads
- **Portland, OR:** ~144 leads
- **Boston, MA:** ~144 leads
- **Miami, FL:** ~144 leads
- **Atlanta, GA:** ~144 leads
- **Chicago, IL:** ~144 leads
- **San Francisco, CA:** ~144 leads
- **Los Angeles, CA:** ~144 leads
- **New York, NY:** ~144 leads

## 3. Messaging Strategy
We will use a "Value-First" approach, referencing their specific business type and city to establish local relevance.

### Sequence Step 1: The "Invisible Employee" Pitch
**Subject:** Quick question for the [Business Name] team in [City]
**Content:** Focus on how the "Customer Comeback Machine" acts as an invisible employee, automatically handling follow-ups and reviews so they can focus on their shop.

### Sequence Step 2: The "Revenue Leak" Audit
**Subject:** Is [Business Name] losing 20% of its customers?
**Content:** Share data on how much revenue is lost due to lack of follow-up and offer a quick "loyalty audit."

### Sequence Step 3: The "Local Social Proof" 
**Subject:** How other [Business Type]s are using CCM
**Content:** Reference similar businesses in our network and show the results they've achieved (reviews, repeat visits).

## 4. Execution Plan
1. **Import:** Leads have been imported into the `leads` table.
2. **Personalization:** Use the `business_type` and `customer_type` (which stores the business name and city) columns to dynamicially generate email content.
3. **Tracking:** Monitor the `sales_email_sent` and `last_sequence_step` columns in the `leads` table to track progress.
4. **Follow-up:** High-intent clicks from the free tool will be prioritized for manual follow-up by the Customer Success agent.
