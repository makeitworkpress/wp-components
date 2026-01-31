/**
 * WPC Footer Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, InnerBlocks } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, RangeControl } from "@wordpress/components";

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
