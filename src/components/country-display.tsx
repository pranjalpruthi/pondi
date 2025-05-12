import { Badge } from "@/components/ui/badge"; // Using path alias
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react'; // Import React for useRef

// Define a more specific type based on the iskmCenters structure
// Removed motion import
// This should ideally be shared or imported if defined elsewhere globally
interface CenterSocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

interface TemplePresidentContact {
  whatsapp?: string;
  email?: string;
}

interface TemplePresident {
  name: string;
  image: string;
  quote: string;
  quoteSource: string;
  contact: TemplePresidentContact;
}

export interface CountryCenterData {
  name: string;
  country?: string; // Added optional country field
  coordinates: [number, number]; // Ensured this is a tuple
  flag: string;
  isLocal?: boolean;
  isHQ?: boolean;
  address?: string;
  mapLink?: string;
  social?: CenterSocialLinks;
  templePresident?: TemplePresident;
  // Add any other properties that might be part of a center's data
}

interface CountryButtonProps {
  center: CountryCenterData;
  onClick: () => void;
  isSelected: boolean; // Keep isSelected for potential styling, though active state will behandled in parent
}

const BaseCountryButton = ({ center, onClick, isSelected }: CountryButtonProps) => {
  // Reverted to standard button, removed motion props and layoutId
  return (
    <button
      type="button" // Added type="button" for accessibility
      onClick={onClick}
      className={`
        flex items-center justify-between w-full p-3 rounded-xl cursor-pointer
        transition-all duration-200 ease-in-out group // Added group for potential hover effects if needed later
        border 
        ${
          isSelected // Keep isSelected styling for the button in the grid
            ? "bg-gradient-to-r from-pink-100 to-white dark:from-pink-700/30 dark:to-gray-800/40 shadow-lg border-pink-300 dark:border-pink-600 scale-102" // Keep scale for selected? Maybe remove.
            : "bg-white/70 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/60 border-gray-200 dark:border-gray-700/80 hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]" // Add hover/active transforms here
        }
      `}
      // Removed style={{ transformOrigin: 'center' }} - handled by scale/translate classes
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        {/* Removed motion.span */}
        <span className="text-2xl md:text-3xl">
          {center.flag}
        </span>
        {/* Removed motion.span */}
        <span className="font-medium text-sm md:text-base text-gray-800 dark:text-white truncate">
          {center.name}
        </span>
      </div>
      {/* Removed motion.div */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
        {center.isLocal && (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-[10px] px-1 py-0 sm:px-1.5 sm:py-0.5">
            You're here
          </Badge>
        )}
        {center.isHQ && (
          <Badge variant="secondary" className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] px-1 py-0 sm:px-1.5 sm:py-0.5">
            HQ
          </Badge>
        )}
      </div>
    </button>
  );
};
export const CountryButton = React.memo(BaseCountryButton);

interface CountryButtonGridProps {
  centers: CountryCenterData[];
  onCenterSelect: (center: CountryCenterData) => void;
  selectedCenterName: string; // Keep for potential non-expanded selection indication
  className?: string;
}

export const CountryButtonGrid = ({
  centers,
  onCenterSelect,
  selectedCenterName,
  className = "",
}: CountryButtonGridProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Assuming a fixed height for the scrollable area or that the parent component will provide it.
  // For a responsive grid, virtualization is more complex.
  // This example assumes a single column list for simplicity with virtualization.
  // If a grid is strictly needed, each item would need a fixed size.
  // Let's adapt it to a scrollable list for now, or ensure the parent has a fixed height.

  const rowVirtualizer = useVirtualizer({
    count: centers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // Estimate height of CountryButton (p-3 + content + badge). Adjust as needed.
    // For a grid, you might need a 2D virtualizer or calculate indices differently.
    // This setup is more for a single column list.
    // If you want to keep the grid, the parent div below needs a fixed height.
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div 
      ref={parentRef} 
      className={`overflow-y-auto ${className}`} 
      // style={{ height: '400px' }} // Example: Parent must have a fixed height for virtualization
    >
      <div 
        className="relative w-full" 
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        <div 
          className="absolute top-0 left-0 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
          // The transform style is crucial for positioning virtual items
        >
          {virtualItems.map((virtualItem) => {
            const center = centers[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                // Apply transform to position the item correctly
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                  // Ensure items still flow in the grid. This might need adjustment
                  // depending on how the grid handles absolutely positioned direct children.
                  // For a true virtualized grid, this styling would be more complex.
                  // This approach might cause items to overlap if not handled carefully with grid structure.
                  // A simpler approach for grid is to virtualize rows of items.
                }}
                className="w-full" // Ensure it takes full width of its grid cell
              >
                <CountryButton
                  center={center}
                  onClick={() => onCenterSelect(center)}
                  isSelected={selectedCenterName === center.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
