import { CoursePart, ContentProps } from "../types"
import Part from "./Part";

const Content = (props: ContentProps): JSX.Element => {
  return (
    <div >
      {props.parts.map((part: CoursePart) => (
      <div key={part.name}>
        <Part part={part} />
      </div>
      ))}
    </div>
  ) 
}

export default Content;