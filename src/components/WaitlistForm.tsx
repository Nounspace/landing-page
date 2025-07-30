import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface WaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  handle: string;
  email: string;
}

interface FormErrors {
  name: boolean;
  handle: boolean;
  email: boolean;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormData>({
    name: '',
    handle: '',
    email: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    handle: false,
    email: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: form.name.trim() === '',
      handle: form.handle.trim() === '',
      email: form.email.trim() === ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
    
    // Clear submit status when user makes changes
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger chromatic aberration effect
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 600);
    
    if (!validateForm()) {
      setErrorMessage('Complete required fields and try again');
      return;
    }

    if (!validateEmail(form.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbzXo9gEGJLd5YuniH4hpC-Shi-9UCCbl6B5hSD4E7_Qw9_VfEztV3y1pg4tJ4xjID1COw/exec',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
          mode: 'no-cors',
          credentials: 'omit',
        }
      );

      // With no-cors mode, we can't read the response, but if the request doesn't throw an error,
      // we can assume it was successful
      setSubmitStatus('success');
      // Reset form after successful submission
      setTimeout(() => {
        setForm({ name: '', handle: '', email: '' });
        setSubmitStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        'Unable to submit form. Please try again or contact support if the problem persists.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setForm({ name: '', handle: '', email: '' });
      setErrors({ name: false, handle: false, email: false });
      setSubmitStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="relative bg-black px-6 py-8 text-white">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.img 
                src="/logo.png" 
                alt="Logo" 
                className="h-16 mb-2 mx-auto"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: 0.2
                }}
              />
              <p className="text-white text-opacity-60 text-center font-secondary text-sm">
                Be the first to know when we launch
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              {submitStatus === 'success' ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">You're on the list!</h3>
                  <p className="text-gray-600">We'll notify you when we launch.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Community Name */}
                  <div>
                    <label htmlFor="name" className="block text-md font-medium text-gray-700 mb-2">
                      Community Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 font-secondary text-sm ${
                        errors.name 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your community name"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Farcaster Handle */}
                  <div>
                    <label htmlFor="handle" className="block text-md font-medium text-gray-700 mb-2">
                      Your Farcaster Handle *
                    </label>
                    <input
                      type="text"
                      id="handle"
                      value={form.handle}
                      onChange={(e) => handleInputChange('handle', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 font-secondary text-sm ${
                        errors.handle 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="@yourhandle"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-md font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200 font-secondary text-sm ${
                        errors.email 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <motion.div
                      className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit Button with Chromatic Aberration Effect */}
                  <div className="relative group">
                    
                    {/* Hover chromatic aberration layers */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-red-500 rounded-lg transform translate-x-0 group-hover:translate-x-0.5 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300 z-30" />
                      <div className="absolute inset-0 bg-green-500 rounded-lg transform translate-x-0 group-hover:translate-x-1 transform translate-y-0 group-hover:translate-y-0.5 transition-transform duration-300 z-20" />
                      <div className="absolute inset-0 bg-blue-500 rounded-lg transform translate-x-0 group-hover:translate-x-1.5 transform translate-y-0 group-hover:translate-y-1 transition-transform duration-300 z-10" />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="z-50 relative w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group-hover:shadow-2xl group-hover:shadow-black/30 group-hover:-translate-y-1"
                      whileHover={{ y: -4 }}
                      whileTap={{ y: 0, scale: 0.98 }}
                    >
                      {/* Chromatic aberration layers */}
                      {buttonClicked && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-red-500 rounded-lg origin-center"
                            initial={{ opacity: 0, scaleX: 0, scaleY: 1 }}
                            animate={{ 
                              opacity: [0, 0.5, 0], 
                              scaleX: [0, 2, 3],
                              scaleY: [1, 1, 1]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-green-500 rounded-lg origin-center"
                            initial={{ opacity: 0, scaleX: 0, scaleY: 1 }}
                            animate={{ 
                              opacity: [0, 0.5, 0], 
                              scaleX: [0, 2, 3],
                              scaleY: [1, 1, 1]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-blue-500 rounded-lg origin-center"
                            initial={{ opacity: 0, scaleX: 0, scaleY: 1 }}
                            animate={{ 
                              opacity: [0, 0.5, 0], 
                              scaleX: [0, 2, 3],
                              scaleY: [1, 1, 1]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-black rounded-lg origin-center"
                            initial={{ opacity: 0, scaleX: 0, scaleY: 1 }}
                            animate={{ 
                              opacity: [0, 0.6, 0], 
                              scaleX: [0, 2, 3],
                              scaleY: [1, 1, 1]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
                          />
                        </>
                      )}
                      
                      {/* Button content */}
                      <span className="relative z-10">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          </>
                        ) : (
                          'Join Waitlist'
                        )}
                      </span>
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistForm;