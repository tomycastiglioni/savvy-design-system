// Global timeline, in seconds. Scenes mounted with <Sequence from={...}> use
// times local to their own start; everything here is absolute.
export const T = {
  homeEnd: 2.95,
  clickReview: 2.35,
  prepDocStart: 2.5, // button morphs into the loading box, then the document
  tabsStart: 3.95,
  contextStart: 4.15,
  clickAgenda: 6.45,
  tabToAgenda: 6.5, // active pill slides; outgoing view exits over 0.18s
  agendaStart: 6.62,
  clickTasks: 8.33,
  tabToTasks: 8.4,
  tasksStart: 8.5,
  end: 10,
};
