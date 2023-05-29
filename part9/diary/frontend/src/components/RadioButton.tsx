import { InputElementProps } from "../types";

const RadioButton = ({
  label,
  type,
  name,
  value,
  isChecked,
  onChange
}: InputElementProps):JSX.Element => (
  <>
    {value} <input 
    key={label}
    type={type} 
    name={name}
    value={value}
    checked={isChecked(value)}
    onChange={onChange}
  /> 
  </>
)

export default RadioButton;