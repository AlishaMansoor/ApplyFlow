

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export const formatSalary = (salaryRange) => {
  if (!salaryRange) return 'Not disclosed';
  const { min, max, currency } = salaryRange;
  const inLakhs = (n) => (n / 100000).toFixed(1) + 'L';
  return `${currency} ${inLakhs(min)} - ${inLakhs(max)}`;
}