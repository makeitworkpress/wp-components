/**
 * Copyright Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface CopyrightAttributes extends Partial<BaseAttributes> {
  copyright: string;
  date: string;
  name: string;
}

interface EditProps {
  attributes: CopyrightAttributes;
  setAttributes: (attrs: Partial<CopyrightAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { copyright, date, name } = attributes;

  return (
    <BlockWrapper className="atom-copyright">
      <InspectorControls>
        <PanelBody
          title={__("Copyright Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Copyright Symbol", "wp-components")}
            value={copyright}
            onChange={(value: string) => setAttributes({ copyright: value })}
          />
          <TextControl
            label={__("Year", "wp-components")}
            value={date}
            onChange={(value: string) => setAttributes({ date: value })}
            help={__("Leave empty for current year", "wp-components")}
          />
          <TextControl
            label={__("Name", "wp-components")}
            value={name}
            onChange={(value: string) => setAttributes({ name: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/copyright" attributes={attributes} />
    </BlockWrapper>
  );
}
