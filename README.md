AICTE CaseConnect
One Institution. Connected Cases. Coordinated Action.
Smart India Hackathon 2026 | Problem Statement ID: SIH26264

AICTE CaseConnect is a proposed institution-centric platform for monitoring and tracking institution-related complaints across AICTE Bureaus/Cells. It aims to provide a consolidated view of institution records and case histories, identify potentially related cases with explainable AI-assisted matching, and support authorized officers in coordinating follow-up actions.
Project status: Update this section to reflect the actual state of your prototype. Features described as planned are not necessarily implemented. Demonstrations should use synthetic data unless authorized real data is available.

Problem Statement
Institution-related complaints may be handled across different Bureaus/Cells. Without a consolidated institution-level view, it can be challenging to understand case histories, spot potentially related complaints, coordinate follow-ups, and monitor pending or overdue actions.

Proposed Solution
AICTE CaseConnect proposes an integrated dashboard that brings institution-related case information into one place and supports:
- Institution-level case visibility and a unified case timeline.
- AI-assisted identification of potentially related cases.
- Explainable match suggestions for officer review.
- Cross-Bureau coordination and follow-up tracking.
- SLA/deadline monitoring, escalation visibility, reporting, and audit trails.
  
The platform is intended to assist authorized officers; it does not automatically merge or close cases based on an AI match.

Core Modules
1. Institution Registry — Institution profiles using AICTE Permanent ID where available, with normalized names and aliases.
2. Unified Case Management — Complaint records, Bureau/Cell, category, assignment, status, dates, and case history.
3. Cross-Bureau Case Linkage — Candidate related-case suggestions using institution identity and complaint-text similarity.
4. Officer Review & Coordination — Authorized users can review, approve, or reject suggested links and record follow-up actions.
5. SLA & Escalation Monitoring — Configurable deadlines, pending/overdue indicators, and escalation workflow.
6. Analytics & Audit Trail — Workload summaries, case ageing, reports, and records of important actions.
   
How It Works
1. Receive case data — Enter or import authorized institution and complaint records.
2. Identify the institution — Match the AICTE Permanent ID first; use normalized names and aliases as a fallback.
3. Find potential links — Compare case metadata and complaint text to suggest potentially related records.
4. Explain the suggestion — Show the factors contributing to the match so a reviewer can assess it.
5. Review by an authorized officer — Approve or reject the proposed relationship. Cases remain separate records.
6. Coordinate and monitor — Track responsible teams, follow-up actions, deadlines, escalations, and audit history.
   
Proposed Technology Stack
Layer	Proposed technology	Purpose
Frontend	React + TypeScript	Dashboard, case views, review screens, and reports
Backend API	Python + FastAPI	Case-management and workflow APIs
Database	PostgreSQL	Institution records, cases, case links, assignments, and audit events
Matching	scikit-learn TF-IDF and text similarity	Baseline candidate matching with explainable signals
Charts	Recharts or Chart.js	Workload, case-ageing, and SLA visualizations
Security	Role-based access control	Restrict views and actions by user role


The stack is a proposed implementation direction. Replace it with the technologies actually used in the repository.

Example Use Case
A fictional institution has two complaints:
- Case A: Students report that faculty are frequently unavailable and internal marks are not being communicated.
- Case B: A compliance complaint refers to inadequate faculty availability and irregular assessment practices.
CaseConnect may suggest that the cases are potentially related because they refer to the same institution and contain overlapping topics. An authorized officer reviews the match explanation before approving or rejecting the link.

Note: This is an illustrative scenario, not a real AICTE case or an assertion about actual AICTE processes.

Implementation Roadmap
- [ ] Institution registry and institution identity resolution
- [ ] Case registration, assignment, status tracking, and timeline
- [ ] Role-based dashboards and access controls
- [ ] Explainable case-linkage baseline
- [ ] Officer review and coordination workflow
- [ ] SLA/deadline indicators and escalation rules
- [ ] Audit trail and CSV reporting
- [ ] Testing with synthetic, labeled data
- [ ] Evaluate precision, recall, and F1-score for case-link suggestions
- [ ] Security and usability review
- [ ] Explore external integrations only where authorized access and APIs are available
Tick each item only after it has been implemented and tested.

Evaluation Plan
The matching engine should be evaluated using a labeled test dataset. Useful measures include:
- Precision: Of the suggested links, how many are genuinely related?
- Recall: Of the known related case pairs, how many are identified?
- F1-score: A combined measure of precision and recall.
- Review time: Time required for an officer to assess a suggestion.
- Workflow checks: Correct handling of approvals, rejections, permissions, and audit events.
  
No performance figures are claimed here. Publish numerical results only after running and documenting tests.
Data, Privacy & Responsible Use
- Use synthetic or properly authorized data for demos and testing.
- Apply role-based permissions and protect sensitive complaint information.
- Keep an audit record of important decisions and case updates.
- Treat AI matches as suggestions, not proof that two complaints are duplicates.
- Do not automatically merge or close cases based solely on a similarity score.
- Integrate with external systems only with appropriate authorization and supported interfaces.

Repository Structure
The structure below is a suggestion; adjust it to match the actual repository.
aicte-caseconnect/
├── frontend/          # React + TypeScript application
├── backend/           # FastAPI application
├── docs/              # Architecture, workflows, and project documentation
├── tests/             # Unit and integration tests
├── sample-data/       # Synthetic demo data only
├── .env.example       # Example configuration keys (no secrets)
└── README.md

Getting Started
Setup instructions will depend on the implementation. Once the frontend and backend are added, document:
1. Required software and versions.
2. Environment-variable setup using .env.example.
3. Database creation and migrations.
4. Backend installation and run commands.
5. Frontend installation and run commands.
6. Test commands and demo login instructions, if applicable.
Do not commit passwords, API keys, access tokens, real complaint data, or production database credentials.

Expected Impact
- Better institution-level visibility across complaint records.
- Earlier identification of potentially related cases.
- More structured coordination and follow-up tracking.
- Improved visibility of pending and overdue actions.
- More traceable decisions and administrative reporting.
- 
These are intended outcomes and should be validated through prototype testing and stakeholder feedback.

Team & Acknowledgements
- Team name: Digital KrishiVaani
- Team ID: 196061
  
Disclaimer
AICTE CaseConnect is a student project concept for SIH 2026. It is not an official AICTE service and does not imply an official partnership, endorsement, access to internal systems, or use of real AICTE complaint data.

License
Choose and add a license before distributing the code publicly. Until a license is added, do not assume others have permission to reuse the repository.
