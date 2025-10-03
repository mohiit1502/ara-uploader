import React from "react"
import "./Header.component.scss"

interface HeaderProps { }

const Header = (props: HeaderProps): JSX.Element => {
  return (
    <header className="c-Header py-3 bg-white border-bottom shadow-md">
      <div className="container">
        <span className="h4 fw-bold text-dark">Uploader Demo</span>
      </div>
    </header>
  );
}

export default Header
