/**
 * Tabs Block Editor
 * Attributes match Tabs.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface TabsAttributes extends Partial<BaseAttributes> {
  hover_item: string;
  position: string;
  tabs: Array<{ title: string; content: string; icon?: string }>;
}

interface EditProps {
  attributes: TabsAttributes;
  setAttributes: (attrs: Partial<TabsAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { hover_item, position } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Tabs Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Tab Position", "wp-components")}
            value={position}
            options={[
              { label: __("Top", "wp-components"), value: "top" },
              { label: __("Bottom", "wp-components"), value: "bottom" },
              { label: __("Left", "wp-components"), value: "left" },
              { label: __("Right", "wp-components"), value: "right" },
            ]}
            onChange={(value: string) => setAttributes({ position: value })}
          />
          <TextControl
            label={__("Hover Effect", "wp-components")}
            value={hover_item}
            onChange={(value: string) => setAttributes({ hover_item: value })}
            placeholder="underline-from-left"
            help={__(
              "Hover.css class name for tab navigation",
              "wp-components",
            )}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/tabs" attributes={attributes} />
    </BlockWrapper>
  );
}
