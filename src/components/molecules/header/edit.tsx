/**
 * Header Molecule Editor
 * Attributes match Header.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, TextControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface HeaderAttributes extends Partial<BaseAttributes> {
  atoms: Array<{ atom: string; properties: object }>;
  container: boolean;
  fixed: boolean;
  headroom: boolean;
  shrink: boolean;
  socket_atoms: Array<{ atom: string; properties: object }>;
  transparent: boolean;
  top_atoms: Array<{ atom: string; properties: object }>;
  video: string;
}

interface EditProps {
  attributes: HeaderAttributes;
  setAttributes: (attrs: Partial<HeaderAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { container, fixed, headroom, shrink, transparent, video } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Header Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Use Container", "wp-components")}
            checked={container}
            onChange={(value: boolean) => setAttributes({ container: value })}
          />
          <ToggleControl
            label={__("Fixed Position", "wp-components")}
            checked={fixed}
            onChange={(value: boolean) => setAttributes({ fixed: value })}
            help={__("Fix header to top of screen", "wp-components")}
          />
          <ToggleControl
            label={__("Transparent", "wp-components")}
            checked={transparent}
            onChange={(value: boolean) => setAttributes({ transparent: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Scroll Effects", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Headroom Effect", "wp-components")}
            checked={headroom}
            onChange={(value: boolean) => setAttributes({ headroom: value })}
            help={__(
              "Hide header on scroll down, show on scroll up",
              "wp-components",
            )}
          />
          <ToggleControl
            label={__("Shrink on Scroll", "wp-components")}
            checked={shrink}
            onChange={(value: boolean) => setAttributes({ shrink: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Background", "wp-components")}
          initialOpen={false}
        >
          <TextControl
            label={__("Video URL", "wp-components")}
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

      <ServerSideRender block="wpc/header" attributes={attributes} />
    </BlockWrapper>
  );
}
