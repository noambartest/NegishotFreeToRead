import React, { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
//import ClientAccess from "./components/auth/ClientAccess";
import ClientPage from "./components/client/ClientPage";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ManagerDashboard from "./components/admin/ManagerDash";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/manager" element={<LoginForm />} />
          <Route path="/client" element={ <ClientPage />} />
          <Route path="/man_dash" element={ <ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;



// export default function App() {
//   const [mode, setMode] = useState(null);
//   const [user, setUser] = useState(null);

//   if (user && user.role === "user") return <ClientDashboard user={user} />;
//   if (mode === "admin") return <LoginForm onBack={() => setMode(null)} onLogin={setUser} />;
//   if (mode === "client") return <ClientAccess onAccess={setUser} onBack={() => setMode(null)} />;

//   return (
//     <div>
//       <h2>Are you a restaurant manager or a client?</h2>
//       <button onClick={() => setMode("admin")}>Restaurant Manager</button>
//       <button onClick={() => setMode("client")}>Client</button>
//     </div>
//   );
// }
