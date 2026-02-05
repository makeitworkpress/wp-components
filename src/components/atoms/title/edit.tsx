/**
 * Title Block Editor
 * Attributes match Title.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl } = wp.components;

interface TitleAttributes extends Partial<BaseAttributes> {
  link: string;
  schema: boolean;
  tag: string;
  title: string;
}

interface EditProps {
  attributes: TitleAttributes;
  setAttributes: (attrs: Partial<TitleAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { link, schema, tag, title } = attributes;

  const TagName = (tag || "h1") as keyof JSX.IntrinsicElements;

  return (
    <BlockWrapper className="atom-title">
      <InspectorControls>
        <PanelBody
          title={__("Title Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Heading Level", "wp-components")}
            value={tag}
            options={[
              { label: "H1", value: "h1" },
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ]}
            onChange={(value: string) => setAttributes({ tag: value })}
          />
          <TextControl
            label={__("Link URL", "wp-components")}
            value={link}
            onChange={(value: string) => setAttributes({ link: value })}
            placeholder={__("https://example.com", "wp-components")}
            help={__(
              "Leave empty for no link, or use 'post' for post permalink",
              "wp-components",
            )}
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
        tagName={TagName}
        value={title}
        onChange={(value: string) => setAttributes({ title: value })}
        placeholder={__("Enter title...", "wp-components")}
        allowedFormats={["core/bold", "core/italic"]}
      />
    </BlockWrapper>
  );
}
