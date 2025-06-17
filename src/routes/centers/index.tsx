import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useMemo, Suspense, lazy, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type CountryCenterData } from '@/components/country-display';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  MapPin,
  ChevronDown,
  List
} from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconMail,
} from '@tabler/icons-react';
import type { GlobeConfig } from "@/components/ui/globe";
import { getCenters } from '@/integrations/nocodb-api';
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import World component
const LazyWorld = lazy(() => import("@/components/ui/globe").then((module) => ({ default: module.World })));

// Function to transform NocoDB data to CountryCenterData format
const transformToCountryCenterData = (centers: any[]): CountryCenterData[] => {
  return centers.map(center => {
    const coordinates = center.geo ? center.geo.split(';').map((coord: string) => parseFloat(coord)) : [0, 0];
    return {
      name: center['Temple Name'] || 'Unknown Center',
      country: center.country || 'Unknown Country',
      coordinates: [coordinates[1], coordinates[0]], // Assuming format is lat;lng
      flag: getFlagForCountry(center.country),
      isLocal: center['Temple Name'].includes('Pondicherry'),
      address: center.Address || '',
      mapLink: center.map || '#',
      social: {
        facebook: center.fb || '',
        instagram: center.ig || '',
        youtube: center.yt || ''
      },
      templePresident: {
        name: center['Temple President'] || 'N/A',
        image: center['President DP']?.[0]?.thumbnails?.card_cover?.signedPath ? (() => {
          const imageUrl = "https://db.vrindavanam.org.in/" + center['President DP'][0].thumbnails.card_cover.signedPath;
          console.log(`Attempting to load image for ${center['Temple Name']}: ${imageUrl}`);
          return imageUrl;
        })() : '/pp/pp1.webp',
        contact: {
          whatsapp: center.wa || center.Phone || '',
          email: center.Email || ''
        },
        quote: '',
        quoteSource: ''
      }
    };
  });
};

// Helper function to get flag based on country name
const getFlagForCountry = (country: string): string => {
  switch (country.toLowerCase()) {
    case 'india': return '🇮🇳';
    case 'singapore': return '🇸🇬';
    case 'philippines': return '🇵🇭';
    case 'australia': return '🇦🇺';
    default: return '🌍';
  }
};

