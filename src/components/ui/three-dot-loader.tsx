export const ThreeDotSimpleLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-1 dark:invert py-4">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-900" />
    </div>
  );
};

export default ThreeDotSimpleLoader;