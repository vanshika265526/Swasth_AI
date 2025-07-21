import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Sparkles, AlertTriangle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const PrescriptionTranslatorPage = () => {
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [manualText, setManualText] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setExtractedText('');
      setAiResult(null);
      setIsProcessing(true);
      setProgress(10);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const uploadRes = await axios.post('/api/prescriptions/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setProgress(Math.round((progressEvent.loaded * 80) / progressEvent.total));
            }
          },
        });
        setProgress(90);
        setExtractedText(uploadRes.data.text || '');
          setProgress(100);
      } catch (err) {
        toast({ variant: 'destructive', title: 'OCR Error', description: err.message });
      } finally {
          setIsProcessing(false);
      }
    }
  };

  const handleUploadClick = () => {
    document.getElementById('prescription-upload').click();
  };

  const handleAnalyze = async () => {
    const text = extractedText || manualText;
    if (!text.trim()) {
      toast({ variant: 'destructive', title: 'No prescription text', description: 'Please upload a file or enter text.' });
      return;
    }
    setIsProcessing(true);
    setAiResult(null);
    try {
      const res = await axios.post('/api/prescriptions/ask-ai', { text });
      setAiResult(res.data.ai);
    } catch (err) {
      toast({ variant: 'destructive', title: 'AI Error', description: err.message });
    } finally {
      setIsProcessing(false);
    }
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
            <p className="page-description">Confused by medical handwriting? Upload a prescription or paste it below and our AI will digitize and explain it clearly.</p>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="glassmorphism rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload or Paste Your Prescription</h3>
              <p className="text-muted-foreground mb-6">Upload an image, PDF, or paste the prescription text below.</p>
              <input type="file" id="prescription-upload" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
              <Button size="lg" onClick={handleUploadClick} disabled={isProcessing}>
                <Upload className="mr-2 h-5 w-5" /> {fileName ? 'Upload Another' : 'Choose File'}
              </Button>
              <div className="my-6">
                <textarea
                  className="w-full min-h-[120px] p-3 rounded-lg bg-background/70 border border-border text-white placeholder:text-muted-foreground"
                  placeholder="Or paste prescription text here..."
                  value={manualText}
                  onChange={e => setManualText(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
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
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">Processing...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button size="lg" className="mt-4" onClick={handleAnalyze} disabled={isProcessing}>
                <Sparkles className="mr-2 h-5 w-5" /> Analyze Prescription
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-center mb-6">AI Doctor's Explanation</h2>
              <div className="space-y-6">
                <pre className="bg-background/80 p-4 rounded-lg text-white whitespace-pre-wrap text-left">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PrescriptionTranslatorPage;