/**
 * Sidebar Block Editor
 * Attributes match Sidebar.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, Button } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface SidebarAttributes extends Partial<BaseAttributes> {
  sidebars: string[];
}

interface EditProps {
  attributes: SidebarAttributes;
  setAttributes: (attrs: Partial<SidebarAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { sidebars = [] } = attributes;

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
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Sidebar Settings", "wp-components")}
          initialOpen={true}
        >
          {sidebars.map((sidebar: string, index: number) => (
            <div
              key={index}
              style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
            >
              <TextControl
                label={`${__("Sidebar ID", "wp-components")} ${index + 1}`}
                value={sidebar}
                onChange={(value: string) => updateSidebar(index, value)}
                placeholder="sidebar-1"
              />
              <Button
                isDestructive
                onClick={() => removeSidebar(index)}
                style={{ alignSelf: "flex-end" }}
              >
                ×
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addSidebar}>
            {__("Add Sidebar", "wp-components")}
          </Button>
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/sidebar" attributes={attributes} />
    </BlockWrapper>
  );
}
