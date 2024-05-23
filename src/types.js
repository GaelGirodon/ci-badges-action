/*
 * Common types
 */

/* Reports loading */

/**
 * @typedef {{ type: string, format: string, data: ReportData }} Report A loaded report
 * @typedef {{ type: 'tests', data: TestReportData } & Report} TestReport A loaded test report
 * @typedef {{ type: 'coverage', data: CoverageReportData } & Report} CoverageReport A loaded coverage report
 * @typedef {{ [key: string]: number }} ReportData Report data
 * @typedef {{ tests?: number, passed: number, failed: number, skipped: number }} TestReportData Test report data
 * @typedef {{ coverage: number }} CoverageReportData Coverage report data
 * @typedef {(root: string) => Promise<Omit<Report, 'format'>[]>} ReportsLoader A report(s) loader
 */

/* Badges generation */

/**
 * @typedef {{ name: string, badge: Badge }} NamedBadge A badge with a name
 * @typedef {{ schemaVersion: number, label: string } & BadgeContent} Badge A Shields badge
 * @typedef {{ message: string, color: string }} BadgeContent The generated content of a badge
 * @typedef {(data: any) => BadgeContent} BadgeGenerator A badge generator
 */
