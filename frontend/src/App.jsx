import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddProblem from "./pages/AddProblem.jsx";
import ProblemDetail from "./pages/ProblemDetail.jsx";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
          },
        }}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddProblem />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
