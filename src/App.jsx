import { useEffect } from "react";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/Signin";
import Signup from "./pages/auth/SignUp";
import Dashboard from "./components/layouts/Dashboard";
import AddAgentForm from "./pages/admin/repo-agent/add";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/Home/AdminDashboard";
import RepoAgentList from "./pages/admin/repo-agent/all";
import GenerateRepoId from "./pages/admin/repo-agent/gentrate-id";
import IdCardList from "./pages/admin/repo-agent/id-all";
import OfficeStaffList from "./pages/admin/office-staff/all";
import BankWiseData from "./pages/admin/upload-data/BankWiseData";
import CombineData from "./pages/admin/upload-data/CombineData";
import UploadFilesData from "./pages/admin/upload-data/UploadFilesData";
import AddStaffForm from "./pages/admin/office-staff/add";
import SearchComponent from "./pages/admin/search/page";
import AllVehicleList from "./pages/admin/reports/AllVehicleList";
import HoldVehicleList from "./pages/admin/reports/HoldVehicleList";
import ReleaseVehicleList from "./pages/admin/reports/ReleaseVehicleList";
import RepoVehicleList from "./pages/admin/reports/RepoVehicleList";
import ConfirmationVehicleList from "./pages/admin/reports/ConfirmationVehicleList";
import RepoAgentApproval from "./pages/admin/repo-agent-approval/RepoAgentApproval";
import DeleteData from "./pages/admin/delete-data/page";

const App = () => {
  const auth = localStorage.getItem("token");

  const { message, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    } else if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Signup />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute isAuthenticated={!auth} redirect="/">
              <SignIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <SearchComponent />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repo-agent/add"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <AddAgentForm />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repo-agent/all"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <RepoAgentList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repo-agent/generate-id-card"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <GenerateRepoId />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repo-agent/all-id-card"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <IdCardList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/office-staff/all"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <OfficeStaffList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/office-staff/add"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <AddStaffForm />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-data/bank-wise-data"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <BankWiseData />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-data/combine-data"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <CombineData />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-data/upload-files-data"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <UploadFilesData />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delete-data"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <DeleteData />
              </Dashboard>
            </ProtectedRoute>
          }
        />
          <Route
            path="/reports/all-vehicle-list"
            element={
              <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
                <Dashboard>
                  <AllVehicleList />
                </Dashboard>
              </ProtectedRoute>
            }
          />
        <Route
          path="/reports/hold-vehicle-list"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <HoldVehicleList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/release-vehicle-list"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <ReleaseVehicleList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/repo-vehicle-list"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <RepoVehicleList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/confirmation-vehicle-list"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <ConfirmationVehicleList />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repo-agents-approval"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <RepoAgentApproval />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={!!auth} redirect="/login">
              <Dashboard>
                <AdminDashboard />
              </Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
