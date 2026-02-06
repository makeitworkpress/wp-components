/**
 * BaseAttributesPanel - Reusable panel for $base_atts defined in Component.php
 * Provides controls for: align, animation, appear, background, border, boxshadow,
 * color, display, float, grid, height, hover, overlay, parallax, position, rounded, video, width
 */
const wp = (window as any).wp;
const { __ } = wp.i18n;
const { PanelBody, SelectControl, TextControl } = wp.components;

export interface BaseAttributes {
  align: string;
  animation: string;
  appear: string;
  background: string;
  border: string;
  boxshadow: string;
  color: string;
  display: string;
  float: string;
  grid: string | boolean;
  height: string;
  hover: string;
  overlay: string;
  parallax: string;
  position: string;
  rounded: string;
  video: string;
  width: string;
}

interface BaseAttributesPanelProps {
  attributes: Partial<BaseAttributes>;
  setAttributes: (attrs: Partial<BaseAttributes>) => void;
}

const ALIGN_OPTIONS = [
  { label: __("Default", "wp-components"), value: "" },
  { label: __("Left", "wp-components"), value: "left" },
  { label: __("Center", "wp-components"), value: "center" },
  { label: __("Right", "wp-components"), value: "right" },
];

const ANIMATION_OPTIONS = [
  { label: __("None", "wp-components"), value: "" },
  { label: __("Fade In", "wp-components"), value: "fadein" },
  { label: __("Fade In Down", "wp-components"), value: "fadeindown" },
  { label: __("Slide In Left", "wp-components"), value: "slideinleft" },
  { label: __("Slide In Right", "wp-components"), value: "slideinright" },
  { label: __("Bounce", "wp-components"), value: "bounce" },
  { label: __("Flash", "wp-components"), value: "flash" },
  { label: __("Pulse", "wp-components"), value: "pulse" },
  { label: __("Shake", "wp-components"), value: "shake" },
  { label: __("Swing", "wp-components"), value: "swing" },
  { label: __("Tada", "wp-components"), value: "tada" },
  { label: __("Wobble", "wp-components"), value: "wobble" },
  { label: __("Zoom In", "wp-components"), value: "zoomIn" },
];

const DISPLAY_OPTIONS = [
  { label: __("Default", "wp-components"), value: "" },
  { label: __("Block", "wp-components"), value: "block" },
  { label: __("Inline", "wp-components"), value: "inline" },
  { label: __("Inline Block", "wp-components"), value: "inline-block" },
  { label: __("Flex", "wp-components"), value: "flex" },
  { label: __("Grid", "wp-components"), value: "grid" },
  { label: __("None", "wp-components"), value: "none" },
];

const FLOAT_OPTIONS = [
  { label: __("None", "wp-components"), value: "" },
  { label: __("Left", "wp-components"), value: "left" },
  { label: __("Right", "wp-components"), value: "right" },
];

const POSITION_OPTIONS = [
  { label: __("Default", "wp-components"), value: "" },
  { label: __("Relative", "wp-components"), value: "relative" },
  { label: __("Absolute", "wp-components"), value: "absolute" },
  { label: __("Fixed", "wp-components"), value: "fixed" },
  { label: __("Sticky", "wp-components"), value: "sticky" },
];

const ROUNDED_OPTIONS = [
  { label: __("None", "wp-components"), value: "" },
  { label: __("Small", "wp-components"), value: "small" },
  { label: __("Medium", "wp-components"), value: "medium" },
  { label: __("Large", "wp-components"), value: "large" },
  { label: __("Full", "wp-components"), value: "full" },
];

const BOXSHADOW_OPTIONS = [
  { label: __("None", "wp-components"), value: "" },
  { label: __("Small", "wp-components"), value: "small" },
  { label: __("Medium", "wp-components"), value: "medium" },
  { label: __("Large", "wp-components"), value: "large" },
];

const HOVER_OPTIONS = [
  { label: __("None", "wp-components"), value: "" },
  { label: __("Grow", "wp-components"), value: "grow" },
  { label: __("Shrink", "wp-components"), value: "shrink" },
  { label: __("Pulse", "wp-components"), value: "pulse" },
  { label: __("Pulse Grow", "wp-components"), value: "pulse-grow" },
  { label: __("Pulse Shrink", "wp-components"), value: "pulse-shrink" },
  { label: __("Push", "wp-components"), value: "push" },
  { label: __("Pop", "wp-components"), value: "pop" },
  { label: __("Bounce In", "wp-components"), value: "bounce-in" },
  { label: __("Bounce Out", "wp-components"), value: "bounce-out" },
  { label: __("Float", "wp-components"), value: "float" },
  { label: __("Sink", "wp-components"), value: "sink" },
  { label: __("Bob", "wp-components"), value: "bob" },
  { label: __("Hang", "wp-components"), value: "hang" },
];

