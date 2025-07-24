import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, FileText, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import axios from 'axios';

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
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealPlans = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to view saved meal plans.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/mealplanner/saved/${user.uid}`);
        setMealPlans(res.data.mealPlans || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch meal plans');
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlans();
  }, []);

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
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : error ? (
              <EmptyState 
                icon={<HeartPulse className="h-12 w-12 text-muted-foreground" />}
                title="Error"
                description={error}
              />
            ) : mealPlans.length === 0 ? (
            <EmptyState 
                icon={<HeartPulse className="h-12 w-12 text-muted-foreground" />}
                title="No Saved Meal Plans"
                description="Your AI-generated meal plans will be stored here."
            />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealPlans.map((plan, idx) => (
                  <Card key={plan._id || idx} className="glassmorphism rounded-2xl h-full">
                    <CardHeader>
                      <CardTitle>Meal Plan ({new Date(plan.createdAt).toLocaleDateString()})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-muted-foreground">Symptoms: {plan.symptoms}</div>
                      <ul className="space-y-2 text-muted-foreground">
                        {plan.weeklyPlan.map((day, i) => (
                          <li key={i} className="mb-2">
                            <span className="font-semibold text-foreground">{day.day}:</span>
                            <ul className="ml-4">
                              {day.meals.map((meal, j) => (
                                <li key={j}>
                                  <span className="font-semibold">{meal.time}:</span> {meal.dish}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SavedResultsPage;
