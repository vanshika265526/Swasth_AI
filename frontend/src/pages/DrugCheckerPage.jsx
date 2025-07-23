import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Search, X, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const DrugCheckerPage = () => {
    const [drugs, setDrugs] = useState(['', '']);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [savedInteractions, setSavedInteractions] = useState(() => {
    const stored = localStorage.getItem('savedInteractions');
    return stored ? JSON.parse(stored) : [];
});


    const handleDrugChange = (index, value) => {
        const newDrugs = [...drugs];
        newDrugs[index] = value;
        setDrugs(newDrugs);
    };

    const addDrugInput = () => {
        setDrugs([...drugs, '']);
    };
    
    const removeDrugInput = (index) => {
        const newDrugs = drugs.filter((_, i) => i !== index);
        setDrugs(newDrugs);
    };

    const handleCheck = () => {
        const filledDrugs = drugs.filter(d => d.trim() !== '');
        if (filledDrugs.length < 2) {
            toast({
                variant: "destructive",
                title: "Not enough drugs",
                description: "Please enter at least two drugs to check for interactions.",
            });
            return;
        }


        setIsLoading(true);
        setResult(null);
const handleSaveInteraction = () => {
    if (!result) return;

    const filledDrugs = drugs.filter(d => d.trim() !== '');
    const interactionToSave = {
        drugs: filledDrugs,
        result,
        timestamp: new Date().toISOString(),
    };

    const updated = [...savedInteractions, interactionToSave];
    setSavedInteractions(updated);
    localStorage.setItem('savedInteractions', JSON.stringify(updated));

    toast({
        title: "✅ Interaction Saved",
        description: "Interaction saved. Check it out in the Saved tab!",
    });
};

        // Mock AI check
        setTimeout(() => {
            const isInteraction = Math.random() > 0.5;
            setResult({
                isSafe: !isInteraction,
                message: isInteraction 
                    ? `Potential moderate interaction found between ${filledDrugs[0]} and ${filledDrugs[1]}. Consult your doctor.`
                    : 'No significant interactions found between the specified drugs. Always consult a healthcare professional.',
            });
            setIsLoading(false);
        }, 2000);
    };

  return (
    <>
      <Helmet>
        <title>Drug Interaction Checker - SwasthAI</title>
        <meta name="description" content="Check for potentially harmful interactions between multiple medications. Enter drug names to get an instant AI-powered safety analysis." />
      </Helmet>
      <div className="main-container">
        <div className="text-center">
            <h1 className="page-title">Drug Interaction Checker</h1>
            <p className="page-description">Stay safe by checking for harmful interactions between medications. Enter two or more drugs below.</p>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="glassmorphism rounded-2xl max-w-2xl mx-auto">
                <CardContent className="p-8">
                    <div className="space-y-4 mb-6">
                        {drugs.map((drug, index) => (
                           <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2"
                           >
                                <Pill className="h-5 w-5 text-muted-foreground"/>
                                <Input 
                                    type="text"
                                    placeholder={`Drug name ${index + 1}`}
                                    value={drug}
                                    onChange={(e) => handleDrugChange(index, e.target.value)}
                                    className="text-base"
                                />
                                {drugs.length > 2 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeDrugInput(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                           </motion.div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" onClick={addDrugInput}>Add another drug</Button>
                        <Button size="lg" onClick={handleCheck} disabled={isLoading}>
                            <Search className="mr-2 h-5 w-5" /> 
                            {isLoading ? 'Checking...' : 'Check Interactions'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <AnimatePresence>
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 max-w-2xl mx-auto"
                >
                    <Card className={`rounded-2xl ${result.isSafe ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                        <CardHeader className="flex-row items-center gap-4">
                            {result.isSafe 
                                ? <CheckCircle className="h-8 w-8 text-green-500" /> 
                                : <AlertTriangle className="h-8 w-8 text-red-500" />
                            }
                            <CardTitle className={result.isSafe ? 'text-green-400' : 'text-red-400'}>
                                {result.isSafe ? 'Interaction Unlikely' : 'Potential Interaction Found'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">{result.message}</p>
                            <p className="text-sm text-muted-foreground mt-4">Disclaimer: This is not medical advice. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DrugCheckerPage;