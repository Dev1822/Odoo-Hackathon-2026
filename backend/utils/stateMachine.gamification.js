const transitions = {
  DRAFT: ['ACTIVE', 'ARCHIVED'],
  ACTIVE: ['UNDER_REVIEW', 'ARCHIVED'],
  UNDER_REVIEW: ['COMPLETED', 'ACTIVE', 'ARCHIVED'],
  COMPLETED: ['ARCHIVED'],
  ARCHIVED: []
};

const canTransition = (from, to) => {
  return transitions[from]?.includes(to) || false;
};

module.exports = { canTransition };
