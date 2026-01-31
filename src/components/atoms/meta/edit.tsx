const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface MetaAttributes {
  key: string;
  before: string;
  after: string;
  className: string;
}

interface EditProps {
  attributes: MetaAttributes;
  setAttributes: (attrs: Partial<MetaAttributes>) => void;
}

function MetaEdit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { key, before, after } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Meta Settings", "wp-components")}>
          <TextControl
            label={__("Meta Key", "wp-components")}
            help={__("The post meta key to retrieve", "wp-components")}
            value={key}
            onChange={(value: string) => setAttributes({ key: value })}
          />
          <TextControl
            label={__("Before Text", "wp-components")}
            value={before}
            onChange={(value: string) => setAttributes({ before: value })}
          />
          <TextControl
            label={__("After Text", "wp-components")}
            value={after}
            onChange={(value: string) => setAttributes({ after: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <span className="wpc-meta-placeholder">
          {before}
          {key ? `[${key}]` : __("[Meta Key]", "wp-components")}
          {after}
        </span>
      </div>
    </>
  );
}

export default MetaEdit;
