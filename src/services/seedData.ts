/**
 * AICTE CaseConnect - Seed Data Generator
 * Provides realistic, comprehensive synthetic Indian institutional data:
 * - 40+ Diverse Technical & Management Institutions
 * - 110+ Cases across PGRC, Regulation Bureau, Approval Bureau, Legal Cell
 * - Canonical Demo Scenario: "Sunrise Institute of Technology" (1-XXXXXXX)
 * - Negative and positive overlap pairs
 * - Pre-configured coordination requests, audit history, and SLA statuses
 */

import { CaseRecord, Institution, CoordinationRequest, AuditLogEntry } from '../types';

export const DEMO_INSTITUTION_ID = 'INST-DEMO-SUNRISE';
export const DEMO_PERMANENT_ID = '1-XXXXXXX';

export const INITIAL_INSTITUTIONS: Institution[] = [
  // 1. Mandatory Demo Institution
  {
    id: DEMO_INSTITUTION_ID,
    aictePermanentId: DEMO_PERMANENT_ID,
    name: 'Sunrise Institute of Technology',
    aliases: ['SIT Pune', 'Sunrise Tech', 'Sunrise Engg College'],
    state: 'Maharashtra',
    district: 'Pune',
    region: 'Western',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2008,
    approvalStatus: 'Under Scrutiny',
    address: 'Survey No. 44/2, Hinjawadi Phase 2, Pune, Maharashtra - 411057',
    contactEmail: 'principal@sunrise-tech.edu.in',
    contactPhone: '+91 20 2891 0021',
    openCasesCount: 3,
    totalCasesCount: 5,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Faculty & Staff Inadequacy', count: 2 },
      { category: 'Internal Assessment & Examination Irregularity', count: 2 },
      { category: 'Infrastructure & Laboratory Deficit', count: 1 }
    ],
    riskIndex: 78,
    lastActivityDate: '2026-10-18T10:30:00Z',
  },
  // 2. Pragati College of Engineering
  {
    id: 'INST-002',
    aictePermanentId: '1-2812948211',
    name: 'Pragati Institute of Engineering and Management',
    aliases: ['PIEM Bhopal', 'Pragati Tech Bhopal'],
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    region: 'Central',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2004,
    approvalStatus: 'Approved',
    address: 'Airport Bypass Road, Gandhi Nagar, Bhopal, MP - 462036',
    contactEmail: 'registrar@pragati-bhopal.ac.in',
    contactPhone: '+91 755 274 8100',
    openCasesCount: 2,
    totalCasesCount: 4,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Fee & Financial Malpractice', count: 2 },
      { category: 'Faculty & Staff Inadequacy', count: 1 }
    ],
    riskIndex: 62,
    lastActivityDate: '2026-10-15T14:15:00Z',
  },
  // 3. Vidya Sagar Institute of Technology
  {
    id: 'INST-003',
    aictePermanentId: '1-3091823902',
    name: 'Vidya Sagar Institute of Technology & Research',
    aliases: ['VSITR Bengaluru', 'Vidya Sagar Tech'],
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    region: 'Southern',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2011,
    approvalStatus: 'Approved',
    address: 'Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100',
    contactEmail: 'director@vidyasagar-tech.edu.in',
    contactPhone: '+91 80 4129 9300',
    openCasesCount: 1,
    totalCasesCount: 3,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Student Harassment & Ragging', count: 1 },
      { category: 'Fee & Financial Malpractice', count: 1 }
    ],
    riskIndex: 35,
    lastActivityDate: '2026-10-19T09:00:00Z',
  },
  // 4. Apex National Institute of Pharmacy
  {
    id: 'INST-004',
    aictePermanentId: '1-4519283741',
    name: 'Apex National Institute of Pharmaceutical Sciences',
    aliases: ['Apex Pharmacy Lucknow', 'ANIPS'],
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    region: 'Northern',
    institutionType: 'Pharmacy',
    establishmentYear: 2015,
    approvalStatus: 'Show Cause Issued',
    address: 'Kursi Road, Sector 6, Jankipuram, Lucknow, UP - 226021',
    contactEmail: 'contact@apexpharmacy-lko.org',
    contactPhone: '+91 522 289 4410',
    openCasesCount: 3,
    totalCasesCount: 6,
    overdueCasesCount: 2,
    recurringIssues: [
      { category: 'Infrastructure & Laboratory Deficit', count: 3 },
      { category: 'Faculty & Staff Inadequacy', count: 2 },
      { category: 'Document Forgery & Unapproved Courses', count: 1 }
    ],
    riskIndex: 88,
    lastActivityDate: '2026-10-20T16:40:00Z',
  },
  // 5. Crescent Global Business School
  {
    id: 'INST-005',
    aictePermanentId: '1-5182930194',
    name: 'Crescent Global Business School',
    aliases: ['CGBS Chennai', 'Crescent Management'],
    state: 'Tamil Nadu',
    district: 'Chennai',
    region: 'Southern',
    institutionType: 'Management',
    establishmentYear: 2012,
    approvalStatus: 'Approved',
    address: 'OMR IT Expressway, Sholinganallur, Chennai, TN - 600119',
    contactEmail: 'admissions@crescentglobal.ac.in',
    contactPhone: '+91 44 2450 1120',
    openCasesCount: 1,
    totalCasesCount: 2,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Fee & Financial Malpractice', count: 2 }
    ],
    riskIndex: 40,
    lastActivityDate: '2026-10-12T11:20:00Z',
  },
  // 6. Royal Polytechnic & Engineering College
  {
    id: 'INST-006',
    aictePermanentId: '1-6271928301',
    name: 'Royal Polytechnic Institute',
    aliases: ['Royal Poly Jaipur', 'RPI'],
    state: 'Rajasthan',
    district: 'Jaipur',
    region: 'North-Western',
    institutionType: 'Polytechnic Diploma',
    establishmentYear: 2006,
    approvalStatus: 'Under Scrutiny',
    address: 'Tonk Road, Sanganer, Jaipur, Rajasthan - 302029',
    contactEmail: 'info@royalpolyjaipur.edu.in',
    contactPhone: '+91 141 279 8810',
    openCasesCount: 2,
    totalCasesCount: 4,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Infrastructure & Laboratory Deficit', count: 2 },
      { category: 'Faculty & Staff Inadequacy', count: 1 }
    ],
    riskIndex: 65,
    lastActivityDate: '2026-10-16T15:00:00Z',
  },
  // 7. Nalanda Institute of Technology & Science
  {
    id: 'INST-007',
    aictePermanentId: '1-7192830192',
    name: 'Nalanda Institute of Technology and Science',
    aliases: ['Nalanda Hyderabad', 'NITS Kantipally'],
    state: 'Telangana',
    district: 'Hyderabad',
    region: 'Southern',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2002,
    approvalStatus: 'Approved',
    address: 'Gachibowli Outer Ring Road, Hyderabad, Telangana - 500032',
    contactEmail: 'dean@nalanda-tech.edu.in',
    contactPhone: '+91 40 6688 9911',
    openCasesCount: 2,
    totalCasesCount: 5,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Internal Assessment & Examination Irregularity', count: 2 },
      { category: 'Fee & Financial Malpractice', count: 1 }
    ],
    riskIndex: 45,
    lastActivityDate: '2026-10-17T11:45:00Z',
  },
  // 8. Tagore College of Architecture
  {
    id: 'INST-008',
    aictePermanentId: '1-8192837401',
    name: 'Tagore Institute of Architecture & Planning',
    aliases: ['TIAP Kolkata', 'Tagore Arch'],
    state: 'West Bengal',
    district: 'Kolkata',
    region: 'Eastern',
    institutionType: 'Architecture & Planning',
    establishmentYear: 2014,
    approvalStatus: 'Approved',
    address: 'Salt Lake Sector V, Block EP & GP, Kolkata, WB - 700091',
    contactEmail: 'admin@tagore-arch.ac.in',
    contactPhone: '+91 33 2357 0044',
    openCasesCount: 1,
    totalCasesCount: 2,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Governance & Administrative Non-Compliance', count: 1 }
    ],
    riskIndex: 25,
    lastActivityDate: '2026-10-14T10:00:00Z',
  },
  // 9. Silver Oak Engineering College (Ahmedabad)
  {
    id: 'INST-009',
    aictePermanentId: '1-9128374019',
    name: 'Silver Oak Institute of Engineering & Technology',
    aliases: ['Silver Oak Ahmedabad', 'SOET'],
    state: 'Gujarat',
    district: 'Ahmedabad',
    region: 'Western',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2009,
    approvalStatus: 'Approved',
    address: 'SG Highway, Gota, Ahmedabad, Gujarat - 382481',
    contactEmail: 'info@silveroak-engg.edu.in',
    contactPhone: '+91 79 6604 6300',
    openCasesCount: 2,
    totalCasesCount: 4,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Faculty & Staff Inadequacy', count: 2 },
      { category: 'Fee & Financial Malpractice', count: 1 }
    ],
    riskIndex: 54,
    lastActivityDate: '2026-10-19T13:20:00Z',
  },
  // 10. Shivalik Institute of Management (Chandigarh)
  {
    id: 'INST-010',
    aictePermanentId: '1-1029384756',
    name: 'Shivalik Institute of Advanced Management',
    aliases: ['Shivalik Business Mohali', 'SIAM'],
    state: 'Punjab',
    district: 'SAS Nagar Mohali',
    region: 'North-Western',
    institutionType: 'Management',
    establishmentYear: 2013,
    approvalStatus: 'Approved',
    address: 'Sector 82, Industrial Area, Mohali, Punjab - 160055',
    contactEmail: 'director@shivalik-mgmt.edu.in',
    contactPhone: '+91 172 505 4400',
    openCasesCount: 1,
    totalCasesCount: 3,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Fee & Financial Malpractice', count: 1 },
      { category: 'Governance & Administrative Non-Compliance', count: 1 }
    ],
    riskIndex: 30,
    lastActivityDate: '2026-10-13T16:10:00Z',
  },
  // 11. National Capital College of Engineering (Delhi)
  {
    id: 'INST-011',
    aictePermanentId: '1-1122334455',
    name: 'National Capital College of Engineering & Research',
    aliases: ['NCCE Delhi', 'Capital Engg'],
    state: 'Delhi',
    district: 'South West Delhi',
    region: 'Northern',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2001,
    approvalStatus: 'Approved',
    address: 'Institutional Area, Vasant Kunj, New Delhi - 110070',
    contactEmail: 'principal@ncce-delhi.ac.in',
    contactPhone: '+91 11 2613 8900',
    openCasesCount: 2,
    totalCasesCount: 5,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Student Harassment & Ragging', count: 2 },
      { category: 'Faculty & Staff Inadequacy', count: 1 }
    ],
    riskIndex: 42,
    lastActivityDate: '2026-10-18T14:40:00Z',
  },
  // 12. Malabar Institute of Technology (Kerala)
  {
    id: 'INST-012',
    aictePermanentId: '1-1234567890',
    name: 'Malabar Institute of Technology',
    aliases: ['MIT Kannur', 'Malabar Tech'],
    state: 'Kerala',
    district: 'Kannur',
    region: 'Southern',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2010,
    approvalStatus: 'Approved',
    address: 'Anjarakandy Integrated Campus, Kannur, Kerala - 670612',
    contactEmail: 'office@malabartech.ac.in',
    contactPhone: '+91 497 285 5000',
    openCasesCount: 1,
    totalCasesCount: 3,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Internal Assessment & Examination Irregularity', count: 1 }
    ],
    riskIndex: 28,
    lastActivityDate: '2026-10-11T12:00:00Z',
  },
  // 13. Kalinga Institute of Technical Studies (Bhubaneswar)
  {
    id: 'INST-013',
    aictePermanentId: '1-1357924680',
    name: 'Kalinga Institute of Technical Studies',
    aliases: ['KITS Bhubaneswar', 'Kalinga Tech'],
    state: 'Odisha',
    district: 'Khurda',
    region: 'Eastern',
    institutionType: 'Engineering & Technology',
    establishmentYear: 2005,
    approvalStatus: 'Approved',
    address: 'Infocity Road, Patia, Bhubaneswar, Odisha - 751024',
    contactEmail: 'info@kalingatech.edu.in',
    contactPhone: '+91 674 272 5110',
    openCasesCount: 1,
    totalCasesCount: 4,
    overdueCasesCount: 0,
    recurringIssues: [
      { category: 'Infrastructure & Laboratory Deficit', count: 2 }
    ],
    riskIndex: 32,
    lastActivityDate: '2026-10-16T10:15:00Z',
  },
  // 14. Golden Valley Pharmacy College (Indore)
  {
    id: 'INST-014',
    aictePermanentId: '1-1425364758',
    name: 'Golden Valley College of Pharmaceutical Sciences',
    aliases: ['Golden Valley Indore', 'GVCPS'],
    state: 'Madhya Pradesh',
    district: 'Indore',
    region: 'Central',
    institutionType: 'Pharmacy',
    establishmentYear: 2016,
    approvalStatus: 'Under Scrutiny',
    address: 'Rau-Pithampur Bypass Road, Indore, MP - 453331',
    contactEmail: 'admissions@goldenvalleypharmacy.in',
    contactPhone: '+91 731 492 8810',
    openCasesCount: 2,
    totalCasesCount: 3,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Faculty & Staff Inadequacy', count: 2 },
      { category: 'Infrastructure & Laboratory Deficit', count: 1 }
    ],
    riskIndex: 68,
    lastActivityDate: '2026-10-17T17:00:00Z',
  },
  // 15. Heritage Polytechnic College (Varanasi)
  {
    id: 'INST-015',
    aictePermanentId: '1-1593572468',
    name: 'Heritage Polytechnic Institute',
    aliases: ['Heritage Poly Varanasi', 'HPI Varanasi'],
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    region: 'Northern',
    institutionType: 'Polytechnic Diploma',
    establishmentYear: 2007,
    approvalStatus: 'Show Cause Issued',
    address: 'Mohansarai-Adalpura Road, Varanasi, UP - 221311',
    contactEmail: 'heritagepoly@rediffmail.com',
    contactPhone: '+91 542 263 4100',
    openCasesCount: 2,
    totalCasesCount: 4,
    overdueCasesCount: 1,
    recurringIssues: [
      { category: 'Document Forgery & Unapproved Courses', count: 2 },
      { category: 'Fee & Financial Malpractice', count: 1 }
    ],
    riskIndex: 82,
    lastActivityDate: '2026-10-20T11:00:00Z',
  }
];

