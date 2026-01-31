const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  lat: string;
  lng: string;
  zoom: number;
  height: string;
  markers: Array<{ lat: string; lng: string; title?: string }>;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { lat, lng, zoom, height } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-map",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Map Settings", "wp-components")} initialOpen={true}>
          <TextControl
            label={__("Latitude", "wp-components")}
            value={lat}
            onChange={(value) => setAttributes({ lat: value })}
            placeholder="52.3676"
          />
          <TextControl
            label={__("Longitude", "wp-components")}
            value={lng}
            onChange={(value) => setAttributes({ lng: value })}
            placeholder="4.9041"
          />
          <RangeControl
            label={__("Zoom Level", "wp-components")}
            value={zoom}
            onChange={(value) => setAttributes({ zoom: value || 14 })}
            min={1}
            max={20}
          />
          <TextControl
            label={__("Height", "wp-components")}
            value={height}
            onChange={(value) => setAttributes({ height: value })}
            placeholder="400px"
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} style={{ height }}>
        <Placeholder
          icon="location-alt"
          label={__("WPC Map", "wp-components")}
          instructions={
            lat && lng
              ? `${__("Coordinates:", "wp-components")} ${lat}, ${lng}`
              : __("Configure map coordinates in block settings", "wp-components")
          }
        />
      </div>
    </>
  );
}

export default Edit;
