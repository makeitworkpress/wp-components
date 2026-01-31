const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
interface TypeAttributes {
  name: string;
  type: string;
  className: string;
}

interface EditProps {
  attributes: TypeAttributes;
  setAttributes: (attrs: Partial<TypeAttributes>) => void;
}

function TypeEdit({ attributes, setAttributes }: EditProps) {
  const { name, type } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Post Type Settings", "wp-components")}>
          <TextControl
            label={__("Post Type", "wp-components")}
            help={__("Leave empty to use current post type", "wp-components")}
            value={type}
            onChange={(value: string) => setAttributes({ type: value })}
          />
          <TextControl
            label={__("Custom Label", "wp-components")}
            help={__("Leave empty to use post type label", "wp-components")}
            value={name}
            onChange={(value: string) => setAttributes({ name: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {name || type || __("[Post Type]", "wp-components")}
      </div>
    </>
  );
}

export default TypeEdit;
