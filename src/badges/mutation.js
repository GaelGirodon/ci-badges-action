/**
 * Build a mutation badge.
 * @param {MutationReportData} data Mutation report data
 * @returns {BadgeContent} Badge content
 */
export function buildBadge(data) {
  const content = {};
  content.message = `${Math.floor(data.mutation)}%`;
  if (data.mutation <= 0) {
    content.color = 'red';
  } else if (data.mutation < 50) {
    content.color = 'orange';
  } else if (data.mutation < 80) {
    content.color = 'yellow';
  } else if (data.mutation < 90) {
    content.color = 'yellowgreen';
  } else if (data.mutation < 95) {
    content.color = 'green';
  } else {
    content.color = 'brightgreen';
  }
  return content;
}
