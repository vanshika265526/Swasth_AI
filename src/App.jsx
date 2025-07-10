import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import HomePage from '@/pages/HomePage';
import RecipeReplacerPage from '@/pages/RecipeReplacerPage';
import PrescriptionTranslatorPage from '@/pages/PrescriptionTranslatorPage';
import MealPlannerPage from '@/pages/MealPlannerPage';
import DrugCheckerPage from '@/pages/DrugCheckerPage';
import VoiceAssistantPage from '@/pages/VoiceAssistantPage';
import SavedResultsPage from '@/pages/SavedResultsPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Logout from '@/pages/Logout';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="swasthai-ui-theme">
      <Router>
        <div className="relative min-h-screen bg-background font-sans antialiased">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 -z-10"></div>
          <Navbar />
          <main className="flex-grow pt-20 pb-24 md:pt-24 md:pb-8">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
               <Route path="/logout" element={<Logout />} />

                <Route path="/recipe-replacer" element={<RecipeReplacerPage />} />
                <Route path="/prescription-translator" element={<PrescriptionTranslatorPage />} />
                <Route path="/meal-planner" element={<MealPlannerPage />} />
                <Route path="/drug-checker" element={<DrugCheckerPage />} />
                <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                <Route path="/saved" element={<SavedResultsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>

          </main>
          <FloatingActionButton />
          <MobileNav />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;