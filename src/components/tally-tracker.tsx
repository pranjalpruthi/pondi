import React, { useEffect } from 'react';

const TallyTracker: React.FC = () => {
  useEffect(() => {
    const handleTallySubmission = (event: MessageEvent) => {
      // Check if the event is from Tally and is a form submission
      if (event.data?.type === "TALLY_FORM_SUBMITTED") {
        const payload = event.data.payload;
        
        // 1. Facebook Pixel Tracking
        if (typeof window.fbq === 'function') {
          try {
            window.fbq('track', 'Lead', {
              formId: payload?.formId,
              submissionId: payload?.submissionId
            });
            console.log("✅ Facebook Pixel 'Lead' event fired.");
          } catch (error) {
            console.error("Facebook Pixel tracking error:", error);
          }
        } else {
          console.warn("Facebook Pixel (fbq) not found.");
        }

        // 2. Google Tag Manager Tracking
        if (window.dataLayer) {
          try {
            window.dataLayer.push({
              event: 'tally_form_submit',
              formId: payload?.formId,
              submissionId: payload?.submissionId,
              formName: payload?.formName,
            });
            console.log("✅ Google Tag Manager 'tally_form_submit' event pushed.");
          } catch (error) {
            console.error("Google Tag Manager error:", error);
          }
        } else {
          console.warn("Google Tag Manager (dataLayer) not found.");
        }

        // 3. Umami Tracking
        if (window.umami) {
          try {
            window.umami.track('tally-form-submission', {
              formId: payload?.formId,
              formName: payload?.formName,
            });
            console.log("✅ Umami 'tally-form-submission' event tracked.");
          } catch (error) {
            console.error("Umami tracking error:", error);
          }
        } else {
          console.warn("Umami analytics not found.");
        }
      }
    };

    // Add the event listener to the window
    window.addEventListener("message", handleTallySubmission);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleTallySubmission);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // This component does not render anything to the DOM
  return null;
};

export default TallyTracker;
