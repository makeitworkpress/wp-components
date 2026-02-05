/**
 * Footer Molecule Editor
 * Attributes match Footer.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface FooterAttributes extends Partial<BaseAttributes> {
  atoms: Array<{ atom: string; properties: object }>;
  container: boolean;
  grid_gap: string;
  sidebars: object;
  video: string;
}

interface EditProps {
  attributes: FooterAttributes;
  setAttributes: (attrs: Partial<FooterAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { container, grid_gap, video } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Footer Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Use Container", "wp-components")}
            checked={container}
            onChange={(value: boolean) => setAttributes({ container: value })}
          />
          <SelectControl
            label={__("Grid Gap", "wp-components")}
            value={grid_gap}
            options={[
              { label: __("Default", "wp-components"), value: "default" },
              { label: __("None", "wp-components"), value: "none" },
              { label: __("Small", "wp-components"), value: "small" },
              { label: __("Large", "wp-components"), value: "large" },
            ]}
            onChange={(value: string) => setAttributes({ grid_gap: value })}
          />
          <TextControl
            label={__("Background Video URL", "wp-components")}
            value={video}
            onChange={(value: string) => setAttributes({ video: value })}
            placeholder="https://example.com/video.mp4"
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/footer" attributes={attributes} />
    </BlockWrapper>
  );
}
