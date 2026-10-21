/**
 * AICTE CaseConnect - CSV Export Service
 * Formats cases, institutions, and audit trails into clean, compliant CSV downloads.
 */

import { CaseRecord, Institution, AuditLogEntry } from '../types';

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function triggerDownload(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCasesToCsv(cases: CaseRecord[], fileName = 'AICTE_Cases_Report.csv') {
  const headers = [
    'Case ID',
    'AICTE Permanent ID',
    'Institution Name',
    'Bureau',
    'Category',
    'Subcategory',
    'Priority',
    'Status',
    'Assigned Officer',
    'Date Received',
    'Due Date',
    'State',
    'District',
    'Source Channel',
    'Related Cases Count',
    'Title',
    'Description'
  ];

  const rows = cases.map(c => [
    escapeCsvField(c.id),
    escapeCsvField(c.aictePermanentId),
    escapeCsvField(c.institutionName),
    escapeCsvField(c.bureau),
    escapeCsvField(c.category),
    escapeCsvField(c.subcategory),
    escapeCsvField(c.priority),
    escapeCsvField(c.status),
    escapeCsvField(c.assignedOfficer.name),
    escapeCsvField(c.dateReceived),
    escapeCsvField(c.dueDate),
    escapeCsvField(c.state),
    escapeCsvField(c.district),
    escapeCsvField(c.sourceChannel),
    escapeCsvField(c.relatedCases.length),
    escapeCsvField(c.title),
    escapeCsvField(c.description)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, fileName);
}

export function exportInstitutionsToCsv(institutions: Institution[], fileName = 'AICTE_Institutions_Report.csv') {
  const headers = [
    'Permanent ID',
    'Institution Name',
    'Aliases',
    'State',
    'District',
    'Region',
    'Institution Type',
    'Approval Status',
    'Establishment Year',
    'Open Cases',
    'Total Cases',
    'Overdue Cases',
    'Risk Index',
    'Last Activity'
  ];

  const rows = institutions.map(i => [
    escapeCsvField(i.aictePermanentId),
    escapeCsvField(i.name),
    escapeCsvField(i.aliases.join('; ')),
    escapeCsvField(i.state),
    escapeCsvField(i.district),
    escapeCsvField(i.region),
    escapeCsvField(i.institutionType),
    escapeCsvField(i.approvalStatus),
    escapeCsvField(i.establishmentYear),
    escapeCsvField(i.openCasesCount),
    escapeCsvField(i.totalCasesCount),
    escapeCsvField(i.overdueCasesCount),
    escapeCsvField(i.riskIndex),
    escapeCsvField(i.lastActivityDate)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, fileName);
}

export function exportAuditLogsToCsv(logs: AuditLogEntry[], fileName = 'AICTE_Audit_Trail_Report.csv') {
  const headers = [
    'Log ID',
    'Timestamp',
    'User Name',
    'Role',
    'Bureau',
    'Action Type',
    'Target Entity',
    'Target ID',
    'Description',
    'Previous Value',
    'New Value'
  ];

  const rows = logs.map(l => [
    escapeCsvField(l.id),
    escapeCsvField(l.timestamp),
    escapeCsvField(l.userName),
    escapeCsvField(l.userRole),
    escapeCsvField(l.userBureau),
    escapeCsvField(l.actionType),
    escapeCsvField(l.targetEntity),
    escapeCsvField(l.targetId),
    escapeCsvField(l.description),
    escapeCsvField(l.previousValue || ''),
    escapeCsvField(l.newValue || '')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, fileName);
}
