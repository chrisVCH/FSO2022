import { patients as pts }  from '../data/patients';
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatientEntry, NewPatientEntry, EntryWithoutId } from '../types';

const patients =  pts;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = () : NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
   }));
};

const addPatient = ( entry: NewPatientEntry ): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const newId = uuid();
  const newPatient = {
    id: newId,
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const addNewEntry = (patient: Patient, entry: EntryWithoutId): Patient => {
  const newId = uuid();
  const newEntry = {
    id: newId,
    ...entry
  };
  const updatedPatient = { ...patient, entries: patient.entries.concat(newEntry) };
  return updatedPatient;
};

const findById = (id: string): Patient | undefined => {
  const foundPatient = patients.find(p => p.id === id);
  return foundPatient;
};

export default {
  getPatients,
  getNonSensitivePatientEntries,
  addPatient,
  findById,
  addNewEntry
};