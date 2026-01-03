import { useState } from 'react';
import { SmartBookingBridge } from './SmartBookingBridge';
import { bookingConfig } from '../config/bookingConfig';

export function SmartBookingBridgeExample() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenBooking}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
      >
        Book Consultation
      </button>

      <SmartBookingBridge
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        firstName="John"
        lastName="Doe"
        email="john.doe@example.com"
        webhookUrl={bookingConfig.webhookUrl}
        hasExternalSystem={bookingConfig.hasExternalSystem}
        externalBookingUrl={bookingConfig.externalBookingUrl}
      />
    </div>
  );
}
