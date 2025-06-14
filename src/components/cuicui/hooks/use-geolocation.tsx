import {useState, useCallback } from "react";

// Define the shape of the geolocation data
interface GeolocationData {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: number;
}

// Define possible geolocation errors
interface GeolocationError {
  code: number;
  message: string;
}

// Define the return type of the hook
interface UseGeolocationReturn {
  data: GeolocationData | null;
  error: GeolocationError | null;
  isLoading: boolean;
  getLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [data, setData] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by your browser.",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    // Success handler
    const handleSuccess = (position: GeolocationPosition) => {
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      } = position.coords;
      const { timestamp } = position;
      setData({
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp,
      });
      setIsLoading(false);
    };
    // Error handler
    const handleError = (geolocationError: GeolocationPositionError) => {
      setError({
        code: geolocationError.code,
        message: geolocationError.message,
      });
      setIsLoading(false);
    };
    // Get the current position (one-time)
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    // Optionally, you can enable watchPosition for live updates:
    // if (watchIdRef.current !== null) {
    //   navigator.geolocation.clearWatch(watchIdRef.current);
    // }
    // watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError);
  }, []);

  // Cleanup function to clear the watch on unmount (if you use watchPosition)
  // useEffect(() => {
  //   return () => {
  //     if (watchIdRef.current !== null) {
  //       navigator.geolocation.clearWatch(watchIdRef.current);
  //     }
  //   };
  // }, []);

  return { data, error, isLoading, getLocation };
};
