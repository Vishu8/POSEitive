export interface SessionLog {
  _id: string;
  userId: string;
  date: string;
  startTime: string;
  sessionTime: string;
  wrongCount: number;
}