import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceAssistantPage = () => {
  return (
    <>
      <Helmet>
        <title>Voice Assistant - SwasthAI</title>
        <meta name="description" content="Interact with SwasthAI using your voice. Ask for recipe conversions, prescription help, and more with our hands-free voice assistant." />
      </Helmet>
      <div className="main-container flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
          <div className="text-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-4"
            >
                Talk to SwasthAI
            </motion.h1>
            <motion.p
                 initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                 className="text-muted-foreground max-w-md mx-auto mb-12"
            >
                Tap the microphone and say something like "Convert a recipe for paneer butter masala to be vegan" or "Explain my prescription".
            </motion.p>
          </div>

        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="rounded-full w-24 h-24 shadow-2xl bg-primary hover:bg-primary/90"
          >
            <Mic className="h-12 w-12 text-primary-foreground" />
          </Button>
        </motion.div>
        <p className="text-muted-foreground mt-6 text-lg animate-pulse">Listening...</p>
      </div>
    </>
  );
};

export default VoiceAssistantPage;