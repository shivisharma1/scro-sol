import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import NewDeal from "./views/NewDeal";
import AcceptDeal from "./views/AcceptDeal";
import Auth from "./middleware/auth";
import { AuthProvider } from "context/authContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SolanaProvider from "context/solanaProvider";
import { SolanaContextProvider } from "context/solaServiceContext";
import "@solana/wallet-adapter-react-ui/styles.css";

// import { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SolanaProvider>
          <SolanaContextProvider>
            <ToastContainer
              pauseOnHover={false}
              pauseOnFocusLoss={false}
              limit={3}
              autoClose={1500}
            />
            <Routes>
              <Route path="/" exact element={<Login />} />
              <Route exact path="/dashboard" element={<Auth />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/" element={<Auth />}>
                <Route path="/new-deal" exact element={<NewDeal />} />
              </Route>
              <Route path="/accept" element={<AcceptDeal />} />
            </Routes>
          </SolanaContextProvider>
        </SolanaProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
