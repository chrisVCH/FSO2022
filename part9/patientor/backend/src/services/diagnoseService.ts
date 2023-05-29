import data from '../data/diagnoses';

import { Diagnose } from '../types';

const diagnoses: Diagnose[] = data as Diagnose[];

const getDiagnoses = (): Diagnose[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose
};