import "./style.css";

const Header = ({headerText}) => {
    return (
        <>
            <div className="header">
                <div className="text">
                    <p>{headerText}</p>
                </div>
            </div>
        </>
    );
}

export default Header;