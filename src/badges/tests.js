/**
 * Build a tests badge.
 * @param {*} data Badge data
 * @returns {import('./index.js').Badge} Badge content
 */
export function buildBadge(data) {
  const content = {};
  content.message = `${data.passed} passed`;
  if (data.failed > 0) {
    content.message += `, ${data.failed} failed`;
  }
  content.color = data.failed == 0 ? 'brightgreen' : 'red';
  return content;
}
