const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
interface Attributes { taxonomy: string; separator: string; link: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { taxonomy, separator, link } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-terms" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Terms Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Taxonomy", "wp-components")} value={taxonomy} onChange={(value: string) => setAttributes({ taxonomy: value })} help={__("e.g., category, post_tag", "wp-components")} />
          <TextControl label={__("Separator", "wp-components")} value={separator} onChange={(value: string) => setAttributes({ separator: value })} />
          <ToggleControl label={__("Link Terms", "wp-components")} checked={link} onChange={(value: boolean) => setAttributes({ link: value })} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <span className="atom-terms-preview">
          {link ? <a href="#">Term 1</a> : "Term 1"}{separator}
          {link ? <a href="#">Term 2</a> : "Term 2"}{separator}
          {link ? <a href="#">Term 3</a> : "Term 3"}
        </span>
      </div>
    </>
  );
}

export default Edit;
