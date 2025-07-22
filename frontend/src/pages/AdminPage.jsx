import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Bot, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const AdminStatCard = ({ icon, title, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card className="glassmorphism rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    </motion.div>
);

const AdminPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - SwasthAI</title>
        <meta name="description" content="Manage application data, view user feedback, and fine-tune AI models from the SwasthAI admin panel." />
      </Helmet>
      <div className="main-container">
        <div className="mb-8">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-description">Oversee application activity and manage core functionalities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard 
                title="Total Users" 
                value="1,234" 
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                delay={0.1}
            />
            <AdminStatCard 
                title="Recipes Processed" 
                value="5,678" 
                icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                delay={0.2}
            />
            <AdminStatCard 
                title="AI Model Status" 
                value="Online" 
                icon={<Bot className="h-4 w-4 text-muted-foreground" />}
                delay={0.3}
            />
            <AdminStatCard 
                title="New Feedback" 
                value="52" 
                icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                delay={0.4}
            />
        </div>
        
        <div className="mt-8">
            <Card className="glassmorphism rounded-2xl">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">User activity log will be displayed here. More admin features coming soon!</p>
                    <Button className="mt-4">View All Activity</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
};

export default AdminPage;