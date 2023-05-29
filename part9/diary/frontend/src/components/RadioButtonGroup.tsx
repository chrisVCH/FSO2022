import { InputOptionGroup, InputOption } from "../types";
import RadioButton from "./RadioButton";

const RadioButtonGroup = ({ grouplabel, options, isChecked, onChange }: InputOptionGroup):JSX.Element => {

  return (
    <>
      {options.map(({ label, value }: InputOption): JSX.Element => (
        <RadioButton
          key={label}
          label={label}
          type="radio"
          name={grouplabel}
          value={value}
          isChecked={isChecked}
          onChange={onChange}
        />
      ))}
    </>
  )
};

export default RadioButtonGroup;