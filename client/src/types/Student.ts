import { Evaluation } from './Evaluation';

export interface Student {
  name: string;
  cpf: string;
  email: string;
  evaluations: Evaluation[];
}

export interface CreateStudentRequest {
  name: string;
  cpf: string;
  email: string;
  evaluations?: Evaluation[];
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  evaluations?: Evaluation[];
}