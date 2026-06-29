import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      businessName,
      businessType,
      monthlyCustomers,
      avgTicket,
      churnRate,
      city,
      score,
      grade,
      lostCustomersPerYear,
      lostRevenuePerYear,
      recoverableRevenue,
      findings,
      recommendations,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if this email already submitted an audit
    const existing = await teamDb({
      sql: 'SELECT id, created_at FROM leads WHERE email = ? AND generated_content LIKE ?',
      args: [email, '%"audit_score"%']
    });

    if (existing && existing.length > 0) {
      // Update existing audit lead
      const auditResult = {
        audit_score: score,
        audit_grade: grade,
        audit_monthly_customers: monthlyCustomers,
        audit_avg_ticket: avgTicket,
        audit_churn_rate: churnRate,
        audit_lost_customers_per_year: lostCustomersPerYear,
        audit_lost_revenue_per_year: lostRevenuePerYear,
        audit_recoverable_revenue: recoverableRevenue,
        audit_findings: findings,
        audit_recommendations: recommendations,
      };

      await teamDb({
        sql: 'UPDATE leads SET generated_content = ?, high_intent = 1, business_name = ?, city = ?, updated_at = ? WHERE id = ?',
        args: [JSON.stringify(auditResult), businessName || '', city || '', timestamp(), existing[0].id]
      });

      return NextResponse.json({
        success: true,
        leadId: existing[0].id,
        isExisting: true,
      });
    }

    // Create new lead
    const leadId = generateId();
    const now = timestamp();

    const auditResult = {
      audit_score: score,
      audit_grade: grade,
      audit_monthly_customers: monthlyCustomers,
      audit_avg_ticket: avgTicket,
      audit_churn_rate: churnRate,
      audit_lost_customers_per_year: lostCustomersPerYear,
      audit_lost_revenue_per_year: lostRevenuePerYear,
      audit_recoverable_revenue: recoverableRevenue,
      audit_findings: findings,
      audit_recommendations: recommendations,
    };

    await teamDb({
      sql: `INSERT INTO leads (id, email, business_type, business_name, city, generated_content, high_intent, sales_email_sent, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, 0, 'new', ?)`,
      args: [leadId, email, businessType || '', businessName || '', city || '', JSON.stringify(auditResult), now]
    });

    // Trigger sales email asynchronously
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    fetch(`${appUrl}/api/email/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    }).catch(err => console.error('Failed to trigger sales email:', err));

    return NextResponse.json({
      success: true,
      leadId,
      isExisting: false,
    });
  } catch (error) {
    console.error('Audit save error:', error);
    return NextResponse.json(
      { error: 'Failed to save audit results' },
      { status: 500 }
    );
  }
}