export default function BaseAttributesPanel({
  attributes,
  setAttributes,
}: BaseAttributesPanelProps) {
  const {
    align = "",
    animation = "",
    appear = "",
    background = "",
    border = "",
    boxshadow = "",
    color = "",
    display = "",
    float: floatValue = "",
    grid = "",
    height = "",
    hover = "",
    overlay = "",
    parallax = "",
    position = "",
    rounded = "",
    video = "",
    width = "",
  } = attributes;

  return (
    <>
      <PanelBody title={__("Layout", "wp-components")} initialOpen={false}>
        <SelectControl
          label={__("Align", "wp-components")}
          value={align}
          options={ALIGN_OPTIONS}
          onChange={(value: string) => setAttributes({ align: value })}
        />
        <SelectControl
          label={__("Display", "wp-components")}
          value={display}
          options={DISPLAY_OPTIONS}
          onChange={(value: string) => setAttributes({ display: value })}
        />
        <SelectControl
          label={__("Float", "wp-components")}
          value={floatValue}
          options={FLOAT_OPTIONS}
          onChange={(value: string) => setAttributes({ float: value })}
        />
        <SelectControl
          label={__("Position", "wp-components")}
          value={position}
          options={POSITION_OPTIONS}
          onChange={(value: string) => setAttributes({ position: value })}
        />
        <TextControl
          label={__("Grid", "wp-components")}
          value={grid}
          onChange={(value: string) => setAttributes({ grid: value })}
          help={__("Grid column classes", "wp-components")}
        />
      </PanelBody>

      <PanelBody title={__("Dimensions", "wp-components")} initialOpen={false}>
        <TextControl
          label={__("Width", "wp-components")}
          value={width}
          onChange={(value: string) => setAttributes({ width: value })}
          placeholder="100px, 50%, 10rem"
          help={__("Min-width value with unit", "wp-components")}
        />
        <TextControl
          label={__("Height", "wp-components")}
          value={height}
          onChange={(value: string) => setAttributes({ height: value })}
          placeholder="100px, 50vh, 10rem"
          help={__("Min-height value with unit", "wp-components")}
        />
      </PanelBody>

      <PanelBody title={__("Appearance", "wp-components")} initialOpen={false}>
        <TextControl
          label={__("Background", "wp-components")}
          value={background}
          onChange={(value: string) => setAttributes({ background: value })}
          placeholder="#ffffff, rgb(0,0,0), url(...)"
          help={__("Color value, gradient, or image URL", "wp-components")}
        />
        <TextControl
          label={__("Text Color", "wp-components")}
          value={color}
          onChange={(value: string) => setAttributes({ color: value })}
          placeholder="#000000, rgb(0,0,0)"
        />
        <TextControl
          label={__("Border", "wp-components")}
          value={border}
          onChange={(value: string) => setAttributes({ border: value })}
          placeholder="#000000, linear-gradient(...)"
          help={__("Border color or gradient", "wp-components")}
        />
        <SelectControl
          label={__("Rounded Corners", "wp-components")}
          value={rounded}
          options={ROUNDED_OPTIONS}
          onChange={(value: string) => setAttributes({ rounded: value })}
        />
        <SelectControl
          label={__("Box Shadow", "wp-components")}
          value={boxshadow}
          options={BOXSHADOW_OPTIONS}
          onChange={(value: string) => setAttributes({ boxshadow: value })}
        />
        <TextControl
          label={__("Overlay", "wp-components")}
          value={overlay}
          onChange={(value: string) => setAttributes({ overlay: value })}
          placeholder="dark, light, or custom"
          help={__("Overlay style preset", "wp-components")}
        />
      </PanelBody>

      <PanelBody
        title={__("Animation & Effects", "wp-components")}
        initialOpen={false}
      >
        <SelectControl
          label={__("Animation", "wp-components")}
          value={animation}
          options={ANIMATION_OPTIONS}
          onChange={(value: string) => setAttributes({ animation: value })}
        />
        <TextControl
          label={__("Appear", "wp-components")}
          value={appear}
          onChange={(value: string) => setAttributes({ appear: value })}
          help={__("Scroll-triggered appearance", "wp-components")}
        />
        <SelectControl
          label={__("Hover Effect", "wp-components")}
          value={hover}
          options={HOVER_OPTIONS}
          onChange={(value: string) => setAttributes({ hover: value })}
        />
        <TextControl
          label={__("Parallax", "wp-components")}
          value={parallax}
          onChange={(value: string) => setAttributes({ parallax: value })}
          help={__("Parallax scroll effect", "wp-components")}
        />
      </PanelBody>

      <PanelBody title={__("Media", "wp-components")} initialOpen={false}>
        <TextControl
          label={__("Video Background", "wp-components")}
          value={video}
          onChange={(value: string) => setAttributes({ video: value })}
          placeholder="https://..."
          help={__("Video URL for background", "wp-components")}
        />
      </PanelBody>
    </>
  );
}
