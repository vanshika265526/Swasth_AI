import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Hand as HeartHand, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="h-full glassmorphism text-center p-6 rounded-2xl">
      <CardHeader className="flex items-center justify-center">
        <div className="bg-primary/20 p-4 rounded-full mb-4">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const HomePage = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <>
      <Helmet>
        <title>Aayush Swasth - AI-Powered Health & Recipe Assistant</title>
        <meta
          name="description"
          content="Your personal AI health assistant for translating medical prescriptions and finding safe ingredient replacements for your diet."
        />
      </Helmet>
      <div className="main-container">
        <section className="text-center py-16 md:py-24">
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent-foreground pb-2">
              Health, Simplified by AI
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your intelligent health companion. Get instant help with recipes, prescriptions, and meal plans, all tailored to you and your family.
            </p>
          </motion.div>
          <motion.div
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-lg font-semibold">
              <Link to="/recipe-replacer">
                Fix a Recipe <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg font-semibold">
              <Link to="/prescription-translator">
                Check a Prescription <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </section>

        <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">How SwasthAI Empowers You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Bot className="h-8 w-8 text-primary" />}
                    title="AI-Powered Precision"
                    description="Our advanced AI understands your dietary needs and deciphers complex medical terms to provide accurate, safe, and personalized advice."
                    delay={0.2}
                />
                <FeatureCard 
                    icon={<HeartHand className="h-8 w-8 text-primary" />}
                    title="Health for Everyone"
                    description="From urban dietary restrictions to rural healthcare access, we're bridging the gap with intuitive tools like voice input and multi-language support."
                    delay={0.4}
                />
                <FeatureCard 
                    icon={<Users className="h-8 w-8 text-primary" />}
                    title="Family-First Care"
                    description="Manage health profiles for your entire family. Keep track of allergies, diets, and medications for children, parents, and yourself in one place."
                    delay={0.6}
                />
            </div>
        </section>
        
        <section className="py-16 text-center">
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
             >
                <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of users who trust SwasthAI for their daily health decisions.</p>
                <Button asChild size="lg" className="text-lg">
                    <Link to="/profile">Get Started for Free</Link>
                </Button>
             </motion.div>
        </section>

      </div>
    </>
  );
};

export default HomePage;