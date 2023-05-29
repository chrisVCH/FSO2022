import { useState } from "react";
import { Typography, Box, Button } from '@mui/material';
import { Patient, Entry } from "../../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from './EntryDetails';
import AddPatientEntry from "../AddPatientEntry";
import { EntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import axios from 'axios';

export interface IPatientDetailProps {
  patients: Patient[];
  patient: Patient | null | undefined;
  diagnoseCodes: Array<string>;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
};

const PatientDetail = ({ patients, patient, diagnoseCodes, setPatients }: IPatientDetailProps): JSX.Element => { 
  const [entryForm, setEntryForm] = useState<string>('');
  const [error, setError] = useState<string>();

  const showEntryForm = (entry: string): void => {
    setEntryForm(entry);
  }

  const hideEntryForm = (): void => {
    setEntryForm('');
  }

  const submitNewEntry = async (values: EntryWithoutId, id: string) => {
    try { 
      const updatedPatient = await patientService.addNewEntry(values, id);
      const newPatients = patients.map(p => p.id === id ? updatedPatient : p);
      setPatients(newPatients);
      setEntryForm('');
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (!patient) {
    return (<></>);
  } else 
  return (
  <>
    <Box pt={3}>
    <Typography display="block" align="left" variant="h5">
      <b>{patient.name} </b>
      {patient.gender === 'male' && <MaleIcon />}
      {patient.gender === 'female' && <FemaleIcon />}
      {patient.gender !== 'male' && patient.gender !== 'female' && <TransgenderIcon />}
    </Typography>
    </Box>
    <Box pt={2}>
      ssn: {patient.ssn}<br />
      occupation: {patient.occupation}
    </Box>
    {entryForm !== '' && <AddPatientEntry onClose={hideEntryForm} onSubmit={submitNewEntry} id={patient.id} error={error} diagnoseCodes={diagnoseCodes} />}
    <br />
    <br />
    <Box pt={3}>
    <Typography display="block" align="left" variant="h6">
      <b>entries: </b>
    </Typography>
    </Box>
    {patient.entries.map((e: Entry) => (
      <>
        <Box key={'box'+ e.id}
          sx={{
            borderRadius: 2,
            border: 1,
            pl: 1,
            mb: 2
          }}
        >
          <EntryDetails key={'edet'+ e.id} entry={e} />
        </Box>
      </>
    ))}
    <Button variant="contained" onClick={() => showEntryForm('HealthCheck')}>
        Add New Entry
    </Button>
  </>
)};

export default PatientDetail;