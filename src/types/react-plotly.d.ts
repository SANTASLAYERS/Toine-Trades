declare module 'react-plotly.js' {
  import React from 'react';
  import Plotly from 'plotly.js';

  interface PlotParams {
    data?: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    frames?: Plotly.Frame[];
    config?: Partial<Plotly.Config>;
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onError?: (err: Error) => void;
    onLegendClick?: (event: Plotly.LegendClickEvent) => boolean | void;
    onLegendDoubleClick?: (event: Plotly.LegendClickEvent) => boolean | void;
    onSliderChange?: (event: Plotly.SliderChangeEvent) => void;
    onSliderEnd?: (event: Plotly.SliderEndEvent) => void;
    onSliderStart?: (event: Plotly.SliderStartEvent) => void;
    onAnimated?: () => void;
    onAnimatingFrame?: (event: Plotly.AnimationFrameEvent) => void;
    onAnimationInterrupted?: () => void;
    onAutoSize?: () => void;
    onBeforeHover?: () => void;
    onButtonClicked?: (event: Plotly.ButtonClickEvent) => void;
    onClick?: (event: Plotly.PlotMouseEvent) => void;
    onClickAnnotation?: (event: Plotly.ClickAnnotationEvent) => void;
    onDeselect?: () => void;
    onDoubleClick?: () => void;
    onFramework?: () => void;
    onHover?: (event: Plotly.PlotMouseEvent) => void;
    onRelayout?: (event: Plotly.RelayoutEvent) => void;
    onRestyle?: (event: Plotly.RestyleEvent) => void;
    onRedraw?: () => void;
    onSelected?: (event: Plotly.PlotSelectionEvent) => void;
    onSelecting?: (event: Plotly.PlotSelectionEvent) => void;
    onUnhover?: (event: Plotly.PlotMouseEvent) => void;
    onWebGlContextLost?: () => void;
    onAfterExport?: () => void;
    onAfterPlot?: () => void;
    onAnimated?: () => void;
    onBeforeExport?: () => void;
    'data-testid'?: string;
  }

  export default class Plot extends React.Component<PlotParams> {}
}