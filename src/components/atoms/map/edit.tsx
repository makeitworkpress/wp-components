/**
 * Map Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RangeControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface MapAttributes extends Partial<BaseAttributes> {
  center: { lat: string; lng: string };
  fit: boolean;
  id: string;
  zoom: number;
}

interface EditProps {
  attributes: MapAttributes;
  setAttributes: (attrs: Partial<MapAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const {
    center = { lat: "52.090736", lng: "5.121420" },
    fit,
    id,
    zoom,
  } = attributes;

  return (
    <BlockWrapper className="atom-map">
      <InspectorControls>
        <PanelBody
          title={__("Map Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Map ID", "wp-components")}
            value={id}
            onChange={(value: string) => setAttributes({ id: value })}
          />
          <TextControl
            label={__("Latitude", "wp-components")}
            value={center.lat}
            onChange={(value: string) =>
              setAttributes({ center: { ...center, lat: value } })
            }
          />
          <TextControl
            label={__("Longitude", "wp-components")}
            value={center.lng}
            onChange={(value: string) =>
              setAttributes({ center: { ...center, lng: value } })
            }
          />
          <RangeControl
            label={__("Zoom Level", "wp-components")}
            value={zoom}
            onChange={(value: number) => setAttributes({ zoom: value })}
            min={1}
            max={20}
          />
          <ToggleControl
            label={__("Fit to Markers", "wp-components")}
            checked={fit}
            onChange={(value: boolean) => setAttributes({ fit: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/map" attributes={attributes} />
    </BlockWrapper>
  );
}
