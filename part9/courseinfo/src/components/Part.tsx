import { PartProps } from '../types';
import assertNever from '../utils';

const Part = (props: PartProps ): JSX.Element => {
  switch (props.part.kind) {
    case "basic":
      return (
        <div>
          <p key={props.part.name}>
            <b>{props.part.name} {props.part.exerciseCount}</b> <br />
            {props.part.description}
          </p>
        </div>
      )
      break;
    case "group":
      return (
        <div>
          <p key={props.part.name}>
            <b>{props.part.name} {props.part.exerciseCount}</b> <br />
            {props.part.groupProjectCount}
          </p>
        </div>
      )
      break;
      case "background":
        return (
          <div>
            <p key={props.part.name}>
              <b>{props.part.name} {props.part.exerciseCount}</b> <br />
              {props.part.backgroundMaterial}
            </p>
          </div>
        )
        break;
      case "special":
        return (
          <div>
            <p key={props.part.name}>
              <b>{props.part.name} {props.part.exerciseCount}</b> <br />
              {props.part.description}
              {props.part.requirements}
            </p>
          </div>
        )
        break;
      default: 
        return assertNever(props.part);    
        break
  }  
};

export default Part;