import { useState, useMemo } from "react"; // Added useMemo
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Element {
  id: number;
  width: number;
  img: string;
}

interface Column {
  id: number;
  elements: Element[];
}

// Default items if no imageUrls are provided
const defaultItems: Column[] = [
  {
    id: 1,
    elements: [
      { id: 1, width: 250, img: "/temple-building/1.webp" },
      { id: 2, width: 100, img: "/temple-building/2.webp" },
    ],
  },
  {
    id: 2,
    elements: [
      { id: 3, width: 100, img: "/temple-building/3.webp" },
      { id: 4, width: 250, img: "/temple-building/4.webp" },
    ],
  },
];

interface TwoProps {
  imageUrls?: string[];
}

const Two = ({ imageUrls }: TwoProps) => {
  const itemsToDisplay = useMemo(() => {
    if (imageUrls && imageUrls.length > 0) {
      const elements: Element[] = imageUrls.map((url, index) => ({
        id: index + 1, // Simple ID generation
        width: index % 2 === 0 ? 250 : 100, // Alternate widths for some variation
        img: url,
      }));

      // Distribute into two columns for this example
      const col1Elements: Element[] = [];
      const col2Elements: Element[] = [];
      elements.forEach((el, idx) => {
        if (idx % 2 === 0) {
          col1Elements.push(el);
        } else {
          col2Elements.push(el);
        }
      });
      
      const dynamicColumns: Column[] = [];
      if (col1Elements.length > 0) dynamicColumns.push({ id: 1, elements: col1Elements });
      if (col2Elements.length > 0) dynamicColumns.push({ id: 2, elements: col2Elements });
      
      return dynamicColumns.length > 0 ? dynamicColumns : [{id: 1, elements }]; // Fallback to single column if distribution is uneven
    }
    return defaultItems;
  }, [imageUrls]);

  const [activeItem, setActiveItem] = useState<Element | null>(null);

  const allElements = itemsToDisplay.flatMap((column) => column.elements);

  const handleItemClick = (ele: Element) => {
    setActiveItem(ele);
  };

  return (
    <div className="h-full center w-full flex flex-col gap-5 relative">
      <motion.div
        className={cn("flex flex-col gap-5")}
        layout
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {itemsToDisplay.map((column) => (
          <motion.div
            className={cn("flex items-center justify-center gap-5 flex-wrap")} // Added flex-wrap
            key={column.id}
            animate={{
              opacity: activeItem !== null ? 0 : 1,
              willChange: "auto",
            }}
          >
            {column.elements.map((ele, index) => (
              <Gallery
                item={ele}
                key={index}
                onClick={() => setActiveItem(ele)}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>

      {activeItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, willChange: "auto" }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute inset-0 w-full h-full  overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeItem.id}
              className="w-full h-full flex items-center justify-center gap-10 overflow-hidden "
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              layout
            >
              <motion.div
                layoutId={`card-${activeItem.id}`}
                className="w-[400px] h-[400px] rounded-3xl center font-bold text-5xl cursor-pointer overflow-hidden z-10"
                onClick={() => setActiveItem(null)}
              >
                <img
                  src={activeItem.img}
                  alt=""
                  className="w-full object-cover h-full"
                />
              </motion.div>
              <motion.div
                className="flex flex-col gap-4 justify-center items-center"
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", delay: 0.3, stiffness: 260, damping: 20 }}
              >
                {allElements
                  .filter((ele) => ele.id !== activeItem.id)
                  .map((ele) => (
                    <Gallery
                      key={ele.id}
                      item={ele}
                      onClick={() => handleItemClick(ele)}
                      isSmall
                    />
                  ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const Gallery = (props: {
  item: Element;
  onClick: () => void;
  isSmall?: boolean;
}) => {
  return (
    <motion.div
      style={{
        width: props.isSmall ? 80 : props.item.width,
        height: props.isSmall ? 80 : 150,
      }}
      className={cn(
        "rounded-2xl cursor-pointer text-3xl center overflow-hidden relative"
      )}
      layoutId={`card-${props.item.id}`}
      onClick={props.onClick}
    >
      <motion.img
        src={props.item.img}
        alt=""
        className="w-full object-cover h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      />
    </motion.div>
  );
};

export default Two;
