const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes { container: boolean; columns: number; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { container, columns } = attributes;
  const blockProps = useBlockProps({ className: "molecule molecule-footer" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Footer Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Use Container", "wp-components")} checked={container} onChange={(value) => setAttributes({ container: value })} />
          <RangeControl label={__("Columns", "wp-components")} value={columns} onChange={(value) => setAttributes({ columns: value || 4 })} min={1} max={6} />
        </PanelBody>
      </InspectorControls>
      <footer {...blockProps}>
        <div className={container ? "components-container" : ""}>
          <InnerBlocks template={[["core/columns"]]} templateLock={false} />
        </div>
      </footer>
    </>
  );
}

export default Edit;
