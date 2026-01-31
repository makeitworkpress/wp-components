const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, InnerBlocks } = wp.blockEditor;
const { PanelBody, ToggleControl, RangeControl } = wp.components;
interface Attributes { container: boolean; columns: number; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { container, columns } = attributes;
  const blockProps = useBlockProps({ className: "molecule molecule-footer" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Footer Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Use Container", "wp-components")} checked={container} onChange={(value: boolean) => setAttributes({ container: value })} />
          <RangeControl label={__("Columns", "wp-components")} value={columns} onChange={(value: number) => setAttributes({ columns: value || 4 })} min={1} max={6} />
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
