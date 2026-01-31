const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
interface TermlistAttributes {
  schema: boolean;
  className: string;
}

interface EditProps {
  attributes: TermlistAttributes;
  setAttributes: (attrs: Partial<TermlistAttributes>) => void;
}

function TermlistEdit({ attributes, setAttributes }: EditProps) {
  const { schema } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Term List Settings", "wp-components")}>
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="wpc-termlist-placeholder">
          <span className="wpc-termlist-item">
            <i className="fas fa-folder"></i> {__("[Categories]", "wp-components")}
          </span>
          <span className="wpc-termlist-item">
            <i className="fas fa-tag"></i> {__("[Tags]", "wp-components")}
          </span>
        </div>
      </div>
    </>
  );
}

export default TermlistEdit;
