import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle,CardDescription} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {User, Bell, PlusCircle, LogOut} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || 'User';
  const email = localStorage.getItem('email') || 'user@example.com';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>My Profile - SwasthAI</title>
        <meta
          name="description"
          content="Manage your SwasthAI profile, notification settings, and family member profiles."
        />
      </Helmet>

      <div className="main-container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Your Profile</h1>
              <p className="text-muted-foreground dark:text-gray-400">
                Manage your account and family profiles.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glassmorphism rounded-2xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                  <User /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-black dark:text-white">
                    Full Name
                  </Label>
                  <Input id="name" value={name} readOnly className="dark:bg-gray-900 dark:text-white"/>
                </div>
                <div>
                  <Label htmlFor="email" className="text-black dark:text-white">
                    Email Address
                  </Label>
                  <Input id="email" type="email" value={email} readOnly className="dark:bg-gray-900 dark:text-white"/>
                </div>
              </CardContent>
            </Card>
            <Card className="glassmorphism rounded-2xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                  <Bell /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders" className="flex-grow text-black dark:text-white">
                    Medication Reminders
                  </Label>
                  <Switch id="reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="meal-plans" className="flex-grow text-black dark:text-white">
                    Weekly Meal Plan Ready
                  </Label>
                  <Switch id="meal-plans" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="newsletter" className="flex-grow text-black dark:text-white">
                    Product Updates
                  </Label>
                  <Switch id="newsletter" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="glassmorphism rounded-2xl mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <User /> Family Profiles
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Manage health profiles for your family members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-black dark:text-white">{name} (You)</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Allergies: None
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost">Edit</Button>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
              </Button>
            </CardContent>
          </Card>
          <div className="mt-8 flex justify-between">
            <Link to="/login">
              <Button variant="">Login</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;




