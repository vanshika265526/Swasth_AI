import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, FileText, Sparkles, AlertTriangle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/components/ui/use-toast';

const PrescriptionTranslatorPage = () => {
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setResult(null);
      setIsProcessing(true);
      
      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 90) return 90;
              return prev + 10;
          });
      }, 200);

      setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          // Mock AI response
          setResult({
              medications: [
                  { name: 'Paracetamol 500mg', instructions: 'Take 1 tablet every 6 hours for fever.', dosage: '1 tablet', frequency: 'Every 6 hours', reason: 'Fever' },
                  { name: 'Amoxicillin 250mg', instructions: 'Take 1 capsule 3 times a day for 5 days. Complete the course.', dosage: '1 capsule', frequency: '3 times a day', reason: 'Bacterial Infection' },
              ],
              warnings: [
                  'Do not consume alcohol while taking Amoxicillin.',
                  'Paracetamol may cause liver damage if taken in high doses.'
              ],
              dangerousCombo: false,
          });
          setIsProcessing(false);
      }, 2500);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('prescription-upload').click();
  };

  return (
    <>
      <Helmet>
        <title>AI Prescription Translator - SwasthAI</title>
        <meta name="description" content="Upload a photo of your medical prescription and our AI will translate it into simple, easy-to-understand language." />
      </Helmet>
      <div className="main-container">
        <div className="text-center">
            <h1 className="page-title">AI Prescription Translator</h1>
            <p className="page-description">Confused by medical handwriting? Upload a prescription and our AI will digitize and explain it clearly.</p>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="glassmorphism rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Your Prescription</h3>
              <p className="text-muted-foreground mb-6">Upload an image or a scanned document.</p>
              <input type="file" id="prescription-upload" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
              <Button size="lg" onClick={handleUploadClick} disabled={isProcessing}>
                <Upload className="mr-2 h-5 w-5" /> {fileName ? 'Upload Another' : 'Choose File'}
              </Button>
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <p className="font-semibold mb-2">{fileName}</p>
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">AI is analyzing your document...</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Your Translated Prescription</h2>
              {result.warnings.length > 0 && (
                <Card className="mb-6 bg-yellow-500/20 border-yellow-500 rounded-2xl">
                  <CardHeader className="flex-row items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    <CardTitle className="text-yellow-400">Important Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-yellow-300">
                      {result.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-6">
                {result.medications.map((med, i) => (
                  <Card key={i} className="glassmorphism rounded-2xl">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{med.name}</CardTitle>
                         <Button variant="ghost" size="icon" onClick={() => toast({ title: "Voice playback coming soon!" })}>
                           <Volume2 className="h-6 w-6" />
                         </Button>
                      </div>
                       <p className="text-sm text-muted-foreground">For: {med.reason}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-4">{med.instructions}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><span className="font-semibold text-muted-foreground">Dosage:</span> {med.dosage}</p>
                        <p><span className="font-semibold text-muted-foreground">Frequency:</span> {med.frequency}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PrescriptionTranslatorPage;