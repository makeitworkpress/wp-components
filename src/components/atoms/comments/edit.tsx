/**
 * WPC Comments Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, Placeholder } from "@wordpress/components";

interface Attributes { showForm: boolean; showAvatar: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }

function Edit({ attributes, setAttributes }: Props) {
  const { showForm, showAvatar } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-comments" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Comments Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Show Comment Form", "wp-components")} checked={showForm} onChange={(value) => setAttributes({ showForm: value })} />
          <ToggleControl label={__("Show Avatars", "wp-components")} checked={showAvatar} onChange={(value) => setAttributes({ showAvatar: value })} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <Placeholder icon="admin-comments" label={__("WPC Comments", "wp-components")} instructions={__("Comments will be displayed here on the frontend", "wp-components")} />
      </div>
    </>
  );
}

export default Edit;
