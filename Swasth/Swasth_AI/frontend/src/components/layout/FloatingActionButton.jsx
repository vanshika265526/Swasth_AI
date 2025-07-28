
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const FloatingActionButton = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "🚧 Feature in Progress!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 120 }}
      className="md:hidden fixed bottom-20 right-6 z-50"
    >
      <Button
        size="lg"
        className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90"
        onClick={handleClick}
      >
        <Plus className="h-8 w-8 text-primary-foreground" />
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;
  