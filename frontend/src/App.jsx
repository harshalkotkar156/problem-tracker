import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddProblem from "./pages/AddProblem.jsx";
import ProblemDetail from "./pages/ProblemDetail.jsx";
import Notes from "./pages/Notes.jsx";
import AddNote from "./pages/AddNote.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
          <Route path="/add" element={<AddProblem />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/add-note" element={<AddNote />} />
          <Route path="/note/:id" element={<NoteDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
