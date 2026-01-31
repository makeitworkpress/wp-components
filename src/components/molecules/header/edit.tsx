const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Button, Placeholder, ColorPicker } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;
interface Attributes { fixed: boolean; transparent: boolean; shrink: boolean; headroom: boolean; container: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
const ALLOWED_BLOCKS = ["wpc/logo", "wpc/menu", "wpc/search", "wpc/cart", "wpc/social", "wpc/button", "core/group", "core/columns"];

function Edit({ attributes, setAttributes }: Props) {
  const { fixed, transparent, shrink, headroom, container } = attributes;
  const blockProps = useBlockProps({
    className: `molecule molecule-header ${fixed ? "molecule-header-fixed" : ""} ${transparent ? "molecule-header-transparent" : ""} ${shrink ? "molecule-header-shrink" : ""} ${headroom ? "molecule-header-headroom" : ""}`.trim(),
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Header Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Fixed Header", "wp-components")} checked={fixed} onChange={(value) => setAttributes({ fixed: value })} help={__("Header stays at top when scrolling", "wp-components")} />
          <ToggleControl label={__("Transparent", "wp-components")} checked={transparent} onChange={(value) => setAttributes({ transparent: value })} />
          <ToggleControl label={__("Shrink on Scroll", "wp-components")} checked={shrink} onChange={(value) => setAttributes({ shrink: value })} />
          <ToggleControl label={__("Headroom Effect", "wp-components")} checked={headroom} onChange={(value) => setAttributes({ headroom: value })} help={__("Hide header on scroll down, show on scroll up", "wp-components")} />
          <ToggleControl label={__("Use Container", "wp-components")} checked={container} onChange={(value) => setAttributes({ container: value })} />
        </PanelBody>
      </InspectorControls>
      <header {...blockProps}>
        <div className={container ? "components-container" : ""}>
          <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={[["wpc/logo"], ["wpc/menu"]]} templateLock={false} />
        </div>
      </header>
    </>
  );
}

export default Edit;
