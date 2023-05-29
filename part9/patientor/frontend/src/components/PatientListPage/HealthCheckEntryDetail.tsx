import React from 'react';
import { HealthCheckEntry } from '../../types';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealthRatingBar from '../HealthRatingBar';

export interface IHealthCheckEntryDetailProps {
  healthCheckEntry: HealthCheckEntry
};

const HealthCheckEntryDetail: React.FunctionComponent<IHealthCheckEntryDetailProps> = ({ healthCheckEntry }) => {

  return (
    <div>
      {healthCheckEntry.date} <MedicalServicesIcon /><br />
      {healthCheckEntry.description}<br />
      <HealthRatingBar rating={healthCheckEntry.healthCheckRating} showText={false} />
      diagnose by {healthCheckEntry.specialist} 
    </div>);
};

export default HealthCheckEntryDetail;