const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
  TextareaControl,
// Import block.json metadata

interface ContentAttributes {
  type: "content" | "excerpt";
  content: string;
  schema: boolean;
  className: string;
}

interface EditProps {
  attributes: ContentAttributes;
  setAttributes: (attrs: Partial<ContentAttributes>) => void;
}

function ContentEdit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { type, content, schema } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Content Settings", "wp-components")}>
          <SelectControl
            label={__("Content Type", "wp-components")}
            value={type}
            options={[
              { label: __("Full Content", "wp-components"), value: "content" },
              { label: __("Excerpt", "wp-components"), value: "excerpt" },
            ]}
            onChange={(value: string) =>
              setAttributes({ type: value as "content" | "excerpt" })
            }
          />
          <TextareaControl
            label={__("Custom Content", "wp-components")}
            help={__(
              "Leave empty to use post content/excerpt",
              "wp-components"
            )}
            value={content}
            onChange={(value: string) => setAttributes({ content: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="wpc-content-placeholder">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="wpc-placeholder-text">
              {type === "excerpt"
                ? __("[Post Excerpt]", "wp-components")
                : __("[Post Content]", "wp-components")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ContentEdit;
