import { HeaderProps } from "../types";

const Header = (props: HeaderProps): JSX.Element => {
    return <h1>{props.name}</h1>
}

export default Header;