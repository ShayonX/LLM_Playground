# functions.py
from datetime import date

TODAY = str(date.today())      # quick helper for “last_updated” fields

def get_vendor_risk_ratings_complete(username: str) -> dict:
    """Get vendor risk ratings for a specific user"""
    return {
        "user": username,
        "data_type": "Vendor risk ratings",
        "vendors": [
            {"vendor_id": "VEND-001", "name": "TechCorp Solutions", "risk_level": "Low", "rating": "A", "last_assessment": "2024-12-01"},
            {"vendor_id": "VEND-002", "name": "Global Services Ltd", "risk_level": "Medium", "rating": "B+", "last_assessment": "2024-11-15"},
            {"vendor_id": "VEND-003", "name": "QuickFix Inc", "risk_level": "High", "rating": "C", "last_assessment": "2024-12-10"}
        ],
        "total_vendors": 3,
        "average_rating": "B",
        "last_updated": "2024-12-15"
    }

def get_asset_checkout_records(username: str) -> dict:
    """Get asset checkout records for a specific user"""
    return {
        "user": username,
        "data_type": "Asset checkout records",
        "checked_out_assets": [
            {"asset_id": "LAPTOP-001", "type": "Laptop", "checkout_date": "2024-11-01", "return_due": "2024-12-01", "status": "overdue"},
            {"asset_id": "PROJ-005", "type": "Projector", "checkout_date": "2024-12-10", "return_due": "2024-12-17", "status": "active"},
            {"asset_id": "CAM-003", "type": "Camera", "checkout_date": "2024-12-12", "return_due": "2024-12-19", "status": "active"}
        ],
        "total_checked_out": 3,
        "overdue_count": 1,
        "last_updated": "2024-12-15"
    }

def get_final_hr_clearance_forms(username: str) -> dict:
    """Get final HR clearance forms for a specific user"""
    return {
        "user": username,
        "data_type": "Final HR clearance forms",
        "clearance_items": [
            {"item": "Equipment Return", "status": "completed", "completion_date": "2024-12-01"},
            {"item": "Badge Deactivation", "status": "completed", "completion_date": "2024-12-02"},
            {"item": "System Access Removal", "status": "pending", "assigned_to": "IT Security"},
            {"item": "Final Payroll Processing", "status": "in_progress", "assigned_to": "Payroll Dept"}
        ],
        "completion_percentage": "50%",
        "expected_completion": "2024-12-20",
        "last_updated": "2024-12-15"
    }

def get_pre_post_transfer_kpi_deltas(username: str) -> dict:
    """Get pre and post transfer KPI deltas for a specific user"""
    return {
        "user": username,
        "data_type": "Pre and post transfer KPI deltas",
        "kpis": [
            {"metric": "Productivity Score", "pre_transfer": 85, "post_transfer": 92, "delta": "+7", "improvement": "8.2%"},
            {"metric": "Customer Satisfaction", "pre_transfer": 4.2, "post_transfer": 4.6, "delta": "+0.4", "improvement": "9.5%"},
            {"metric": "Project Completion Rate", "pre_transfer": 78, "post_transfer": 83, "delta": "+5", "improvement": "6.4%"},
            {"metric": "Team Collaboration Score", "pre_transfer": 3.8, "post_transfer": 4.1, "delta": "+0.3", "improvement": "7.9%"}
        ],
        "overall_improvement": "7.8%",
        "transfer_date": "2024-11-01",
        "measurement_period": "30 days post-transfer",
        "last_updated": "2024-12-15"
    }

def get_training_gap_analysis(username: str) -> dict:
    """Get training gap analysis for a specific user"""
    return {
        "user": username,
        "data_type": "Training gap analysis",
        "skill_gaps": [
            {"skill": "Advanced Excel", "current_level": "Intermediate", "required_level": "Advanced", "priority": "High", "training_hours": 20},
            {"skill": "Project Management", "current_level": "Basic", "required_level": "Intermediate", "priority": "Medium", "training_hours": 40},
            {"skill": "Data Analysis", "current_level": "Beginner", "required_level": "Intermediate", "priority": "High", "training_hours": 35},
            {"skill": "Leadership", "current_level": "None", "required_level": "Basic", "priority": "Low", "training_hours": 25}
        ],
        "total_training_hours_needed": 120,
        "estimated_completion_time": "3 months",
        "budget_required": "$2,400",
        "last_updated": "2024-12-15"
    }

