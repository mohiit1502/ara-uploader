import React from "react"
import { useAlert } from "@contexts/AlertContext";
import AlertStackManager from "@components/AlertStackManager";
import Header from "@components/Header";
import SidePanel from "@components/SidePanel";
import Main from "@components/Main";
import LoginPanel from "@components/LoginPanel";
import { useLogin } from "@hooks/useLogin";
import "./Home.page.scss"

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const { alerts, removeAlert } = useAlert();
  const { isLoggingIn } = useLogin()
  return <div className="c-Home h-100 w-100 d-flex flex-column">
    <Header />
    <div className="container flex-grow-1">
      <div className="row">
        <div className="col-4 px-5 border-right">
          <SidePanel />
        </div>
        <main className={`main-panel ${isLoggingIn ? "col-5" : "col-8"}`}>
          <Main />
        </main>
        <div className={`login-panel ${isLoggingIn ? "active col-3" : "w-0 p-0 overflow-hidden"}`}>
          <LoginPanel />
        </div>
      </div>
    </div>
    <AlertStackManager alerts={alerts} onRemove={removeAlert} />
  </div>
}

export default Home