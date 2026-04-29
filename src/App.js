import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stepper from "./components/Stepper";
import ReservationPage from "./pages/ReservationPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import FleetAdmin from "./pages/FleetAdmin";
import "./index.css";

const STEP_MAP = { "/": 2, "/payment": 3, "/confirmation": 4 };

// Pages client : navbar + stepper
function ClientLayout() {
  const { pathname } = useLocation();
  const currentStep = STEP_MAP[pathname] ?? 2;

  const [booking, setBooking] = useState({
    dateStart: "", dateEnd: "", wilaya: "", pickup: "Agence principale",
    dropoff: "Même lieu", prenom: "", nom: "", tel: "", email: "", permis: "",
  });

  return (
    <>
      <Navbar />
      <Stepper currentStep={currentStep} />
      <div className="cl-wrapper">
        <Routes>
          <Route path="/" element={<ReservationPage booking={booking} setBooking={setBooking} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard admin — layout propre sans navbar/stepper client */}
        <Route path="/admin/*" element={<FleetAdmin />} />

        {/* Interface client */}
        <Route path="/*" element={<ClientLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