def get_sales_leaderboard_rankings(username: str) -> dict:
    """Get sales leaderboard rankings for a specific user"""
    return {
        "user": username,
        "data_type": "Sales leaderboard rankings",
        "current_ranking": {
            "position": 5,
            "total_sales": "$125,000",
            "quota_achievement": "104%",
            "deals_closed": 12
        },
        "top_performers": [
            {"rank": 1, "name": "Sarah Johnson", "sales": "$180,000", "quota_achievement": "150%"},
            {"rank": 2, "name": "Mike Chen", "sales": "$165,000", "quota_achievement": "138%"},
            {"rank": 3, "name": "Lisa Rodriguez", "sales": "$155,000", "quota_achievement": "129%"},
            {"rank": 4, "name": "David Kim", "sales": "$140,000", "quota_achievement": "117%"},
            {"rank": 5, "name": username, "sales": "$125,000", "quota_achievement": "104%"}
        ],
        "period": "Q4 2024",
        "last_updated": "2024-12-15"
    }

def get_new_client_acquisition_metrics(username: str) -> dict:
    """Get new client acquisition metrics for a specific user"""
    return {
        "user": username,
        "data_type": "New client acquisition metrics",
        "metrics": {
            "new_clients_acquired": 8,
            "conversion_rate": "15.2%",
            "average_deal_size": "$18,500",
            "time_to_close": "45 days",
            "client_retention_rate": "92%"
        },
        "quarterly_breakdown": [
            {"month": "October", "new_clients": 3, "revenue": "$45,000"},
            {"month": "November", "new_clients": 2, "revenue": "$38,000"},
            {"month": "December", "new_clients": 3, "revenue": "$65,000"}
        ],
        "total_new_revenue": "$148,000",
        "target_achievement": "118%",
        "last_updated": "2024-12-15"
    }


def _wrap(username: str, data_type: str, payload: dict) -> dict:
    return {
        "user": username,
        "data_type": data_type,
        "last_updated": TODAY,
        **payload,
    }


def get_quarter_end_variance_schedules(username: str) -> dict:
    return _wrap(
        username,
        "Quarter-end variance schedules",
        {
            "variances": [
                {"account": "Revenue", "plan": 1200000, "actual": 1175000, "variance": -25000},
                {"account": "COGS", "plan": 300000, "actual": 315000, "variance": 15000},
            ]
        },
    )


def get_invoices_over_threshold(username: str) -> dict:
    return _wrap(
        username,
        "Invoices over threshold",
        {
            "threshold": "$10 000",
            "invoices": [
                {"invoice_id": "INV-09231", "amount": "$12 450", "vendor": "Contoso Ltd", "status": "pending"},
                {"invoice_id": "INV-09307", "amount": "$18 300", "vendor": "Fabrikam Inc", "status": "approved"},
            ],
        },
    )


def get_pending_contract_redlines(username: str) -> dict:
    return _wrap(
        username,
        "Pending contract redlines",
        {
            "contracts": [
                {"contract_id": "CTR-4410", "counterparty": "Northwind", "version": 3, "section": "Indemnity"},
                {"contract_id": "CTR-4422", "counterparty": "Adventure Works", "version": 2, "section": "Payment"},
            ]
        },
    )


def get_customer_signature_status(username: str) -> dict:
    return _wrap(
        username,
        "Customer signature status",
        {
            "documents": [
                {"doc_id": "MSA-2025-07", "customer": "Wingtip Toys", "sent": "2025-05-14", "signed": False},
                {"doc_id": "SLA-4015-A", "customer": "Tailspin", "sent": "2025-05-02", "signed": True},
            ]
        },
    )


