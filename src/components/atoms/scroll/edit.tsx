const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
interface Attributes {
  icon: string;
  target: string;
  className: string;
}

interface Props {
  attributes: Attributes;
  setAttributes: (attrs: Partial<Attributes>) => void;
}

function Edit({ attributes, setAttributes }: Props) {
  const { icon, target } = attributes;

  const blockProps = useBlockProps({
    className: "atom atom-scroll",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Scroll Settings", "wp-components")} initialOpen={true}>
          <TextControl
            label={__("Icon Class", "wp-components")}
            value={icon}
            onChange={(value: string) => setAttributes({ icon: value })}
            placeholder="fas fa-chevron-down"
            help={__("Font Awesome icon class", "wp-components")}
          />
          <TextControl
            label={__("Scroll Target", "wp-components")}
            value={target}
            onChange={(value: string) => setAttributes({ target: value })}
            placeholder="#section-id"
            help={__("CSS selector to scroll to (e.g., #section-id)", "wp-components")}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <a href={target || "#"} className="atom-scroll-link">
          <i className={icon || "fas fa-chevron-down"} />
        </a>
      </div>
    </>
  );
}

export default Edit;
