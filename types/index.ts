export class APIError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export type ComponentWithChildren = {
  children: React.ReactNode;
};

export type AppContextType = {
  EDUSAPIToken: string | null;
  user: UserData | null;
};

export type UserData = {
  userId: number;
  fullName: string;
  gender: "F" | "M";
  healthCenterCode: number;
};

export interface Appointment {
  TipoPaciente: number;
  fecCupo: string;
  horaCupo: string;
  codHoraCupo: number;
  conCupo: number;
  codSeccion: number;
  tipHoraCupo: number;
  tipHorario: number;
  tipProfesional: number;
  codProfesional: string;
  codConsultorio: number;
  dscConsultorio: string;
  nomProfesional: string;
}

export type Service = {
  code: number;
  description: string;
};

export type Specialty = {
  code: number;
  specialtyServiceCode: number;
  description: string;
};
