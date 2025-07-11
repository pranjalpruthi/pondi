import { Send } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface AppleChatInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSendMessage: (value: string) => void;
}

const AppleChatInput = React.forwardRef<HTMLInputElement, AppleChatInputProps>(
  ({ className, onSendMessage, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setIsTyping(event.target.value.length > 0);
    };

    const handleSend = () => {
      if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue('');
        setIsTyping(false);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSend();
      }
    };

    return (
      <div className={cn('flex items-center p-1.5 rounded-full bg-gray-200/70 dark:bg-gray-800/80 relative transition-all duration-300', 
        isTyping ? 'bg-gray-200 dark:bg-gray-700' : '',
        className
      )}>
        <div className="absolute inset-0 rounded-full pointer-events-none chat-input-glow" />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow bg-transparent focus:outline-none px-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(inputValue.length > 0)}
          ref={ref}
          {...props}
        />
        <AnimatePresence>
          {isTyping && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={handleSend}
              className="flex items-center justify-center size-7 rounded-full bg-blue-500 text-white flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AppleChatInput.displayName = 'AppleChatInput';

export { AppleChatInput };
