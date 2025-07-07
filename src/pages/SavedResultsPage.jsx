import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, FileText, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 mt-8 bg-background/50 rounded-2xl"
    >
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
    </motion.div>
);

const SavedResultsPage = () => {
  return (
    <>
      <Helmet>
        <title>Saved Results - SwasthAI</title>
        <meta name="description" content="Access all your saved recipe conversions, prescription translations, and meal plans in one convenient dashboard." />
      </Helmet>
      <div className="main-container">
        <div className="text-center">
            <h1 className="page-title">Your Saved Library</h1>
            <p className="page-description">All your AI-generated results, safe and sound. Access your saved recipes, prescriptions, and more anytime.</p>
        </div>

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto h-12">
            <TabsTrigger value="recipes" className="h-10 text-base"><UtensilsCrossed className="mr-2 h-5 w-5" /> Recipes</TabsTrigger>
            <TabsTrigger value="prescriptions" className="h-10 text-base"><FileText className="mr-2 h-5 w-5" /> Prescriptions</TabsTrigger>
            <TabsTrigger value="plans" className="h-10 text-base"><HeartPulse className="mr-2 h-5 w-5" /> Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="recipes">
            <EmptyState 
                icon={<UtensilsCrossed className="h-12 w-12 text-muted-foreground" />}
                title="No Saved Recipes"
                description="Your converted recipes will appear here. Go to the Recipe Replacer to get started!"
            />
          </TabsContent>
          <TabsContent value="prescriptions">
            <EmptyState 
                icon={<FileText className="h-12 w-12 text-muted-foreground" />}
                title="No Saved Prescriptions"
                description="Your translated prescriptions will be saved here for easy access."
            />
          </TabsContent>
           <TabsContent value="plans">
            <EmptyState 
                icon={<HeartPulse className="h-12 w-12 text-muted-foreground" />}
                title="No Saved Meal Plans"
                description="Your AI-generated meal plans will be stored here."
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SavedResultsPage;