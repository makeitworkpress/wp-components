/**
 * List Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ListAttributes extends Partial<BaseAttributes> {
  grid: boolean;
  grid_gap: string;
  hover_item: string;
  style: string;
  title_tag: string;
}

interface EditProps {
  attributes: ListAttributes;
  setAttributes: (attrs: Partial<ListAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { grid, grid_gap, hover_item, style, title_tag } = attributes;

  return (
    <BlockWrapper className="atom-list">
      <InspectorControls>
        <PanelBody
          title={__("List Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Style", "wp-components")}
            value={style}
            options={[
              { label: __("Default", "wp-components"), value: "default" },
              { label: __("Card", "wp-components"), value: "card" },
            ]}
            onChange={(value: string) => setAttributes({ style: value })}
          />
          <SelectControl
            label={__("Title Tag", "wp-components")}
            value={title_tag}
            options={[
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ]}
            onChange={(value: string) => setAttributes({ title_tag: value })}
          />
          <ToggleControl
            label={__("Display as Grid", "wp-components")}
            checked={grid}
            onChange={(value: boolean) => setAttributes({ grid: value })}
          />
          {grid && (
            <SelectControl
              label={__("Grid Gap", "wp-components")}
              value={grid_gap}
              options={[
                { label: __("Default", "wp-components"), value: "default" },
                { label: __("Small", "wp-components"), value: "small" },
                { label: __("Large", "wp-components"), value: "large" },
              ]}
              onChange={(value: string) => setAttributes({ grid_gap: value })}
            />
          )}
          <TextControl
            label={__("Hover Effect", "wp-components")}
            value={hover_item}
            onChange={(value: string) => setAttributes({ hover_item: value })}
            help={__("hover.css class name", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/list" attributes={attributes} />
    </BlockWrapper>
  );
}
