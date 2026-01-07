import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
};

// Contact form data type
export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Send email using EmailJS
export const sendEmail = async (data: EmailData): Promise<void> => {
  try {
    // Validate configuration
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
    }

    // Template parameters that will be sent to EmailJS
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_name: 'TaskTide Team', // You can customize this
      reply_to: data.email,
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    if (response.status !== 200) {
      throw new Error(`EmailJS request failed with status: ${response.status}`);
    }

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('EmailJS Error:', error);

    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      throw new Error('Failed to send email. Please try again later.');
    }
  }
};

// Utility function to validate email configuration
export const isEmailConfigured = (): boolean => {
  return !!(
    EMAILJS_CONFIG.SERVICE_ID &&
    EMAILJS_CONFIG.TEMPLATE_ID &&
    EMAILJS_CONFIG.PUBLIC_KEY
  );
};

// Get configuration status for debugging
export const getConfigStatus = () => {
  return {
    hasServiceId: !!EMAILJS_CONFIG.SERVICE_ID,
    hasTemplateId: !!EMAILJS_CONFIG.TEMPLATE_ID,
    hasPublicKey: !!EMAILJS_CONFIG.PUBLIC_KEY,
    isFullyConfigured: isEmailConfigured(),
  };
};
