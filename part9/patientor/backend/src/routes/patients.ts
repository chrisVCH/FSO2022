import express from "express";
import patientSerService from "../services/patientSerService";
import { toNewPatientEntry, toNewEntry } from "../utils";
import { EntryWithoutId } from "../types";

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientSerService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientSerService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientSerService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage = error.message; 
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patient = patientSerService.findById(req.params.id);
    if (!patient) {
      res.sendStatus(404);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const entry = toNewEntry(req.body);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const addedNewEntry = patientSerService.addNewEntry(patient, entry as EntryWithoutId);
      res.json(addedNewEntry);
    }
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;