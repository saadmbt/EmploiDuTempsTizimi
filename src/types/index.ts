
export interface Session {
  id: string;
  formateur: string;
  groupe: string;
  module: string;
  jour: string;
  creneau: number;
  salle: string;
}

export interface Cell {
  day: string;
  slot: number;
}

export type FilterType = 'formateur' | 'groupe' | 'salle';

export interface Filter {
  type: FilterType;
  value: string;
}
