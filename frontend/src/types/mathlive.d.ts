import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        ref?: React.RefObject<any>;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}
