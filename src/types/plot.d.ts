declare module 'react-plotly.js' {
  import { Component } from 'react';
  
  export interface PlotProps {
    data: Array<{
      x: Array<any>;
      y: Array<any>;
      type?: string;
      mode?: string;
      marker?: any;
      line?: any;
      name?: string;
      [key: string]: any;
    }>;
    layout?: {
      title?: string;
      autosize?: boolean;
      margin?: {
        l?: number;
        r?: number;
        b?: number;
        t?: number;
        pad?: number;
      };
      paper_bgcolor?: string;
      plot_bgcolor?: string;
      xaxis?: any;
      yaxis?: any;
      [key: string]: any;
    };
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  class Plot extends Component<PlotProps> {}
  
  export default Plot;
}