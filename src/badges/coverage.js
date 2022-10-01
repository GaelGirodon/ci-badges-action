/**
 * Build a coverage badge.
 * @param {*} data Badge data
 * @returns {import('./index.js').Badge} Badge content
 */
export function buildBadge(data) {
  const content = {};
  content.message = `${Math.floor(data.coverage)}%`;
  if (data.coverage <= 0) {
    content.color = 'red';
  } else if (data.coverage < 50) {
    content.color = 'orange';
  } else if (data.coverage < 80) {
    content.color = 'yellow';
  } else if (data.coverage < 90) {
    content.color = 'yellowgreen';
  } else if (data.coverage < 95) {
    content.color = 'green';
  } else {
    content.color = 'brightgreen';
  }
  return content;
}