def get_vendor_arbitration_documents(username: str) -> dict:
    return _wrap(
        username,
        "Vendor arbitration documents",
        {
            "cases": [
                {"case_id": "ARB-88-22", "vendor": "Fabrikam", "stage": "response due", "due_date": "2025-06-10"},
            ]
        },
    )


def get_shipping_discrepancy_logs(username: str) -> dict:
    return _wrap(
        username,
        "Shipping discrepancy logs",
        {
            "incidents": [
                {"shipment_id": "SHIP-7721", "type": "shortage", "units": 15, "resolution": "pending"},
                {"shipment_id": "SHIP-7844", "type": "damage", "units": 4, "resolution": "credit issued"},
            ]
        },
    )


def get_control_test_evidence(username: str) -> dict:
    return _wrap(
        username,
        "Control test evidence",
        {
            "controls_tested": 12,
            "exceptions": 1,
            "evidence_links": [
                "https://sharepoint/controls/CNTR-105-evidence.pdf",
                "https://sharepoint/controls/CNTR-112-screenshots.zip",
            ],
        },
    )


def get_remediation_status_matrix(username: str) -> dict:
    return _wrap(
        username,
        "Remediation status matrix",
        {
            "open_items": 3,
            "items": [
                {"id": "RM-0042", "control": "Access review", "owner": "IT-Sec", "due": "2025-06-20"},
            ],
        },
    )


def get_inter_site_transfer_approvals(username: str) -> dict:
    return _wrap(
        username,
        "Inter-site transfer approvals",
        {
            "transfers": [
                {"request_id": "TR-0099", "from": "NYC", "to": "SJC", "status": "approved"},
                {"request_id": "TR-0102", "from": "DAL", "to": "SEA", "status": "pending"},
            ]
        },
    )


def get_mobility_stipend_usage(username: str) -> dict:
    return _wrap(
        username,
        "Mobility stipend usage",
        {
            "annual_allowance": "$1 200",
            "spent_to_date": "$450",
            "transactions": [
                {"date": "2025-02-03", "category": "Bike share", "amount": "$150"},
                {"date": "2025-03-18", "category": "Transit pass", "amount": "$300"},
            ],
        },
    )


def get_endpoint_patch_compliance_summary(username: str) -> dict:
    return _wrap(
        username,
        "Endpoint patch compliance summary",
        {
            "devices": 12,
            "compliant": 10,
            "non_compliant": 2,
            "percentage": "83.3%",
        },
    )


def get_root_cause_analysis_failed_updates(username: str) -> dict:
    return _wrap(
        username,
        "Root-cause analysis on failed updates",
        {
            "failed_updates": [
                {"update_id": "KB5032147", "error": "0x80070005", "root_cause": "access denied"},
            ]
        },
    )


def get_capex_spend_vs_budget_detail(username: str) -> dict:
    return _wrap(
        username,
        "CAPEX spend vs budget detail",
        {
            "budget": "$500 000",
            "actual": "$475 000",
            "variance": "-$25 000",
            "major_line_items": [
                {"project": "Data-center UPS", "budget": "$75 000", "actual": "$81 000"},
            ],
        },
    )


def get_asset_recovery_forms(username: str) -> dict:
    return _wrap(
        username,
        "Asset recovery forms",
        {"forms_pending": 2, "forms": ["ARF-0118", "ARF-0121"]},
    )


def get_engagement_survey_verbatims(username: str) -> dict:
    return _wrap(
        username,
        "Engagement survey verbatims",
        {
            "count": 4,
            "highlights": [
                "Communication between teams has improved.",
                "Need clearer performance metrics.",
            ],
        },
    )


def get_mentor_mentee_pairing_outcomes(username: str) -> dict:
    return _wrap(
        username,
        "Mentor-mentee pairing outcomes",
        {
            "pairings": 1,
            "outcomes": [{"mentor": "Alice", "mentee": username, "status": "active"}],
        },
    )


def get_signed_nda_archive(username: str) -> dict:
    return _wrap(
        username,
        "Signed NDA archive",
        {
            "ndas": [
                {"nda_id": "NDA-8891", "signed_on": "2025-01-12", "counterparty": "Contoso"},
            ]
        },
    )


