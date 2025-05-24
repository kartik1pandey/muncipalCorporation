import { Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SWRConfig } from 'swr';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationCenter } from './components/NotificationCenter';
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Departments from "./pages/Departments";
import Schedule from "./pages/Schedule";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Home from "./pages/Home";
import OnlineServices from "./pages/OnlineServices";
import AboutRaipur from "./pages/AboutRaipur";
import Complaint from "./pages/Complaint";
import ComplaintSuccess from "./pages/ComplaintSuccess";

import PayPropertyTax from './components/service/PayPropertyTax';
import NewWaterConnection from './components/service/NewWaterConnection';
import FileTrackingSystem from './components/service/FileTrackingSystem';
import AssetTransfer from './components/service/AssetTransfer';
import ETenderingProcurement from './components/service/ETenderingProcurement';
import Attendance from './components/service/Attendance';
import RTI from './components/service/RTI';
import CitizenFacilities from './components/service/CitizenFacilities';
import D2dVehicleTracking from './components/service/D2dVehicleTracking';
import AirQualityIndex from './components/service/AirQualityIndex';
import HealthDepartment from './components/service/HealthDepartment';
import WaterMeterBilling from './components/service/WaterMeterBilling';
import WaterQualityIndex from './components/service/WaterQualityIndex';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SWRConfig>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <NotificationCenter />
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/online-services" element={<OnlineServices />} />
                  <Route path="/about-raipur" element={<AboutRaipur />} />
                  <Route path="/complaint" element={<Complaint />} />
                  <Route path="/complain" element={<Navigate to="/complaint" replace />} />
                  <Route path="/complaint-success" element={<ComplaintSuccess />} />
                  
                  {/* Specific Service Routes */}
                  <Route path="/online-services/pay-property-tax" element={<PayPropertyTax />} />
                  <Route path="/online-services/new-water-connection" element={<NewWaterConnection />} />
                  <Route path="/online-services/file-tracking-system" element={<FileTrackingSystem />} />
                  <Route path="/online-services/asset-transfer" element={<AssetTransfer />} />
                  <Route path="/online-services/e-tendering-procurement" element={<ETenderingProcurement />} />
                  <Route path="/online-services/attendance" element={<Attendance />} />
                  <Route path="/online-services/rti" element={<RTI />} />
                  <Route path="/online-services/citizen-facilities" element={<CitizenFacilities />} />
                  <Route path="/online-services/d2d-vehicle-tracking" element={<D2dVehicleTracking />} />
                  <Route path="/online-services/air-quality-index" element={<AirQualityIndex />} />
                  <Route path="/online-services/health-department" element={<HealthDepartment />} />
                  <Route path="/online-services/water-meter-billing" element={<WaterMeterBilling />} />
                  <Route path="/online-services/water-quality-index" element={<WaterQualityIndex />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <>
                      <SignedIn>
                        <Dashboard />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                  <Route path="/departments" element={
                    <>
                      <SignedIn>
                        <Departments />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                  <Route path="/schedule" element={
                    <>
                      <SignedIn>
                        <Schedule />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                  <Route path="/resources" element={
                    <>
                      <SignedIn>
                        <Resources />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                  <Route path="/reports" element={
                    <>
                      <SignedIn>
                        <Reports />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                  <Route path="/settings" element={
                    <>
                      <SignedIn>
                        <Settings />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } />
                </Routes>
              </div>
            </main>
          </div>
        </NotificationProvider>
      </SWRConfig>
    </ClerkProvider>
  );
}

export default App;
