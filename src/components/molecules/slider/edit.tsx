/**
 * Slider Molecule Editor
 * Attributes match Slider.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, TextControl, SelectControl, RangeControl } =
  wp.components;
const ServerSideRender = wp.serverSideRender;

interface SliderAttributes extends Partial<BaseAttributes> {
  options: {
    arrowKeys?: boolean;
    autoHeight?: boolean;
    mode?: string;
    mouseDrag?: boolean;
    speed?: number;
  };
  schema: boolean;
  scroll: boolean;
  slides: Array<{
    atoms?: any[];
    attributes?: object;
    image?: object;
    video?: object;
  }>;
  thumbnail_size: string;
}

interface EditProps {
  attributes: SliderAttributes;
  setAttributes: (attrs: Partial<SliderAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { options = {}, schema, scroll, thumbnail_size } = attributes;

  const updateOption = (key: string, value: any) => {
    setAttributes({
      options: {
        ...options,
        [key]: value,
      },
    });
  };

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Slider Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Mode", "wp-components")}
            value={options.mode || "carousel"}
            options={[
              { label: __("Carousel", "wp-components"), value: "carousel" },
              { label: __("Gallery", "wp-components"), value: "gallery" },
            ]}
            onChange={(value: string) => updateOption("mode", value)}
          />
          <RangeControl
            label={__("Animation Speed (ms)", "wp-components")}
            value={options.speed || 500}
            onChange={(value: number) => updateOption("speed", value)}
            min={100}
            max={2000}
            step={100}
          />
          <ToggleControl
            label={__("Auto Height", "wp-components")}
            checked={options.autoHeight !== false}
            onChange={(value: boolean) => updateOption("autoHeight", value)}
          />
          <ToggleControl
            label={__("Arrow Keys Navigation", "wp-components")}
            checked={options.arrowKeys !== false}
            onChange={(value: boolean) => updateOption("arrowKeys", value)}
          />
          <ToggleControl
            label={__("Mouse Drag", "wp-components")}
            checked={options.mouseDrag !== false}
            onChange={(value: boolean) => updateOption("mouseDrag", value)}
          />
        </PanelBody>

        <PanelBody
          title={__("Additional Options", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
          <ToggleControl
            label={__("Show Scroll Button", "wp-components")}
            checked={scroll}
            onChange={(value: boolean) => setAttributes({ scroll: value })}
          />
          <TextControl
            label={__("Thumbnail Size", "wp-components")}
            value={thumbnail_size}
            onChange={(value: string) =>
              setAttributes({ thumbnail_size: value })
            }
            placeholder="thumbnail"
            help={__(
              "WordPress image size for thumbnail navigation",
              "wp-components",
            )}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/slider" attributes={attributes} />
    </BlockWrapper>
  );
}
