import express from 'express';
import { calculateBmi } from './webBmiCalculator';
import { onlyNumbers } from './calculator_helper';
import { exerciseCalculator } from './webExercises';

const app = express();

app.use(express.json());

app.get('/bmi', (req, res) => {
  //res.send('Hello Full Stack!');
  const params = req.query;
  const height = params.height;
  const weight = params.weight;

  if (Object.keys(params).length !== 2 || (isNaN(Number(height))) || (isNaN(Number(weight)))) {
    res.status(400).json({ error: 'malformatted parameters' });
  } else {
    const result = {
      weight,
      height,
      bmi: calculateBmi(Number(height), Number(weight))
    };
        
    res.status(200).json(result);
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const daily_exercises = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const target = req.body.target;
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if ((!daily_exercises) || (!target)) {
    res.status(400).json({ error: "parameters missing" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  } else if (!onlyNumbers(daily_exercises) || isNaN(target)) {
    res.status(400).json({ error: "malformatted parameters" });
  } else { 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    res.status(200).json(exerciseCalculator(daily_exercises, target));
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});