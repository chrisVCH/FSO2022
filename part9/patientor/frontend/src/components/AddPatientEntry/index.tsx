//import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';
import { Alert } from '@mui/material';
import AddEntryForm from './AddEntryForm';

import { EntryWithoutId } from '../../types';

interface Props {
  onClose: () => void;
  onSubmit: (values: EntryWithoutId, id: string) => void;
  id: string;
  error?: string;
  diagnoseCodes: Array<string>;
}

const AddPatientEntry = ({ onClose, onSubmit, id, error, diagnoseCodes }: Props) => (
  <> 
    { error && <Alert severity="error">{error}</Alert>}
    <br />
    <AddEntryForm onSubmit={onSubmit} onCancel={onClose} id={id} diagnoseCodes={diagnoseCodes} />
  </>
);

export default AddPatientEntry;