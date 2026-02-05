/**
 * Content Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface ContentAttributes extends Partial<BaseAttributes> {
  content: string;
  schema: boolean;
  type: string;
}

interface EditProps {
  attributes: ContentAttributes;
  setAttributes: (attrs: Partial<ContentAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { schema, type } = attributes;

  return (
    <BlockWrapper className="atom-content">
      <InspectorControls>
        <PanelBody
          title={__("Content Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Content Type", "wp-components")}
            value={type}
            options={[
              { label: __("Full Content", "wp-components"), value: "content" },
              { label: __("Excerpt", "wp-components"), value: "excerpt" },
            ]}
            onChange={(value: string) => setAttributes({ type: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/content" attributes={attributes} />
    </BlockWrapper>
  );
}
