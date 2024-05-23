/**
 * Build a tests badge.
 * @param {TestReportData} data Test report data
 * @returns {BadgeContent} Badge content
 */
export function buildBadge(data) {
  const content = {};
  content.message = `${data.passed} passed`;
  content.color = data.passed > 0 ? 'brightgreen' : 'lightgrey';
  if (data.failed > 0) {
    content.message += `, ${data.failed} failed`;
    content.color = 'red';
  }
  if (data.skipped > 0) {
    content.message += `, ${data.skipped} skipped`;
  }
  return content;
}
