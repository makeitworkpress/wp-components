const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
interface Attributes {
  icon: string;
  showCount: boolean;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { icon, showCount } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-cart",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Cart Settings", "wp-components")} initialOpen={true}>
          <TextControl
            label={__("Icon Class", "wp-components")}
            value={icon}
            onChange={(value: string) => setAttributes({ icon: value })}
            placeholder="fas fa-shopping-cart"
          />
          <ToggleControl
            label={__("Show Item Count", "wp-components")}
            checked={showCount}
            onChange={(value: boolean) => setAttributes({ showCount: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <a href="#" className="atom-cart-link">
          <i className={icon || "fas fa-shopping-cart"} />
          {showCount && <span className="atom-cart-count">0</span>}
        </a>
      </div>
    </>
  );
}

export default Edit;
