const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
interface Attributes { separator: string; showHome: boolean; homeLabel: string; schema: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { separator, showHome, homeLabel, schema } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-breadcrumbs" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Breadcrumbs Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Separator", "wp-components")} value={separator} onChange={(value: string) => setAttributes({ separator: value })} />
          <ToggleControl label={__("Show Home", "wp-components")} checked={showHome} onChange={(value: boolean) => setAttributes({ showHome: value })} />
          {showHome && <TextControl label={__("Home Label", "wp-components")} value={homeLabel} onChange={(value: string) => setAttributes({ homeLabel: value })} />}
          <ToggleControl label={__("Enable Schema", "wp-components")} checked={schema} onChange={(value: boolean) => setAttributes({ schema: value })} />
        </PanelBody>
      </InspectorControls>
      <nav {...blockProps}>
        <ol className="atom-breadcrumbs-list">
          {showHome && <li><a href="#">{homeLabel}</a></li>}
          <li><span className="separator">{separator}</span></li>
          <li><a href="#">{__("Category", "wp-components")}</a></li>
          <li><span className="separator">{separator}</span></li>
          <li><span>{__("Current Page", "wp-components")}</span></li>
        </ol>
      </nav>
    </>
  );
}

export default Edit;
