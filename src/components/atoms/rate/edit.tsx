const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes {
  max: number;
  allowVote: boolean;
  showCount: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { max, allowVote, showCount } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-rate",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Rating Settings", "wp-components")} initialOpen={true}>
          <RangeControl
            label={__("Maximum Stars", "wp-components")}
            value={max}
            onChange={(value) => setAttributes({ max: value || 5 })}
            min={1}
            max={10}
          />
          <ToggleControl
            label={__("Allow Voting", "wp-components")}
            checked={allowVote}
            onChange={(value) => setAttributes({ allowVote: value })}
          />
          <ToggleControl
            label={__("Show Vote Count", "wp-components")}
            checked={showCount}
            onChange={(value) => setAttributes({ showCount: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="atom-rate-stars">
          {Array.from({ length: max }, (_, i) => (
            <i key={i} className="fas fa-star" style={{ color: i < 3 ? "#ffc107" : "#e0e0e0" }} />
          ))}
        </div>
        {showCount && <span className="atom-rate-count">(0 {__("votes", "wp-components")})</span>}
      </div>
    </>
  );
}

export default Edit;
