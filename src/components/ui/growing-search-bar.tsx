import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const SearchBar = ({
  variant = 'default',
  onSearch,
}: {
  variant?: 'default' | 'panel';
  onSearch?: (value: string) => void;
}) => {
  const [searchSubmittedOutline, setSearchSubmittedOutline] = useState(false);
  const [searchSubmittedShadow, setSearchSubmittedShadow] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleSearch() {
    if (!searchValue) return;
    setSearchSubmittedOutline(true);
    setSearchSubmittedShadow(true);

    if (onSearch) {
      onSearch(searchValue);
      setSearchValue("");
    } else {
      toast(`Searching for ${searchValue}`);
    }
  }

  useEffect(() => {
    if (searchSubmittedOutline) {
      // Wait 150ms
      setTimeout(() => {
        setSearchSubmittedOutline(false);
      }, 150);
    }
  }, [searchSubmittedOutline]);

  useEffect(() => {
    if (searchSubmittedShadow) {
      // Wait 1s
      setTimeout(() => {
        setSearchSubmittedShadow(false);
      }, 1000);
    }
  }, [searchSubmittedShadow]);

  return (
    <label
      className={cn(
        "relative rounded-full text-neutral-500 dark:text-neutral-400",
        "group transform-gpu transition-all ease-in-out",
        " relative",
        variant === 'default' && "inline-flex origin-center",
        variant === 'panel' && "flex w-full",
        "before:absolute before:top-0 before:left-0 before:h-full before:w-full before:transform-gpu before:rounded-full before:transition-all before:duration-700 before:ease-in-out before:content-['']",
        searchSubmittedShadow
          ? "before:shadow-[0px_0px_0px_8px_#FFD700] before:blur-2xl"
          : "before:shadow-[0px_0px_1px_0px_#FFFFFF00] before:blur-0",
        searchSubmittedOutline
          ? "scale-90 duration-75"
          : "duration-300 hover:scale-105",
      )}
      htmlFor="search"
    >
      <input
        className={cn(
          "peer transform-gpu rounded-full p-2 pl-10 transition-all ease-in-out",
          variant === 'default' && "max-w-10 focus:max-w-40",
          variant === 'panel' && "w-full",
          // BACKGROUND
          "bg-white/70 hover:bg-white/80 dark:bg-pink-800/40 dark:hover:bg-pink-700/50 dark:text-white",
          // OUTLINE
          "-outline-offset-1 outline outline-1",
          searchSubmittedOutline
            ? "outline-amber-500 duration-150"
            : "outline-neutral-200/0 duration-300 hover:outline-neutral-200/100 dark:outline-pink-400/70 dark:hover:outline-pink-400/90 dark:focus:outline-pink-400/90",
          // PLACEHOLDER
          " placeholder-neutral-300/0 focus:placeholder-neutral-400 dark:placeholder-neutral-300/0 dark:focus:placeholder-neutral-200",
        )}
        id="search"
        onBlur={() => {
          setSearchSubmittedOutline(false);
          setSearchSubmittedShadow(false);
          setSearchValue("");
        }}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        onSubmit={handleSearch}
        placeholder="Search"
        type="search"
        value={searchValue}
      />
      <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.5 size-5 text-neutral-300 transition-colors peer-focus:text-neutral-500 dark:text-neutral-300 dark:peer-focus:text-neutral-100" />
    </label>
  );
};

export default SearchBar;