// Adjusted SocialButton for compactness
const BaseCompactSocialButton = ({
  url,
  icon: Icon,
  label,
  color
}: {
  url: string;
  icon: any;
  label: string;
  color: string;
}) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit ${label}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center h-7 w-7 rounded-full ${color} transition-transform`}
  >
    <Icon size={14} className="text-white" />
  </motion.a>
);
const CompactSocialButton = React.memo(BaseCompactSocialButton);

// Group centers by country flag for the new collapsible list
// Also identify if a group contains HQ or Local center
const getCountryGroups = (centers: CountryCenterData[]) => {
  const groups: Record<string, { flag: string; countryName: string; centers: CountryCenterData[]; hasHQ: boolean; hasLocal: boolean }> = {};
  centers.forEach(center => {
    const countryName = center.country || center.name.replace(/ISKM\s+/i, '').split(',')[0].trim(); // Use 'country' field if available
    const key = center.flag;
    if (!groups[key]) {
      groups[key] = { flag: center.flag, countryName: countryName, centers: [], hasHQ: false, hasLocal: false };
    }
    groups[key].centers.push(center);
    if (center.isHQ) {
      groups[key].hasHQ = true;
    }
    if (center.isLocal) {
      groups[key].hasLocal = true;
    }
  });
  return Object.values(groups);
};

// Helper component for virtualized list of centers within a collapsible
const VirtualizedCenterList = ({
  centers,
  selectedCenterName,
  onCenterSelect,
  countryName, // Pass countryName to help with text replacement if needed
}: {
  centers: CountryCenterData[];
  selectedCenterName: string | null;
  onCenterSelect: (center: CountryCenterData) => void;
  countryName: string;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: centers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38, // Estimate: py-2 (8px*2=16px) + text (14px) + gap (2px) + padding (2px*2=4px) ~ 36px. Rounded to 38.
    overscan: 5, // Render a few more items than visible
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div 
      ref={parentRef} 
      className="overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-pink-700 scrollbar-track-transparent"
      style={{ height: '180px' }} // Define a fixed height for the scrollable area within collapsible
    >
      <div 
        className="relative w-full" 
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const center = centers[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <VirtualizedCenterItemButton
                center={center}
                isSelected={selectedCenterName === center.name}
                onSelect={onCenterSelect}
                countryName={countryName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Memoized button for individual centers in the virtualized list
interface VirtualizedCenterItemButtonProps {
  center: CountryCenterData;
  isSelected: boolean;
  onSelect: (center: CountryCenterData) => void;
  countryName: string;
}

const BaseVirtualizedCenterItemButton = ({ center, isSelected, onSelect, countryName }: VirtualizedCenterItemButtonProps) => (
  <button
    onClick={() => onSelect(center)}
    className={`
      w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2
      transition-colors duration-150
      ${isSelected 
        ? "bg-pink-100 dark:bg-pink-600/50 text-pink-700 dark:text-pink-100" 
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/70"
      }
      focus:outline-none focus:ring-1 focus:ring-pink-500
    `}
  >
    <List size={14} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
    <span className="truncate">{center.name.replace(`ISKM ${countryName}, `, '').replace(`ISKM `, '').replace(`${countryName} `, '')}</span>
  </button>
);
const VirtualizedCenterItemButton = React.memo(BaseVirtualizedCenterItemButton);

// Reusable component for rendering center details
const CenterDetailsContent = ({ center }: { center: CountryCenterData | null }) => {
  if (!center) return null;

  return (
    // Using text-xs and sm:text-sm for content within card/drawer for mobile friendliness
    <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
      <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-300 dark:border-gray-600 pb-1.5 sm:pb-2 mb-1.5 sm:mb-2">
        <span className="text-xl sm:text-2xl">{center.flag}</span>
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{center.name}</h4>
      </div>
      
      {center.address && center.mapLink && (
        <div className="flex items-start">
          <MapPin className="text-pink-600 dark:text-pink-400 mt-0.5 mr-2 flex-shrink-0" size={14} />
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-snug">{center.address}</p>
            <a href={center.mapLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
              <Button variant="outline" className="bg-white text-blue-600 border-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-700/30 text-xs px-3 py-1 rounded-md shadow-sm">
                Visit Us on Maps <MapPin size={12} className="ml-1" />
              </Button>
            </a>
          </div>
        </div>
      )}

      {center.social && (center.social.facebook || center.social.instagram || center.social.youtube) && (
        <div className="pt-1.5">
          <h5 className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Connect:</h5>
          <div className="flex space-x-2">
            {center.social.facebook && <CompactSocialButton url={center.social.facebook} icon={IconBrandFacebook} label="Facebook" color="bg-blue-600" />}
            {center.social.instagram && <CompactSocialButton url={center.social.instagram} icon={IconBrandInstagram} label="Instagram" color="bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-500" />}
            {center.social.youtube && <CompactSocialButton url={center.social.youtube} icon={IconBrandYoutube} label="YouTube" color="bg-red-600" />}
          </div>
        </div>
      )}

      {center.templePresident && (
        <div className="bg-gray-100/60 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600/70 text-xs mt-2">
          <h5 className="text-xs font-semibold mb-1.5 text-gray-800 dark:text-white">Temple President</h5>
            <div className="flex items-center mb-2">
              <motion.img 
                src={center.templePresident.image} 
                alt={center.templePresident.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-3 border-2 border-white dark:border-gray-400 shadow-md" 
                width="56" 
                height="56" 
                loading="lazy"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <div className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">{center.templePresident.name}</div>
            </div>
          {center.templePresident.contact && (center.templePresident.contact.whatsapp || center.templePresident.contact.email) && (
            <div className="border-t border-gray-300 dark:border-gray-600 pt-1.5">
              <h6 className="text-[10px] font-medium mb-1 text-gray-600 dark:text-gray-300">Contact:</h6>
              <div className="flex flex-col space-y-1">
                {center.templePresident.contact.whatsapp && (
                  <a href={`https://wa.me/${center.templePresident.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-1.5 rounded-md bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors duration-200 border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-1.5">
                      <IconBrandWhatsapp size={14} className="text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">WhatsApp</span>
                    </div>
                    <span className="text-xs text-green-700 dark:text-green-300 font-mono">{center.templePresident.contact.whatsapp}</span>
                  </a>
                )}
                {center.templePresident.contact.email && (
                  <a href={`mailto:${center.templePresident.contact.email}`} className="flex items-center p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors duration-200 border border-blue-200 dark:border-blue-700">
                    <IconMail size={14} className="text-blue-600 dark:text-blue-400 mr-1.5" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Email</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
       {!center.address && !center.templePresident && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1.5">Details coming soon.</p>
      )}
    </div>
  );
};


export const Route = createFileRoute('/centers/')({
  component: CentersRouteComponent,
});

