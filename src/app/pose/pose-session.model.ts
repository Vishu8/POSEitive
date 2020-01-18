export interface PoseSession {
  userId: string;
  date: string;
  startTime: string;
  sessionTime: string;
  wrongCount: number;
}

export interface PoseSessionLog {
  _id: string;
  userId: string;
  date: string;
  startTime: string;
  sessionTime: string;
  wrongCount: number;
}
