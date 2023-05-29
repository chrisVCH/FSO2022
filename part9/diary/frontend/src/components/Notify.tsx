import { NotifyProps } from "../types";

const Notify = (props: NotifyProps) => {
  if ( !props.errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {props.errorMessage}
    </div>
  )
}

export default Notify;