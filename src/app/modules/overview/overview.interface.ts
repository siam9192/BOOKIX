export type TAdminOverviewAnalysisQuery = {
  year: string;
  month: string;
  day: string;
};

export type TMilestoneQuery = {
  type:'month'|'day'|'year',
  milestone:number
}