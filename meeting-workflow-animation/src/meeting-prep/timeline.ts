// Global timeline, in seconds. Scenes mounted with <Sequence from={...}> use
// times local to their own start; everything here is absolute.
export const T = {
  clickReview: 2.8,
  prepDocStart: 2.95, // button morphs into the loading box, then the document
  homeEnd: 3.4,
  tabsStart: 4.6,
  contextStart: 4.9,
  clickAgenda: 7.85,
  tabToAgenda: 7.9, // active pill slides; outgoing view exits over 0.18s
  agendaStart: 8.02,
  clickTasks: 10.15,
  tabToTasks: 10.2,
  tasksStart: 10.3,
  hoverRow: 11.4,
  end: 12,
};
