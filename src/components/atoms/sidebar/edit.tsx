const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, Button } = wp.components;
interface SidebarAttributes {
  sidebars: string[];
  className: string;
}

interface EditProps {
  attributes: SidebarAttributes;
  setAttributes: (attrs: Partial<SidebarAttributes>) => void;
}

function SidebarEdit({ attributes, setAttributes }: EditProps) {
  const { sidebars } = attributes;
  const blockProps = useBlockProps();

  const addSidebar = () => {
    setAttributes({ sidebars: [...sidebars, ""] });
  };

  const updateSidebar = (index: number, value: string) => {
    const newSidebars = [...sidebars];
    newSidebars[index] = value;
    setAttributes({ sidebars: newSidebars });
  };

  const removeSidebar = (index: number) => {
    const newSidebars = sidebars.filter((_, i) => i !== index);
    setAttributes({ sidebars: newSidebars });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Sidebar Settings", "wp-components")}>
          {sidebars.map((sidebar, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <TextControl
                label={`${__("Sidebar", "wp-components")} ${index + 1}`}
                value={sidebar}
                onChange={(value: string) => updateSidebar(index, value)}
              />
              <Button
                isDestructive
                onClick={() => removeSidebar(index)}
                style={{ alignSelf: "flex-end" }}
              >
                {__("Remove", "wp-components")}
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addSidebar}>
            {__("Add Sidebar", "wp-components")}
          </Button>
        </PanelBody>
      </InspectorControls>

      <aside {...blockProps}>
        <div className="wpc-sidebar-placeholder">
          {sidebars.length > 0 ? (
            sidebars.map((sidebar, index) => (
              <p key={index}>[{sidebar || __("Sidebar", "wp-components")}]</p>
            ))
          ) : (
            <p>{__("[No sidebars selected]", "wp-components")}</p>
          )}
        </div>
      </aside>
    </>
  );
}

export default SidebarEdit;
