const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl, Button } = wp.components;
interface Attributes { items: string[]; icon: string; ordered: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { items, icon, ordered } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-list" });
  const ListTag = ordered ? "ol" : "ul";

  const addItem = () => setAttributes({ items: [...items, ""] });
  const removeItem = (index: number) => setAttributes({ items: items.filter((_, i) => i !== index) });
  const updateItem = (index: number, value: string) => setAttributes({ items: items.map((item, i) => i === index ? value : item) });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("List Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Ordered List", "wp-components")} checked={ordered} onChange={(value: boolean) => setAttributes({ ordered: value })} />
          <TextControl label={__("Icon Class", "wp-components")} value={icon} onChange={(value: string) => setAttributes({ icon: value })} placeholder="fas fa-check" help={__("Font Awesome icon for list items", "wp-components")} />
        </PanelBody>
      </InspectorControls>
      <ListTag {...blockProps}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {icon && <i className={icon} />}
            <RichText tagName="span" value={item} onChange={(value: string) => updateItem(i, value)} placeholder={__("List item...", "wp-components")} />
            <Button icon="no-alt" isSmall onClick={() => removeItem(i)} />
          </li>
        ))}
        <li><Button variant="secondary" onClick={addItem} icon="plus">{__("Add Item", "wp-components")}</Button></li>
      </ListTag>
    </>
  );
}

export default Edit;
