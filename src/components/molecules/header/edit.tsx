const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, InnerBlocks } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
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
          <ToggleControl label={__("Fixed Header", "wp-components")} checked={fixed} onChange={(value: boolean) => setAttributes({ fixed: value })} help={__("Header stays at top when scrolling", "wp-components")} />
          <ToggleControl label={__("Transparent", "wp-components")} checked={transparent} onChange={(value: boolean) => setAttributes({ transparent: value })} />
          <ToggleControl label={__("Shrink on Scroll", "wp-components")} checked={shrink} onChange={(value: boolean) => setAttributes({ shrink: value })} />
          <ToggleControl label={__("Headroom Effect", "wp-components")} checked={headroom} onChange={(value: boolean) => setAttributes({ headroom: value })} help={__("Hide header on scroll down, show on scroll up", "wp-components")} />
          <ToggleControl label={__("Use Container", "wp-components")} checked={container} onChange={(value: boolean) => setAttributes({ container: value })} />
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
