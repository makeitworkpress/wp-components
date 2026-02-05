/**
 * Date Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface DateAttributes extends Partial<BaseAttributes> {
  date: string;
  icon: string;
  schema: boolean;
}

interface EditProps {
  attributes: DateAttributes;
  setAttributes: (attrs: Partial<DateAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { date, icon, schema } = attributes;

  return (
    <BlockWrapper className="atom-date">
      <InspectorControls>
        <PanelBody
          title={__("Date Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Custom Date", "wp-components")}
            value={date}
            onChange={(value: string) => setAttributes({ date: value })}
            help={__("Leave empty for post date", "wp-components")}
          />
          <TextControl
            label={__("Icon", "wp-components")}
            value={icon}
            onChange={(value: string) => setAttributes({ icon: value })}
            placeholder="fas fa-calendar"
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/date" attributes={attributes} />
    </BlockWrapper>
  );
}
