import { ratingDesc, calRating } from "./calculator_helper";

interface MultiplyValues {
  values: Array<number>
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const argsArray = new Array<number>();
  for (let i=2; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {
      argsArray[i-2] = Number(args[i]);
    } else {
      throw new Error('Provided values were not numbers!');
    }
  }
  return {
    values: argsArray
  };
};

interface ExwerciseResult {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string
}

const exerciseCalculator = (a: Array<number>, b: number): ExwerciseResult => {
  const averageResult =  a.reduce((x, y) => x + y, 0) / a.length;
  const ratingResult = calRating(averageResult, b);

  return {
    periodLength: a.length,
    trainingDays: a.filter(day => day !== 0).length,
    target: b,
    average: averageResult,
    success: averageResult >= b ? true : false,
    rating: ratingResult,
    ratingDescription: ratingDesc(ratingResult),
  };
};

try {
  const { values } = parseArguments(process.argv);
  const restofvalues = values.slice(1);
  console.log(exerciseCalculator(restofvalues, values[0]));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong. ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}