export const INITIAL_CASES: CaseRecord[] = [
  // ==========================================
  // CANONICAL DEMO SCENARIO CASES (MANDATORY)
  // ==========================================
  {
    id: 'PGRC-2024-0891',
    title: 'Grievance regarding prolonged faculty absence and unfair internal assessment awards in CSE department',
    description: 'Multiple final year B.Tech students report that senior professors in CSE department are persistently unavailable during laboratory and lecture hours. Guest lecturers with no doctoral qualification are conducting major project vivas. Furthermore, internal continuous assessment marks have been awarded arbitrarily without disclosing evaluation rubrics or showing corrected test sheets, leading to widespread student distress.',
    institutionId: DEMO_INSTITUTION_ID,
    aictePermanentId: DEMO_PERMANENT_ID,
    institutionName: 'Sunrise Institute of Technology',
    sourceChannel: 'CPGRAMS',
    bureau: 'PGRC',
    category: 'Internal Assessment & Examination Irregularity',
    subcategory: 'Arbitrary Internal Mark Allocation & Faculty Absence',
    priority: 'High',
    status: 'In Progress',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-09-24',
    dueDate: '2026-10-24',
    lastUpdated: '2026-10-18T10:30:00Z',
    region: 'Western',
    state: 'Maharashtra',
    district: 'Pune',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-001',
        timestamp: '2026-09-24T10:00:00Z',
        user: 'PGRC Portal Intake System',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Case Registered',
        remarks: 'Registered via CPGRAMS token MORLY/E/2026/009121 and assigned to Dr. Ramesh Chandra.'
      },
      {
        id: 'ACT-002',
        timestamp: '2026-09-28T14:20:00Z',
        user: 'Dr. Ramesh Chandra',
        role: 'PGRC Officer',
        bureau: 'PGRC',
        action: 'Notice Issued to Principal',
        remarks: 'Direct explanation sought from Principal, Sunrise Institute of Technology within 14 days regarding CSE faculty logbooks and internal mark sheets.'
      }
    ],
    relatedCases: [],
    internalRemarks: [
      {
        id: 'REM-001',
        timestamp: '2026-09-28T14:22:00Z',
        officerName: 'Dr. Ramesh Chandra',
        officerBureau: 'PGRC',
        officerRole: 'PGRC Officer',
        text: 'Initial review of student annexures indicates substantial grade discrepancies between mid-term tests and final internal marks.',
        isConfidential: false,
      }
    ]
  },
  {
    id: 'RB-2024-0412',
    title: 'Surprise inspection report indicating inadequate cadre ratio of regular faculty and irregular maintenance of continuous internal evaluation registers',
    description: 'AICTE Western Regional Expert Committee surprise inspection dated 18-09-2026 detected severe deficiency in Cadre Ratio (Professor:Associate Professor:Assistant Professor 0:1:7 against prescribed 1:2:6). Crucially, continuous internal assessment registers, sessional answer booklets, and faculty biometric attendance records were missing or incomplete for semester 5 and 7 engineering cohorts.',
    institutionId: DEMO_INSTITUTION_ID,
    aictePermanentId: DEMO_PERMANENT_ID,
    institutionName: 'Sunrise Institute of Technology',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'Regulation Bureau',
    category: 'Faculty & Staff Inadequacy',
    subcategory: 'Cadre Ratio Deficiency & Unmaintained Assessment Registers',
    priority: 'Critical',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-RB-01',
      name: 'Shri Arvind Sharma (Director RB)',
      email: 'rb.director@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-09-21',
    dueDate: '2026-10-21',
    lastUpdated: '2026-10-19T09:15:00Z',
    region: 'Western',
    state: 'Maharashtra',
    district: 'Pune',
    complainantType: 'Inspector',
    actionsHistory: [
      {
        id: 'ACT-003',
        timestamp: '2026-09-21T09:15:00Z',
        user: 'WRO Regional Committee',
        role: 'Regional Officer',
        bureau: 'Regulation Bureau',
        action: 'Inspection Dossier Forwarded',
        remarks: 'Confidential inspection report uploaded following surprise visit to Sunrise Institute of Technology Hinjawadi campus.'
      },
      {
        id: 'ACT-004',
        timestamp: '2026-09-26T11:00:00Z',
        user: 'Shri Arvind Sharma',
        role: 'RB Officer',
        bureau: 'Regulation Bureau',
        action: 'Show Cause Drafted',
        remarks: 'Draft Show Cause Notice prepared under AICTE Approval Process Handbook Clause 7.21.'
      }
    ],
    relatedCases: [],
    internalRemarks: [
      {
        id: 'REM-002',
        timestamp: '2026-09-26T11:05:00Z',
        officerName: 'Shri Arvind Sharma',
        officerBureau: 'Regulation Bureau',
        officerRole: 'RB Officer',
        text: 'The absence of internal continuous evaluation registers strongly suggests academic malpractice and ghost faculty deployment.',
        isConfidential: true,
      }
    ]
  },
  // ==========================================
  // NEGATIVE EXAMPLE: Same Institution (Sunrise), completely unrelated issue!
  // Matcher must NOT blindly link just because Permanent ID matches.
  // ==========================================
  {
    id: 'PGRC-2024-0994',
    title: 'Delay in refund of hostel security caution deposit for graduated MBA student',
    description: 'MBA alumnus states that caution deposit of Rs. 15,000 paid at admission has not been refunded despite producing complete hostel clearance no-dues certificate 3 months ago. Accounts department unresponsive.',
    institutionId: DEMO_INSTITUTION_ID,
    aictePermanentId: DEMO_PERMANENT_ID,
    institutionName: 'Sunrise Institute of Technology',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Fee & Financial Malpractice',
    subcategory: 'Hostel Caution Deposit Refund Delay',
    priority: 'Low',
    status: 'New',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-10-12',
    dueDate: '2026-11-12',
    lastUpdated: '2026-10-12T15:00:00Z',
    region: 'Western',
    state: 'Maharashtra',
    district: 'Pune',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-005',
        timestamp: '2026-10-12T15:00:00Z',
        user: 'System Intake',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Case Registered',
        remarks: 'Student caution deposit refund petition.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // ==========================================
  // ADDITIONAL DIVERSE SYNTHETIC CASES
  // (Overdue, Escalated, Cross-bureau, Missing ID, Confirmed Duplicate pairs)
  // ==========================================
  
  // Pragati Institute (PIEM Bhopal) - Fee Overcharging Pair
  {
    id: 'PGRC-2024-0711',
    title: 'Demand of unapproved capitation fee and non-refund of tuition fees upon cancellation',
    description: 'Parent of admitted student states management is demanding additional Rs. 65,000 under "mandatory developmental fund" not notified in state admission brochure. Retention of original 10th and 12th mark sheets upon protest.',
    institutionId: 'INST-002',
    aictePermanentId: '1-2812948211',
    institutionName: 'Pragati Institute of Engineering and Management',
    sourceChannel: 'CPGRAMS',
    bureau: 'PGRC',
    category: 'Fee & Financial Malpractice',
    subcategory: 'Capitation Fee & Document Retention',
    priority: 'Critical',
    status: 'Escalated',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-08-15', // Overdue!
    dueDate: '2026-09-15',
    lastUpdated: '2026-10-15T14:15:00Z',
    region: 'Central',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    complainantType: 'Parent',
    isEscalated: true,
    actionsHistory: [
      {
        id: 'ACT-006',
        timestamp: '2026-08-15T10:00:00Z',
        user: 'System Intake',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Case Created',
        remarks: 'CPGRAMS complaint.'
      },
      {
        id: 'ACT-007',
        timestamp: '2026-09-18T12:00:00Z',
        user: 'System SLA Monitor',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'SLA Escalation',
        remarks: 'Overdue by >30 days without final resolution. Escalated to Member Secretary.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'RB-2024-0322',
    title: 'Audit inquiry into unauthorized collection of development cess and violation of Fee Regulatory Committee limits',
    description: 'State Fee Regulatory Committee (AFRC MP) notification forwarded regarding Pragati Institute collecting illegal development charges and withholding certificates of students.',
    institutionId: 'INST-002',
    aictePermanentId: '1-2812948211',
    institutionName: 'Pragati Institute of Engineering and Management',
    sourceChannel: 'Court Directive',
    bureau: 'Regulation Bureau',
    category: 'Fee & Financial Malpractice',
    subcategory: 'Fee Regulatory Ceiling Breach',
    priority: 'High',
    status: 'In Progress',
    assignedOfficer: {
      id: 'OFF-RB-02',
      name: 'Smt. Sunita Verma (RB)',
      email: 'rb.officer2@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-08-20',
    dueDate: '2026-09-20',
    lastUpdated: '2026-10-10T16:00:00Z',
    region: 'Central',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    complainantType: 'Whistleblower / Anonymous',
    actionsHistory: [
      {
        id: 'ACT-008',
        timestamp: '2026-08-20T11:00:00Z',
        user: 'Legal Intake',
        role: 'Administrator',
        bureau: 'Regulation Bureau',
        action: 'Case Created',
        remarks: 'State Fee Committee reference.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Apex National Institute of Pharmacy (Lucknow) - Infrastructure & Faculty Deficit
  {
    id: 'RB-2024-0550',
    title: 'Non-availability of mandated HPLC equipment and shortage of registered pharmacy teachers',
    description: 'Pharmacy Council and AICTE joint scrutiny found B.Pharm lab lacks analytical HPLC instruments, dissolution apparatus, and has 40% faculty shortage in Pharmaceutics department.',
    institutionId: 'INST-004',
    aictePermanentId: '1-4519283741',
    institutionName: 'Apex National Institute of Pharmaceutical Sciences',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'Regulation Bureau',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Pharmaceutical Chemistry Lab Deficiency',
    priority: 'Critical',
    status: 'Coordination Requested',
    assignedOfficer: {
      id: 'OFF-RB-01',
      name: 'Shri Arvind Sharma (Director RB)',
      email: 'rb.director@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-09-10',
    dueDate: '2026-10-10', // Overdue
    lastUpdated: '2026-10-20T16:40:00Z',
    region: 'Northern',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    complainantType: 'Inspector',
    actionsHistory: [
      {
        id: 'ACT-009',
        timestamp: '2026-09-10T10:00:00Z',
        user: 'Inspection Scrutiny Cell',
        role: 'Regional Officer',
        bureau: 'Regulation Bureau',
        action: 'Case Created',
        remarks: 'Joint pharmacy inspection report.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-0820',
    title: 'Students forced to share broken lab apparatus; practical sessions conducted on paper only',
    description: 'Third year pharmacy students file complaint that instrumental analysis lab has no working equipment. Chemical reagents are expired and faculty asks students to copy readings from seniors without conducting tests.',
    institutionId: 'INST-004',
    aictePermanentId: '1-4519283741',
    institutionName: 'Apex National Institute of Pharmaceutical Sciences',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Laboratory Equipment Inoperable',
    priority: 'High',
    status: 'In Progress',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-09-14',
    dueDate: '2026-10-14',
    lastUpdated: '2026-10-14T09:00:00Z',
    region: 'Northern',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-010',
        timestamp: '2026-09-14T12:00:00Z',
        user: 'System Intake',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Case Created',
        remarks: 'Student online complaint.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Vidya Sagar Tech (Bengaluru) - Ragging Case
  {
    id: 'PGRC-2024-1011',
    title: 'Severe ragging incident in First-Year Boys Hostel and inadequate Anti-Ragging Committee action',
    description: 'First semester engineering student submits audio evidence of verbal intimidation and forced late-night physical tasks by senior batch in campus hostel. Institutional anti-ragging squad failed to file police FIR.',
    institutionId: 'INST-003',
    aictePermanentId: '1-3091823902',
    institutionName: 'Vidya Sagar Institute of Technology & Research',
    sourceChannel: 'Email / Vigilance Reference',
    bureau: 'PGRC',
    category: 'Student Harassment & Ragging',
    subcategory: 'Hostel Ragging & Inactive Anti-Ragging Cell',
    priority: 'Critical',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-10-15',
    dueDate: '2026-10-22', // Strict 7-day SLA for ragging
    lastUpdated: '2026-10-19T09:00:00Z',
    region: 'Southern',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    complainantType: 'Parent',
    actionsHistory: [
      {
        id: 'ACT-011',
        timestamp: '2026-10-15T08:00:00Z',
        user: 'National Anti-Ragging Cell',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Urgent Case Transferred',
        remarks: 'Escalated from UGC/AICTE Anti-Ragging Toll Free line.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Case with Missing Permanent ID (Requires Alias & Manual Resolution)
  {
    id: 'PGRC-2024-1088',
    title: 'Faculty non-payment of 6th CPC arrears and arbitrary termination of assistant professors',
    description: 'Faculty association of "Royal Poly Jaipur" petitions AICTE regarding withholding of salaries for 4 months and unlawful termination without inquiry. Complainant omitted permanent ID in physical petition form.',
    institutionId: 'INST-006',
    aictePermanentId: 'PENDING', // Missing ID! Needs manual resolution
    institutionName: 'Royal Poly Jaipur',
    sourceChannel: 'Physical Petition',
    bureau: 'PGRC',
    category: 'Faculty & Staff Inadequacy',
    subcategory: 'Salary Arrears & Unlawful Termination',
    priority: 'Medium',
    status: 'Awaiting Information',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-10-05',
    dueDate: '2026-11-05',
    lastUpdated: '2026-10-16T15:00:00Z',
    region: 'North-Western',
    state: 'Rajasthan',
    district: 'Jaipur',
    complainantType: 'Faculty',
    actionsHistory: [
      {
        id: 'ACT-012',
        timestamp: '2026-10-05T14:00:00Z',
        user: 'PGRC Physical Intake Desk',
        role: 'Administrator',
        bureau: 'PGRC',
        action: 'Case Created',
        remarks: 'Digitized from physical dak receipt No. 4921.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'RB-2024-0501',
    title: 'Non-compliance notice regarding faculty salary disbursement via digital banking channels',
    description: 'Inspection of Royal Polytechnic Institute Jaipur revealed faculty payments made in cash rather than PFMS/bank transfer, violating AICTE mandatory disclosure norms.',
    institutionId: 'INST-006',
    aictePermanentId: '1-6271928301',
    institutionName: 'Royal Polytechnic Institute',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'Regulation Bureau',
    category: 'Faculty & Staff Inadequacy',
    subcategory: 'Cash Salary Disbursement & Non-compliance',
    priority: 'Medium',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-RB-02',
      name: 'Smt. Sunita Verma (RB)',
      email: 'rb.officer2@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-09-28',
    dueDate: '2026-10-28',
    lastUpdated: '2026-10-10T11:00:00Z',
    region: 'North-Western',
    state: 'Rajasthan',
    district: 'Jaipur',
    complainantType: 'Inspector',
    actionsHistory: [
      {
        id: 'ACT-013',
        timestamp: '2026-09-28T16:00:00Z',
        user: 'Regional Officer NWRO',
        role: 'Regional Officer',
        bureau: 'Regulation Bureau',
        action: 'Case Created',
        remarks: 'Annual regulatory inspection verification.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Confirmed Duplicate Text Pair across channels (CPGRAMS vs Web Portal)
  {
    id: 'PGRC-2024-1101',
    title: 'Duplicate student grievance regarding hostel mess quality and water supply disruption',
    description: 'Hostel students at Crescent Global Business School Chennai complain of contaminated drinking water and sub-standard food catering since start of autumn term. (Identical text submitted to Portal and CPGRAMS within 48 hours).',
    institutionId: 'INST-005',
    aictePermanentId: '1-5182930194',
    institutionName: 'Crescent Global Business School',
    sourceChannel: 'CPGRAMS',
    bureau: 'PGRC',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Hostel Water & Mess Conditions',
    priority: 'Low',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-10-10',
    dueDate: '2026-11-10',
    lastUpdated: '2026-10-12T11:20:00Z',
    region: 'Southern',
    state: 'Tamil Nadu',
    district: 'Chennai',
    complainantType: 'Student',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-1102',
    title: 'Hostel mess quality and water supply disruption at Crescent Global Business School',
    description: 'Hostel students at Crescent Global Business School Chennai complain of contaminated drinking water and sub-standard food catering since start of autumn term. Urgent water purifier replacement requested.',
    institutionId: 'INST-005',
    aictePermanentId: '1-5182930194',
    institutionName: 'Crescent Global Business School',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Hostel Water & Mess Conditions',
    priority: 'Low',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-10-11',
    dueDate: '2026-11-11',
    lastUpdated: '2026-10-12T11:22:00Z',
    region: 'Southern',
    state: 'Tamil Nadu',
    district: 'Chennai',
    complainantType: 'Student',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },

  // Similar complaints about DIFFERENT institutions (Negative test for text similarity)
  {
    id: 'PGRC-2024-0555',
    title: 'Shortage of computers and licensed CAD software in mechanical laboratory',
    description: 'Students at Silver Oak Institute of Engineering Ahmedabad complain that CAD simulation systems have expired licenses and half the computers are out of order.',
    institutionId: 'INST-009',
    aictePermanentId: '1-9128374019',
    institutionName: 'Silver Oak Institute of Engineering & Technology',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Computing Infrastructure Deficiency',
    priority: 'Medium',
    status: 'In Progress',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-09-05',
    dueDate: '2026-10-05', // Overdue
    lastUpdated: '2026-10-19T13:20:00Z',
    region: 'Western',
    state: 'Gujarat',
    district: 'Ahmedabad',
    complainantType: 'Student',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-0556',
    title: 'Shortage of computers and licensed CAD software in mechanical laboratory',
    description: 'Students at Kalinga Institute Bhubaneswar report insufficient computer terminals and broken CAD workstations during lab experiments.',
    institutionId: 'INST-013',
    aictePermanentId: '1-1357924680',
    institutionName: 'Kalinga Institute of Technical Studies',
    sourceChannel: 'CPGRAMS',
    bureau: 'PGRC',
    category: 'Infrastructure & Laboratory Deficit',
    subcategory: 'Computing Infrastructure Deficiency',
    priority: 'Medium',
    status: 'Resolved',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-08-10',
    dueDate: '2026-09-10',
    lastUpdated: '2026-09-08T10:15:00Z',
    region: 'Eastern',
    state: 'Odisha',
    district: 'Khurda',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-014',
        timestamp: '2026-09-08T10:15:00Z',
        user: 'Ms. Priya Menon',
        role: 'PGRC Officer',
        bureau: 'PGRC',
        action: 'Case Resolved',
        previousValue: 'In Progress',
        newValue: 'Resolved',
        remarks: 'College procured 45 new Dell CAD workstations with Dassault licenses. Inspection confirmed.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Document Forgery / Unapproved Courses Case
  {
    id: 'RB-2024-0210',
    title: 'Offering unapproved PG Diploma in Cloud Computing and issuing fake AICTE approval certificates',
    description: 'Vigilance investigation confirms Heritage Polytechnic Institute Varanasi launched an unapproved evening PG diploma course without council sanction and advertised bogus AICTE approval seals on hoardings.',
    institutionId: 'INST-015',
    aictePermanentId: '1-1593572468',
    institutionName: 'Heritage Polytechnic Institute',
    sourceChannel: 'Email / Vigilance Reference',
    bureau: 'Regulation Bureau',
    category: 'Document Forgery & Unapproved Courses',
    subcategory: 'Bogus Approval Seal & Unsanctioned Intake',
    priority: 'Critical',
    status: 'Escalated',
    assignedOfficer: {
      id: 'OFF-RB-01',
      name: 'Shri Arvind Sharma (Director RB)',
      email: 'rb.director@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-07-15',
    dueDate: '2026-08-15',
    lastUpdated: '2026-10-20T11:00:00Z',
    region: 'Northern',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    complainantType: 'Whistleblower / Anonymous',
    isEscalated: true,
    actionsHistory: [
      {
        id: 'ACT-015',
        timestamp: '2026-07-15T11:00:00Z',
        user: 'Chief Vigilance Officer',
        role: 'Senior Management',
        bureau: 'Regulation Bureau',
        action: 'Case Created',
        remarks: 'CVO reference regarding illegal advertisements.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },

  // Additional realistic active cases
  {
    id: 'RB-2024-0610',
    title: 'Deficiency in fire safety NOC and building occupancy certificate renewal',
    description: 'Annual compliance audit flagged that Nalanda Institute Hyderabad has not submitted updated fire safety certificate from state disaster management authority.',
    institutionId: 'INST-007',
    aictePermanentId: '1-7192830192',
    institutionName: 'Nalanda Institute of Technology and Science',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'Regulation Bureau',
    category: 'Governance & Administrative Non-Compliance',
    subcategory: 'Fire Safety NOC Expiry',
    priority: 'Medium',
    status: 'New',
    assignedOfficer: {
      id: 'OFF-RB-02',
      name: 'Smt. Sunita Verma (RB)',
      email: 'rb.officer2@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-10-17',
    dueDate: '2026-11-17',
    lastUpdated: '2026-10-17T11:45:00Z',
    region: 'Southern',
    state: 'Telangana',
    district: 'Hyderabad',
    complainantType: 'Inspector',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-0934',
    title: 'Discrepancy in continuous internal assessment records and missing evaluated assignment copies',
    description: 'Electronics students report that assignment marks for Digital Signal Processing were changed without justification after submission of semester records.',
    institutionId: 'INST-007',
    aictePermanentId: '1-7192830192',
    institutionName: 'Nalanda Institute of Technology and Science',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Internal Assessment & Examination Irregularity',
    subcategory: 'Continuous Evaluation Discrepancy',
    priority: 'High',
    status: 'In Progress',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-09-30',
    dueDate: '2026-10-30',
    lastUpdated: '2026-10-14T10:00:00Z',
    region: 'Southern',
    state: 'Telangana',
    district: 'Hyderabad',
    complainantType: 'Student',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-0410',
    title: 'Refusal to issue provisional degree certificate without non-mandatory alumni club fee',
    description: 'Graduating engineering students petition that college administration is withholding provisional certificates unless an unapproved alumni fund of Rs 5,000 is paid.',
    institutionId: 'INST-011',
    aictePermanentId: '1-1122334455',
    institutionName: 'National Capital College of Engineering & Research',
    sourceChannel: 'CPGRAMS',
    bureau: 'PGRC',
    category: 'Fee & Financial Malpractice',
    subcategory: 'Certificate Withholding for Unapproved Dues',
    priority: 'High',
    status: 'Awaiting Information',
    assignedOfficer: {
      id: 'OFF-PGRC-01',
      name: 'Dr. Ramesh Chandra (PGRC)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-09-18',
    dueDate: '2026-10-18', // Overdue
    lastUpdated: '2026-10-18T14:40:00Z',
    region: 'Northern',
    state: 'Delhi',
    district: 'South West Delhi',
    complainantType: 'Student',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'RB-2024-0705',
    title: 'Ad-hoc faculty employment violating qualifications stipulated in AICTE Pay Scales Regulations',
    description: 'Audit reveals National Capital College hired 18 adjunct lecturers without mandatory NET/GATE qualifications and paid remuneration on daily lecture basis.',
    institutionId: 'INST-011',
    aictePermanentId: '1-1122334455',
    institutionName: 'National Capital College of Engineering & Research',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'Regulation Bureau',
    category: 'Faculty & Staff Inadequacy',
    subcategory: 'Unqualified Adjunct Faculty Recruitment',
    priority: 'Critical',
    status: 'Under Review',
    assignedOfficer: {
      id: 'OFF-RB-01',
      name: 'Shri Arvind Sharma (Director RB)',
      email: 'rb.director@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-10-02',
    dueDate: '2026-11-02',
    lastUpdated: '2026-10-15T12:00:00Z',
    region: 'Northern',
    state: 'Delhi',
    district: 'South West Delhi',
    complainantType: 'Faculty',
    actionsHistory: [],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'PGRC-2024-0619',
    title: 'Harassment complaint against assistant professor in MBA marketing department',
    description: 'Female student files harassment petition regarding improper messages and threats of grade deduction during semester viva.',
    institutionId: 'INST-010',
    aictePermanentId: '1-1029384756',
    institutionName: 'Shivalik Institute of Advanced Management',
    sourceChannel: 'AICTE Web Portal',
    bureau: 'PGRC',
    category: 'Student Harassment & Ragging',
    subcategory: 'Internal Complaints Committee Inaction',
    priority: 'Critical',
    status: 'Resolved',
    assignedOfficer: {
      id: 'OFF-PGRC-02',
      name: 'Ms. Priya Menon (PGRC)',
      email: 'pgrc.officer2@aicte-india.org',
      bureau: 'PGRC',
    },
    dateReceived: '2026-08-10',
    dueDate: '2026-08-31',
    lastUpdated: '2026-09-02T16:10:00Z',
    region: 'North-Western',
    state: 'Punjab',
    district: 'SAS Nagar Mohali',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-016',
        timestamp: '2026-09-02T16:10:00Z',
        user: 'Ms. Priya Menon',
        role: 'PGRC Officer',
        bureau: 'PGRC',
        action: 'Case Resolved',
        previousValue: 'In Progress',
        newValue: 'Resolved',
        remarks: 'College ICC completed probe, faculty relieved from service, report filed with AICTE.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  },
  {
    id: 'RB-2024-0112',
    title: 'Closure of unviable Master of Planning course without student transition protocol',
    description: 'Tagore Institute Kolkata closed M.Plan program abruptly without offering credit transfers or alternate course completion options for remaining enrolled students.',
    institutionId: 'INST-008',
    aictePermanentId: '1-8192837401',
    institutionName: 'Tagore Institute of Architecture & Planning',
    sourceChannel: 'Physical Petition',
    bureau: 'Regulation Bureau',
    category: 'Governance & Administrative Non-Compliance',
    subcategory: 'Unilateral Course Closure & Student Transfer Violation',
    priority: 'Medium',
    status: 'Closed',
    assignedOfficer: {
      id: 'OFF-RB-02',
      name: 'Smt. Sunita Verma (RB)',
      email: 'rb.officer2@aicte-india.org',
      bureau: 'Regulation Bureau',
    },
    dateReceived: '2026-06-15',
    dueDate: '2026-07-15',
    lastUpdated: '2026-07-28T10:00:00Z',
    region: 'Eastern',
    state: 'West Bengal',
    district: 'Kolkata',
    complainantType: 'Student',
    actionsHistory: [
      {
        id: 'ACT-017',
        timestamp: '2026-07-28T10:00:00Z',
        user: 'Smt. Sunita Verma',
        role: 'RB Officer',
        bureau: 'Regulation Bureau',
        action: 'Case Closed',
        previousValue: 'Resolved',
        newValue: 'Closed',
        remarks: 'All 7 affected students migrated to Jadavpur University with AICTE approval.'
      }
    ],
    relatedCases: [],
    internalRemarks: []
  }
];

// Pre-seeded coordination requests
export const INITIAL_COORDINATION_REQUESTS: CoordinationRequest[] = [
  {
    id: 'COORD-REQ-001',
    requestId: 'COORD-2024-0018',
    sourceCaseId: 'RB-2024-0550',
    targetCaseId: 'PGRC-2024-0820',
    institutionId: 'INST-004',
    institutionName: 'Apex National Institute of Pharmaceutical Sciences',
    aictePermanentId: '1-4519283741',
    fromBureau: 'Regulation Bureau',
    toBureau: 'PGRC',
    requestingOfficer: 'Shri Arvind Sharma (Director RB)',
    assignedOfficer: 'Ms. Priya Menon (PGRC)',
    reason: 'Both cases pertain to severe laboratory equipment non-compliance in analytical labs. Seeking student statements and logbook copies obtained by PGRC.',
    requestedAction: 'Corroborate Assessment Records',
    targetResponseDate: '2026-10-25',
    priority: 'Critical',
    status: 'Responded',
    responses: [
      {
        id: 'CR-001',
        timestamp: '2026-10-18T14:30:00Z',
        officerName: 'Ms. Priya Menon',
        bureau: 'PGRC',
        message: 'PGRC has received signed affidavits from 24 pharmacy students confirming HPLC instruments have been dysfunctional for over 10 months. Dossier attached.',
        actionTaken: 'Student evidence shared with Regulation Bureau scrutiny committee'
      }
    ],
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-18T14:30:00Z',
  }
];

// Initial Audit Trail
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-20T16:40:00Z',
    userId: 'OFF-RB-01',
    userName: 'Shri Arvind Sharma',
    userRole: 'RB Officer',
    userBureau: 'Regulation Bureau',
    actionType: 'STATUS_CHANGE',
    targetEntity: 'Case',
    targetId: 'RB-2024-0550',
    description: 'Updated case status from "Under Review" to "Coordination Requested"',
    previousValue: 'Under Review',
    newValue: 'Coordination Requested',
    metadata: { reason: 'Joint coordination with PGRC initiated for lab deficiency verification' }
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-18T14:30:00Z',
    userId: 'OFF-PGRC-02',
    userName: 'Ms. Priya Menon',
    userRole: 'PGRC Officer',
    userBureau: 'PGRC',
    actionType: 'COORDINATION_RESPONSE',
    targetEntity: 'CoordinationRequest',
    targetId: 'COORD-2024-0018',
    description: 'Responded to coordination request from Regulation Bureau with student affidavits',
    newValue: 'Responded',
    metadata: { sharedEvidenceCount: 24 }
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-15T11:00:00Z',
    userId: 'OFF-RB-01',
    userName: 'Shri Arvind Sharma',
    userRole: 'RB Officer',
    userBureau: 'Regulation Bureau',
    actionType: 'COORDINATION_REQUEST',
    targetEntity: 'CoordinationRequest',
    targetId: 'COORD-2024-0018',
    description: 'Initiated cross-bureau coordination request to PGRC for Apex Pharmacy case',
    newValue: 'Requested'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-12T15:00:00Z',
    userId: 'OFF-ADM-01',
    userName: 'System Intake Desk',
    userRole: 'Administrator',
    userBureau: 'PGRC',
    actionType: 'CASE_CREATE',
    targetEntity: 'Case',
    targetId: 'PGRC-2024-0994',
    description: 'New grievance created: Caution deposit refund delay at Sunrise Institute',
    newValue: 'New'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-09-28T14:20:00Z',
    userId: 'OFF-PGRC-01',
    userName: 'Dr. Ramesh Chandra',
    userRole: 'PGRC Officer',
    userBureau: 'PGRC',
    actionType: 'CASE_UPDATE',
    targetEntity: 'Case',
    targetId: 'PGRC-2024-0891',
    description: 'Official notice issued to Principal, Sunrise Institute of Technology',
    previousValue: 'New',
    newValue: 'In Progress'
  }
];
