import { NewPatientEntry, Gender, HealthCheckRating, HealthCheckEntryWithoutId, OccupationalHealthcareEntryWithoutId, Diagnose, SickLeave, Discharge, HospitalEntryWithoutId, EntryWithoutId } from "./types";

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const isHealthCheckRating = (param: string): boolean => {
  return Number.isNaN(parseInt(param))
    ? false 
    : Object.values(HealthCheckRating).filter(v => !isNaN(Number(v))).includes(parseInt(param));
};

const isSickLeave = (param: object): boolean => {
  if (!param || !('startDate' in param) || !('endDate' in param)) {
    return false;
  } 
  return isDate(param.startDate as string) && isDate(param.endDate as string);
};

const isDischarge = (param: object): boolean => {
  if (!param || !('date' in param) || !('criteria' in param)) {
    return false;
  } 
  return isString(param.criteria as string) && isDate(param.date as string);
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth: ' + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing desecription');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date for entries: ' + date);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnose['code']>;    
  } 
  return object.diagnosisCodes as Array<Diagnose['code']>;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employer name');
  }
  return employerName;
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (!object || typeof object !== 'object' || !('sickLeave' in object)) {
    return undefined;    
  } 
  return isSickLeave(object) ? object as unknown as SickLeave : undefined;
};

const parseDischarge = (object: unknown): Discharge  => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - discharge');  
  } 
  if ('date' in object && 'criteria' in object && isDischarge(object)) {
    return object as unknown as Discharge;
  }
  throw new Error('Incorrect date: a field is missing or wrong input - discharge');
};

const parseHealthCheckRating = (object: unknown): number => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - health check rating');  
  } 
  if ('healthCheckRating' in object && isHealthCheckRating(object.healthCheckRating as string)) {
    return Number(object.healthCheckRating);
  }
  throw new Error('Incorrect date: a field is missing or wrong input - health check rating');
};


export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - patient entry');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object && 'entries' in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: []
    };
    return newEntry;  
  }
  
  throw new Error('Incorrect data: a field is missing - new patient entry');
};


const toNewHealthCheckEntry = (object: unknown): HealthCheckEntryWithoutId => {
  if ( !object || typeof object !== 'object') {
    throw new Error('Incorrect or missing date - healthcheck entry');
  }
  if ('healthCheckRating' in object && !isHealthCheckRating(object.healthCheckRating as string)) {
    throw new Error(`value of healthCheckRating incorrect: ${object.healthCheckRating}`);
  }

  if ('type' in object && 'healthCheckRating' in object && 'description' in object && 'date' in object && 'specialist' in object && isHealthCheckRating(object.healthCheckRating as string) ) {
    const newEntry: HealthCheckEntryWithoutId = {
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      type: 'HealthCheck',
      description: parseDescription(object.description),
      diagnosisCodes: parseDiagnosisCodes(object),
      healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
    };
    return newEntry;
  } 
   
  throw new Error('Incorrect data: a field is missing - healthcheck entry');
};

const toNewOccupationalHealthcareEntry = (object: unknown): OccupationalHealthcareEntryWithoutId => {
  if ( !object || typeof object !== 'object') {
    throw new Error('Incorrect or missing date - occupation health care entry');
  }
  if ('type' in object && 'employerName' in object && 'description' in object && 'date' in object && 'specialist' in object ) {
    const newEntry: OccupationalHealthcareEntryWithoutId = {
      date: parseDate(object.date),
      type: 'OccupationalHealthcare',
      specialist: parseSpecialist(object.specialist),
      employerName: parseEmployerName(object.employerName),
      diagnosisCodes: parseDiagnosisCodes(object),
      description: parseDescription(object.description),
      sickLeave: parseSickLeave(object)
    };
    return newEntry;
  }
  throw new Error('Incorrect data: a field is missing - healthcheck entry');
};

const toNewHospitalEntry = (object: unknown): HospitalEntryWithoutId => {
  if ( !object || typeof object !== 'object') {
    throw new Error('Incorrect or missing date - hospital entry');
  }
  if ('type' in object && 'discharge' in object && 'description' in object && 'date' in object && 'specialist' in object && isDischarge(object.discharge as object)) {
    const newEntry: HospitalEntryWithoutId = {
      date: parseDate(object.date),
      type: 'Hospital',
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
      description: parseDescription(object.description),
      discharge: parseDischarge(object.discharge)
    };
    return newEntry;
  }
  
  throw new Error('Incorrect data: a field is missing - hospital entry !!');
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if ( !object || typeof object !== 'object') {
    throw new Error('Incorrect or missing date - new entry');
  } else if (!('type' in object)) {
    throw new Error('Incorrect data: a field is missing - entry type!');
  } else {
    switch (object.type) {
      case 'Hospital':
        return toNewHospitalEntry(object);
      case 'OccupationalHealthcare':
        return toNewOccupationalHealthcareEntry(object);
      case 'HealthCheck':
        return toNewHealthCheckEntry(object);
      default: 
        throw new Error('Incorrect data: a field is missing - entry type!!');
    }
  }
};

export default {
  toNewPatientEntry,
  toNewHealthCheckEntry,
  toNewOccupationalHealthcareEntry,
  toNewHospitalEntry,
  toNewEntry
};