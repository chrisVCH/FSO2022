import { ratingDesc, calRating } from "./calculator_helper";

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

export { exerciseCalculator };

