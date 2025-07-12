import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/recipe-replacer', label: 'Recipe Fixer' },
  { path: '/prescription-translator', label: 'Prescription Help' },
  { path: '/meal-planner', label: 'Meal Planner' },
  { path: '/drug-checker', label: 'Drug Checker' },
  { path: '/saved', label: 'Saved' },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Stethoscope className="h-7 w-7 text-primary" />
          <span className="text-primary">Swasth</span>
          <span className="text-foreground">AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'secondary' : 'ghost'}
              asChild
              className="font-semibold"
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/profile">My Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
