export interface PoseSession {
  userId: string;
  date: string;
  startTime: string;
  sessionTime: string;
}

export interface WrongPosture {
  userId: string;
  sessionId: string;
  wrongCount: number;
}
