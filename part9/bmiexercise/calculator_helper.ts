const ratingDesc = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'bad';
    case 2:
      return 'not too bad but could be better';
    case 3:
      return 'better';
    default:
      throw new Error('rating is not available');
  }
};

const calRating = (averageResult: number, target: number) : number => {
  const result = averageResult / target;
  if (result <= target * 0.50) {
    return 1;
  } else if (result > target * 0.50 && result < target * 1.10) {
    return 2;
  } else {
    return 3;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onlyNumbers = (array: any) : boolean => {
  let containsOnlyNumbers = true;

  for (const element of array) {
    if (typeof element !== 'number') {
      containsOnlyNumbers = false;
      break;
    }
  }
  return containsOnlyNumbers;
};

export { 
  ratingDesc,
  calRating,
  onlyNumbers
};