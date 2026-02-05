/**
 * Description Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, SelectControl, ToggleControl } = wp.components;

interface DescriptionAttributes extends Partial<BaseAttributes> {
  description: string;
  schema: boolean;
  tag: string;
}

interface EditProps {
  attributes: DescriptionAttributes;
  setAttributes: (attrs: Partial<DescriptionAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { description, schema, tag } = attributes;

  return (
    <BlockWrapper className="atom-description">
      <InspectorControls>
        <PanelBody
          title={__("Description Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("HTML Tag", "wp-components")}
            value={tag}
            options={[
              { label: "p", value: "p" },
              { label: "span", value: "span" },
              { label: "div", value: "div" },
            ]}
            onChange={(value: string) => setAttributes({ tag: value })}
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

      <RichText
        tagName={tag || "p"}
        value={description}
        onChange={(value: string) => setAttributes({ description: value })}
        placeholder={__("Enter description...", "wp-components")}
      />
    </BlockWrapper>
  );
}
