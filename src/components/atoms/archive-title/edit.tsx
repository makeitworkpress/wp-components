const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
interface ArchiveTitleAttributes {
  custom: string;
  className: string;
}

interface EditProps {
  attributes: ArchiveTitleAttributes;
  setAttributes: (attrs: Partial<ArchiveTitleAttributes>) => void;
}

function ArchiveTitleEdit({ attributes, setAttributes }: EditProps) {
  const { custom } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Archive Title Settings", "wp-components")}>
          <TextControl
            label={__("Custom Title", "wp-components")}
            help={__("Leave empty to use automatic archive title", "wp-components")}
            value={custom}
            onChange={(value: string) => setAttributes({ custom: value })}
          />
        </PanelBody>
      </InspectorControls>

      <h1 {...blockProps}>
        {custom || __("[Archive Title]", "wp-components")}
      </h1>
    </>
  );
}

export default ArchiveTitleEdit;
