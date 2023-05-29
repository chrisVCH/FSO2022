import React from 'react';
import { HospitalEntry } from '../../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export interface IHospitalEntryProps {
  hospitalEntry: HospitalEntry
};

const HospitalEntryDetail: React.FunctionComponent<IHospitalEntryProps> = ({ hospitalEntry }) => {
  return (
    <div>
      {hospitalEntry.date} <LocalHospitalIcon /><br />
      {hospitalEntry.description}<br />
      discharge: {hospitalEntry.discharge.date}<br />  
      criteria: {hospitalEntry.discharge.criteria}
    </div>
  );
};

export default HospitalEntryDetail;