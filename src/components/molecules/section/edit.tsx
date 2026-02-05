/**
 * Section Molecule Editor
 * Attributes match Section.php $atts
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

interface SectionAttributes extends Partial<BaseAttributes> {
  atoms: Array<{ atom: string; properties: object }>;
  columns: Array<{ column: string; atoms?: any[]; molecules?: any[] }>;
  container: boolean;
  custom_action: string;
  grid: boolean;
  grid_gap: string;
  molecules: Array<{ molecule: string; properties: object }>;
  tag: string;
  scroll: boolean;
  video: string;
}

interface EditProps {
  attributes: SectionAttributes;
  setAttributes: (attrs: Partial<SectionAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { container, custom_action, grid, grid_gap, tag, scroll, video } =
    attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Section Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("HTML Tag", "wp-components")}
            value={tag}
            options={[
              { label: "section", value: "section" },
              { label: "header", value: "header" },
              { label: "footer", value: "footer" },
              { label: "main", value: "main" },
              { label: "div", value: "div" },
            ]}
            onChange={(value: string) => setAttributes({ tag: value })}
          />
          <ToggleControl
            label={__("Use Container", "wp-components")}
            checked={container}
            onChange={(value: boolean) => setAttributes({ container: value })}
          />
          <ToggleControl
            label={__("Enable Grid", "wp-components")}
            checked={grid}
            onChange={(value: boolean) => setAttributes({ grid: value })}
          />
          {grid && (
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
          )}
        </PanelBody>

        <PanelBody
          title={__("Additional Options", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Show Scroll Button", "wp-components")}
            checked={scroll}
            onChange={(value: boolean) => setAttributes({ scroll: value })}
          />
          <TextControl
            label={__("Custom Action Hook", "wp-components")}
            value={custom_action}
            onChange={(value: string) =>
              setAttributes({ custom_action: value })
            }
            help={__("Add custom WordPress action hooks", "wp-components")}
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

      <ServerSideRender block="wpc/section" attributes={attributes} />
    </BlockWrapper>
  );
}
