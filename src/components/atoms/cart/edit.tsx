/**
 * Cart Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface CartAttributes extends Partial<BaseAttributes> {
  cart: boolean;
  collapse: boolean;
  icon: boolean;
}

interface EditProps {
  attributes: CartAttributes;
  setAttributes: (attrs: Partial<CartAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { cart, collapse, icon } = attributes;

  return (
    <BlockWrapper className="atom-cart">
      <InspectorControls>
        <PanelBody
          title={__("Cart Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Show Cart Icon", "wp-components")}
            checked={icon}
            onChange={(value: boolean) => setAttributes({ icon: value })}
          />
          <ToggleControl
            label={__("Show Cart Content", "wp-components")}
            checked={cart}
            onChange={(value: boolean) => setAttributes({ cart: value })}
          />
          <ToggleControl
            label={__("Collapse by Default", "wp-components")}
            checked={collapse}
            onChange={(value: boolean) => setAttributes({ collapse: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/cart" attributes={attributes} />
    </BlockWrapper>
  );
}