def get_employee_relations_case_notes(username: str) -> dict:
    return _wrap(
        username,
        "Employee relations case notes",
        {
            "open_cases": 0,
            "closed_cases": 1,
            "notes": [
                {"case_id": "ER-2024-17", "summary": "Work-schedule dispute resolved amicably"},
            ],
        },
    )


def get_attendance_variance_sheet(username: str) -> dict:
    return _wrap(
        username,
        "Attendance variance sheet",
        {
            "days_worked": 120,
            "late_arrivals": 3,
            "unplanned_absences": 2,
        },
    )


def get_exception_based_overtime_approvals(username: str) -> dict:
    return _wrap(
        username,
        "Exception-based overtime approvals",
        {
            "overtime_requests": [
                {"request_id": "OT-530", "hours": 6, "approved_by": "Mgr1"},
            ]
        },
    )


def get_conflict_mediation_transcripts(username: str) -> dict:
    return _wrap(
        username,
        "Conflict mediation transcripts",
        {"transcript_links": ["https://sharepoint/mediation/TR-0099.txt"]},
    )


def get_policy_violation_closure_memos(username: str) -> dict:
    return _wrap(
        username,
        "Policy violation closure memos",
        {"memos": ["PVCM-2025-04.pdf"]},
    )


def get_aged_receivables_escalation_list(username: str) -> dict:
    return _wrap(
        username,
        "Aged receivables escalation list",
        {
            "total_outstanding": "$42 000",
            "over_90_days": "$12 500",
            "top_accounts": [
                {"account": "WideWorld Importers", "amount": "$7 800"},
            ],
        },
    )

# ---------------------------------------------------------------------------
# Consolidator – accepts MANY usernames ➟ nests results from every helper
# ---------------------------------------------------------------------------
def get_consolidated_data_multiple_people(usernames: list[str]) -> dict:
    consolidated: dict[str, dict] = {}
    for name in usernames:
        consolidated[name] = {
            "quarter_end_variance": get_quarter_end_variance_schedules(name),
            "invoices_over_threshold": get_invoices_over_threshold(name),
            "pending_contract_redlines": get_pending_contract_redlines(name),
            "customer_signature_status": get_customer_signature_status(name),
            "vendor_arbitration": get_vendor_arbitration_documents(name),
            "shipping_discrepancies": get_shipping_discrepancy_logs(name),
            "control_test_evidence": get_control_test_evidence(name),
            "remediation_status": get_remediation_status_matrix(name),
            "transfer_approvals": get_inter_site_transfer_approvals(name),
            "mobility_stipend": get_mobility_stipend_usage(name),
            "patch_compliance": get_endpoint_patch_compliance_summary(name),
            "root_cause_analysis": get_root_cause_analysis_failed_updates(name),
            "capex_spend": get_capex_spend_vs_budget_detail(name),
            "asset_recovery": get_asset_recovery_forms(name),
            "survey_verbatims": get_engagement_survey_verbatims(name),
            "mentor_pairing": get_mentor_mentee_pairing_outcomes(name),
            "nda_archive": get_signed_nda_archive(name),
            "employee_relations": get_employee_relations_case_notes(name),
            "attendance_variance": get_attendance_variance_sheet(name),
            "overtime_approvals": get_exception_based_overtime_approvals(name),
            "mediation_transcripts": get_conflict_mediation_transcripts(name),
            "policy_violations": get_policy_violation_closure_memos(name),
            "aged_receivables": get_aged_receivables_escalation_list(name),
            "vendor_risk_ratings": get_vendor_risk_ratings_complete(name),
            "asset_checkout": get_asset_checkout_records(name),
            "hr_clearance": get_final_hr_clearance_forms(name),
            "kpi_deltas": get_pre_post_transfer_kpi_deltas(name),
            "training_gaps": get_training_gap_analysis(name),
            "sales_rankings": get_sales_leaderboard_rankings(name),
            "client_acquisition": get_new_client_acquisition_metrics(name),
        }

    return {
        "users": usernames,
        "total_users": len(usernames),
        "last_updated": TODAY,
        "user_data": consolidated,
    }
