const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  title: string;
  tag: string;
  link: string;
  schema: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { title, tag, link, schema } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-title",
  });

  const TagName = tag as keyof JSX.IntrinsicElements;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Title Settings", "wp-components")} initialOpen={true}>
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
            onChange={(value) => setAttributes({ tag: value })}
          />
          <TextControl
            label={__("Link URL", "wp-components")}
            value={link}
            onChange={(value) => setAttributes({ link: value })}
            placeholder={__("https://example.com", "wp-components")}
            help={__("Leave empty for no link, or use 'post' for post permalink", "wp-components")}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          tagName={TagName}
          value={title}
          onChange={(value) => setAttributes({ title: value })}
          placeholder={__("Enter title...", "wp-components")}
          allowedFormats={["core/bold", "core/italic"]}
        />
      </div>
    </>
  );
}

export default Edit;
