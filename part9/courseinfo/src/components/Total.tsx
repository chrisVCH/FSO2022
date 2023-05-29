import { ContentProps } from "../types";

const Total = (props: ContentProps): JSX.Element => {
  const numberOfExercises = props.parts.reduce((carry, part) => carry + part.exerciseCount, 0);
  return (<p>Number of exercises{" "} {numberOfExercises}</p>)
};

export default Total;

  