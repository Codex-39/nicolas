import { useEffect } from "react"
import { supabase } from "./lib/supabase"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/login";

/* LAYOUT */
import MainLayout from "./layouts/MainLayout";

/* PAGES */
import Dashboard from "./pages/Dashboard";
import DomainSelection from "./pages/DomainSelection";
import GatePrep from "./pages/GatePrep";
import InterviewPrep from "./pages/InterviewPrep";
import ProfilePage from "./pages/ProfilePage";
import StreakPage from "./pages/StreakPage";
import Inbox from "./pages/Inbox";
import Friends from "./pages/Friends";
import GroupDiscussion from "./pages/GroupDiscussions";
import MyLearning from "./pages/MyLearning";
import DomainRoadmap from "./pages/DomainRoadmap";
import ChapterContent from "./pages/ChapterContent";
import ChapterTest from "./pages/ChapterTest";
import DomainEndTest from "./pages/DomainEndTest";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component (For Normal Users)
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in as admin, should not be in user dashboard
  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
  const test = async () => {
    const { data, error } = await supabase
      .from("domains")
      .select("*")

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  test()
}, [])
  return (
    <Router>
      <Routes>
        {/* LOGIN (NO SIDEBAR / NO RIGHT PANEL) */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* MAIN APP (PROTECTED) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="domain-selection" element={<DomainSelection />} />

          {/* DOMAIN FLOW */}
          <Route path="roadmap/:branchId/:domainId" element={<DomainRoadmap />} />
          <Route path="chapter/:branchId/:domainId/:chapterId" element={<ChapterContent />} />
          <Route path="test/:branchId/:domainId/:chapterId" element={<ChapterTest />} />
          <Route path="domain-test/:branchId/:domainId" element={<DomainEndTest />} />

          <Route path="gate-prep" element={<GatePrep />} />
          <Route path="interview-prep" element={<InterviewPrep />} />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="streak" element={<StreakPage />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="friends" element={<Friends />} />
          <Route path="discussions" element={<GroupDiscussion />} />
          <Route path="learning" element={<MyLearning />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
