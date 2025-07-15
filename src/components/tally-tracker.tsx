import React, { useEffect } from 'react';

const TallyTracker: React.FC = () => {
  useEffect(() => {
    const handleTallySubmission = (event: MessageEvent) => {
      // Check if the event is from Tally and is a form submission
      if (event.data?.type === "TALLY_FORM_SUBMITTED") {
        // Ensure the Facebook Pixel function exists before calling it
        if (typeof window.fbq === 'function') {
          try {
            window.fbq('track', 'Lead');
            console.log("✅ Facebook Pixel 'Lead' event fired on Tally form submission.");
          } catch (error) {
            console.error("Facebook Pixel tracking error:", error);
          }
        } else {
          console.warn("Facebook Pixel (fbq) not found. Make sure it's loaded.");
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
