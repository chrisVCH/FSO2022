import { useState, SyntheticEvent } from "react";
import { EntryWithoutId, EntryTypes, SickLeave, Discharge } from "../../types";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { 
  Button, 
  TextField, 
  Box, 
  SelectChangeEvent, 
  InputLabel, 
  Select, 
  Divider, 
  Stack,
  OutlinedInput,
  MenuItem,
  FormControl,
  Chip
 } from '@mui/material';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId, id: string) => void;
  id: string;
  diagnoseCodes: Array<string>;
}

interface EntryOption {
  value: EntryTypes;
  label: string;
}

const entryOptions: EntryOption[] = Object.values(EntryTypes).map(e => ({
  value: e, label: e.toString()
}));

const AddEntryForm = ({ onCancel, onSubmit, id, diagnoseCodes }: Props) => {
  const [entry, setEntry] = useState(EntryTypes.healthCheck);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveInfo, setSickLeaveInfo] = useState<SickLeave>();
  const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: ''});

  const onEntryChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const entryValue = Object.values(EntryTypes).find(e => e.toString() === value);
      if (entryValue) {
        setEntry(entryValue);
      }
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    switch (entry) {
      case 'HealthCheck':
        onSubmit({
          type: 'HealthCheck',
          date,
          description,
          specialist,
          healthCheckRating: Number(healthCheckRating),
          diagnosisCodes
        }, id);
        break;
      case 'OccupationalHealthcare':
        onSubmit({
          type: 'OccupationalHealthcare',
          date,
          description,
          specialist,
          employerName,
          diagnosisCodes,
          sickLeave: sickLeaveInfo
        }, id);
        break;
      case 'Hospital':
        onSubmit({
          type: 'Hospital',
          date,
          description,
          specialist,
          diagnosisCodes,
          discharge
        }, id);
    }
  };

  return (
    <>
      <Box component="section"
        sx={{
          pt: 1,
          pl: 1,
          pr: 1,
          pb: 6,
          border: '1px dashed grey'
        }}
      >
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 5 }}>Select type of entries:</InputLabel>
        <Select
          label="Entry"
          fullWidth
          value={entry}
          onChange={onEntryChange}
          sx={{mb: 1}} 
        >
        {entryOptions.map(option =>
          <MenuItem
            key={option.label}
            value={option.value}
          >
            {option.label}</MenuItem>
        )}
        </Select>
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{mb: 1}}          
          value={description}
          required
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          type="date"
          label="Date"
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{mb: 1}}
          value={date}
          required
          InputLabelProps={{ shrink: true }} 
          onChange={e => setDate(e.target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{mb: 1}}          
          value={specialist}
          required
          onChange={({ target }) => setSpecialist(target.value)}
        />
        { entry === 'HealthCheck' && (
          <TextField
          label="Healthcheck Rating"
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{mb: 1}}          
          value={healthCheckRating}
          required
          onChange={({ target }) => setHealthCheckRating(target.value)}
          />
        )}
      <FormControl sx={{ width: 1135, mb: 1 }}>
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          fullWidth
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value as string[])} 
          input={<OutlinedInput label="Diagnosis Codes" />}
          renderValue={(selected) => (
            <Stack gap={1} direction="row" flexWrap="wrap">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => {
                    setDiagnosisCodes(
                      diagnosisCodes.filter((item) => item !== value)
                    )}
              }
                  deleteIcon={
                    <CancelIcon
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ))}
            </Stack>
          )}
        >
        {diagnoseCodes.map((code) => (
          <MenuItem
            key={code}
            value={code}
            sx={{ justifyContent: "space-between" }}
          >
            {code}
            {diagnosisCodes.includes(code) ? <CheckIcon color="info" /> : null}
          </MenuItem>
        ))}
        </Select>
      </FormControl>

      { entry === 'OccupationalHealthcare' && (
        <>
          <TextField
          label="Employer Name"
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{mb: 1}}          
          value={employerName}
          required
          onChange={({ target }) => setEmployerName(target.value)}
          />
          <InputLabel style={{ marginLeft: 10, marginBottom: 1 }} >Sick Leave</InputLabel>
          <br />
          <Stack spacing={2} direction="row" sx={{marginBottom: 1}}>
            <TextField
              type="date"
              variant='outlined'
              color='secondary'
              label="start date"
              onChange={({ target }): void => {
                const sickleave = { ...sickLeaveInfo, startDate: target.value }
                setSickLeaveInfo(sickleave as SickLeave);
              }}
              InputLabelProps={{ shrink: true }}
              value={sickLeaveInfo?.startDate}
              fullWidth
            />
            <TextField
              type="date"
              variant='outlined'
              color='secondary'
              label="end date"
              onChange={({ target }): void => {
                const sickleave = { ...sickLeaveInfo, endDate: target.value }
                setSickLeaveInfo(sickleave as SickLeave);
              }}
              InputLabelProps={{ shrink: true }}
              value={sickLeaveInfo?.endDate}
              fullWidth
            />
         </Stack>
         <br />
        </>)}
        <Divider />
        { entry === 'Hospital' && (
          <>
            <InputLabel style={{ marginTop: 2, marginLeft: 10, marginBottom: 1 }} >Discharge</InputLabel>
            <br />
            <Stack spacing={2} direction="row" sx={{marginBottom: 1}}>
              <TextField
                type="date"
                variant='outlined'
                color='secondary'
                label="date"
                onChange={(event): void => {
                  const dischargeinfo = { ...discharge, date: event.target.value }
                  setDischarge(dischargeinfo as Discharge);
                }}
                InputLabelProps={{ shrink: true }}
                value={discharge.date}
                required
                fullWidth
              />
              <TextField
                type="text"
                variant='outlined'
                color='secondary'
                label="criteria"
                onChange={(event): void => {
                  const dischargeinfo = { ...discharge, criteria: event.target.value }
                  setDischarge(dischargeinfo as Discharge);
                }}
                InputLabelProps={{ shrink: true }}
                value={discharge.criteria}
                required
                fullWidth
              />
            </Stack>
            <br />
          </>
        )}
        <br />
        <Button
          color="secondary"
          variant="contained"
          style={{ float: "left" }}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          style={{ 
            float: "right",
          }}
          type="submit"
          variant="contained"
        >
          Add
        </Button>
      </form>
    </Box>
  </>
)};

export default AddEntryForm;