import React from 'react';
import { OccupationalHealthcareEntry } from '../../types';
import WorkIcon from '@mui/icons-material/Work';

export interface IOccupationalHealthcareEntryDetailProps {
  ocucupationalHealthcareEntry: OccupationalHealthcareEntry
};

const OccupationalHealthcareEntryDetail: React.FunctionComponent<IOccupationalHealthcareEntryDetailProps> = ({ ocucupationalHealthcareEntry }) => {
    const oentry = ocucupationalHealthcareEntry as OccupationalHealthcareEntry;
    return (
      <div>
        {oentry.date} <WorkIcon /> {oentry.employerName} <br />
        {oentry.description}  <br />
        diagnose by {oentry.specialist}
      </div>
    );
};

export default OccupationalHealthcareEntryDetail;