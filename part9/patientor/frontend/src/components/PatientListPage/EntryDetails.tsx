import React from 'react';
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../../types';
import HospitalEntryDetail from './HospitalEntryDetail';
import OccupationalHealthcareEntryDetail from './OccupationalHealthcareEntryDetail';
import HealthCheckEntryDetail from './HealthCheckEntryDetail';
import { assertNever } from '../../helper';

export interface IEntryDetailsProps {
  entry: Entry
};

const EntryDetails: React.FunctionComponent<IEntryDetailsProps> = ({ entry }) => {
  switch (entry.type) {
    case 'Hospital':
      const hentry = entry as HospitalEntry;
      return (<HospitalEntryDetail  hospitalEntry={hentry} />);
    case 'OccupationalHealthcare':
      const oentry = entry as OccupationalHealthcareEntry;
      return (<OccupationalHealthcareEntryDetail ocucupationalHealthcareEntry={oentry} />)
    case 'HealthCheck':
      const hcentry = entry as HealthCheckEntry;
      return (<HealthCheckEntryDetail healthCheckEntry={hcentry} />);
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;