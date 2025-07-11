declare module 'react-color-extractor' {
  import * as React from 'react';

  interface ColorExtractorProps {
    src: string;
    getColors: (colors: string[]) => void;
    maxColors?: number;
    onError?: (error: Error) => void;
  }

  export class ColorExtractor extends React.Component<ColorExtractorProps> {}
}