function CentersRouteComponent() {
  const isMobile = useIsMobile();
  const [showGlobe, setShowGlobe] = useState(!isMobile); // Hide globe by default on mobile
  const [selectedCenterDetails, setSelectedCenterDetails] = useState<CountryCenterData | null>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false); // State for mobile details drawer

  // Fetch centers data using TanStack Query
  const { data: centersData, isLoading, error } = useQuery({
    queryKey: ['centers'],
    queryFn: () => getCenters(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const iskmCenters = useMemo(() => {
    if (centersData && centersData.list) {
      return transformToCountryCenterData(centersData.list);
    }
    return [];
  }, [centersData]);

  const [targetGlobePosition, setTargetGlobePosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (iskmCenters.length > 0 && selectedCenterDetails === null) {
      setSelectedCenterDetails(iskmCenters[0]);
      setTargetGlobePosition({
        lat: iskmCenters[0].coordinates[1] || 0,
        lng: iskmCenters[0].coordinates[0] || 0
      });
    }
  }, [iskmCenters]);

  const countryGroups = useMemo(() => getCountryGroups(iskmCenters), [iskmCenters]);

  // Quotes
  const prabhupadaQuotes = useMemo(() => [
    { text: "Chant Hare Krishna and your life will be sublime.", citation: "A.C. Bhaktivedanta Swami Prabhupada" },
    { text: "Religion without philosophy is sentiment, or sometimes fanaticism, while philosophy without religion is mental speculation.", citation: "Srimad Bhagavatam 1.2.12, Purport" },
    { text: "The human form of life is a chance to get out of the cycle of birth and death. Don't waste it.", citation: "A.C. Bhaktivedanta Swami Prabhupada" },
    { text: "Our only business is to love Krishna.", citation: "A.C. Bhaktivedanta Swami Prabhupada" }
  ], []);

  // Select a random quote
  const randomQuoteIndex = useMemo(() => Math.floor(Math.random() * prabhupadaQuotes.length), [prabhupadaQuotes]);
  const displayQuote = prabhupadaQuotes[randomQuoteIndex];

  // Globe config - adjust for mobile
  const globeConfig: GlobeConfig = useMemo(() => ({
    pointSize: isMobile ? 0.8 : 1.0, // Smaller points on mobile
    globeColor: "#ffffff",
    showAtmosphere: true,
    atmosphereColor: "#ff9ff3",
    atmosphereAltitude: 0.22,
    emissive: "#ffffff",
    emissiveIntensity: 1.0,
    shininess: 1.2,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#E91E63",
    pointLightIntensity: 1.2,
    arcTime: 1000,
    arcLength: 0.85,
    rings: 3,
    maxRings: 3,
    ringPropagationSpeed: 2,
    initialPosition: { lat: iskmCenters.length > 0 ? (iskmCenters[0].coordinates[1] || 0) : 0, lng: iskmCenters.length > 0 ? (iskmCenters[0].coordinates[0] || 0) : 0 },
    autoRotate: true,
    autoRotateSpeed: 0.25,
    cameraZ: isMobile ? 550 : 480, // Further camera on mobile = smaller globe
    cameraFov: isMobile ? 35 : 30, // Adjust FOV for mobile if needed
    enableZoom: false,
    noBoundaries: true,
  }), [isMobile, iskmCenters]); // Add isMobile and iskmCenters to dependencies

  // Arc colors
  const arcColors = ["#E91E63", "#EC407A", "#D81B60"];

  // Generate arcs
  const arcs = useMemo(() => {
    let generatedArcs = [];
    for (let i = 0; i < iskmCenters.length; i++) {
      // Reduced connectionsCount from 3 to 1
      const connectionsCount = Math.min(1, iskmCenters.length - 1); 
      for (let j = 1; j <= connectionsCount; j++) {
        const targetIndex = (i + j) % iskmCenters.length;
        generatedArcs.push({
          order: i * connectionsCount + j,
          startLat: iskmCenters[i].coordinates[1],
          startLng: iskmCenters[i].coordinates[0],
          endLat: iskmCenters[targetIndex].coordinates[1],
          endLng: iskmCenters[targetIndex].coordinates[0],
          arcAlt: 0.3,
          color: arcColors[Math.floor(Math.random() * arcColors.length)],
        });
      }
    }
    return generatedArcs;
  }, [iskmCenters]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading centers data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error loading centers data: {error.message}</div>;
  }


  // Handle center selection from collapsible list
  const handleCenterSelect = (center: CountryCenterData) => {
    setSelectedCenterDetails(center);
    setTargetGlobePosition({ // Still update globe target for when it's shown
      lat: center.coordinates[1],
      lng: center.coordinates[0]
    });
    if (isMobile) {
      setDetailsDrawerOpen(true); // Open drawer on mobile
    }
  };


  return (
    <div className="flex flex-col"> {/* Removed min-h-screen */}
      {/* Adjusted padding for wider feel on desktop, and reduced gap between columns */}
      <div className="w-full max-w-none py-16 lg:pt-24 flex-grow"> {/* Adjusted padding for wider feel on desktop */}
        {/* Adjusted column widths and gap */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12"> {/* Gap remains the same */}
          {/* Left side: Content - Made Even Wider */}
          <div className="w-full lg:w-1/2 xl:w-2/5"> {/* Further increased width */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl pt-10 lg:pt-12 px-6 lg:px-8 pb-6 lg:pb-8 shadow-xl space-y-6 h-full flex flex-col">
              {/* Center List Card */}
              <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg rounded-xl p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Our Centers
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100 dark:scrollbar-thumb-pink-600 dark:scrollbar-track-gray-700">
                  {countryGroups.map((group) => (
                    <Collapsible key={group.flag} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className={`
                            flex items-center justify-between w-full p-3 rounded-lg cursor-pointer
                            transition-all duration-200 ease-in-out group
                            border text-left
                            ${selectedCenterDetails && group.centers.some(c => c.name === selectedCenterDetails.name)
                              ? "bg-pink-100/80 dark:bg-pink-700/40 shadow-md border-pink-300 dark:border-pink-600" // Removed scale-102 for trigger
                              : "bg-white/70 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/60 border-gray-200 dark:border-gray-700/80 hover:shadow-sm"
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{group.flag}</span>
                            <span className="font-medium text-gray-800 dark:text-white">{group.countryName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {group.hasLocal && <Badge variant="default" className="bg-green-500 text-white text-[10px] px-1.5 py-0.5">You're here</Badge>}
                            {group.hasHQ && <Badge variant="secondary" className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5">HQ</Badge>}
                            <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-transform duration-150 group-data-[state=open]/collapsible:rotate-180" />
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-white/50 dark:bg-gray-800/30 rounded-b-md border border-t-0 border-gray-200 dark:border-gray-700/80">
                        {/* Removed pt-1 pb-2 px-1 from CollapsibleContent, will be handled by VirtualizedCenterList or its items */}
                        {/* Removed space-y-1 mt-1 div */}
                        <VirtualizedCenterList
                          centers={group.centers}
                          selectedCenterName={selectedCenterDetails?.name || null}
                          onCenterSelect={handleCenterSelect}
                          countryName={group.countryName}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </Card>

              {/* Static Content */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4 mt-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Our Global Outreach
                  </h1>
                  <div className="flex items-center space-x-4">
                    <img src="/assets/iskm.webp" alt="ISKM Logo" className="h-12" width="48" height="48" loading="lazy" />
                    <img src="/pp/pp1.webp" alt="Prabhupada" className="h-12 w-12 object-cover rounded-full" width="48" height="48" loading="lazy" />
                  </div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl font-light mb-4">
                  ISKM connects devotees worldwide, spreading Krishna consciousness through our centers across continents.
                </p>
                <blockquote className="mt-4 text-md text-gray-600 dark:text-gray-400 italic border-l-4 border-pink-500 pl-4">
                  {displayQuote.text}
                  <cite className="block mt-1 text-sm text-gray-500 dark:text-gray-400">— {displayQuote.citation}</cite>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Centered Globe and Compact Details Card */}
          <div className="w-full lg:w-1/2 xl:w-3/5 relative flex flex-col items-center justify-center min-h-[60vh] lg:min-h-full p-0 md:py-4 lg:pt-4 xl:pt-6">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-[800px] aspect-square"> {/* Increased max-width for larger size */}
                {showGlobe ? ( // Globe is shown based on state
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-pink-500 border-t-transparent animate-spin" />
                    </div>
                  }>
                    <LazyWorld
                      globeConfig={globeConfig}
                      data={arcs}
                      targetCoordinates={targetGlobePosition}
                      selectedCenter={selectedCenterDetails} // Pass the whole object
                      // highlightedCenter prop is no longer needed here
                    />
                  </Suspense>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Button onClick={() => setShowGlobe(true)}>Load Globe</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Compact Details Card */}
            {!isMobile && selectedCenterDetails && (
              <Card className="absolute top-10 right-6 lg:top-12 lg:right-8 z-20 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-xl p-3 sm:p-4 border border-gray-300 dark:border-gray-700 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                <CenterDetailsContent center={selectedCenterDetails} />
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Details Drawer */}
      {isMobile && (
        <Drawer open={detailsDrawerOpen} onOpenChange={setDetailsDrawerOpen}>
          <DrawerContent className="max-h-[85vh]"> {/* Limit height of drawer */}
            <div className="p-4 pt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {selectedCenterDetails && (
                <DrawerHeader className="p-0 pb-3 pt-1 text-left">
                  {/* Using a more concise title for the drawer */}
                  <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCenterDetails.name.split(',')[0]}
                  </DrawerTitle>
                </DrawerHeader>
              )}
              <CenterDetailsContent center={selectedCenterDetails} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
