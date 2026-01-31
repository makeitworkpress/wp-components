/**
 * WPC Date Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  ToggleControl,
} from "@wordpress/components";

interface DateAttributes {
  date: string;
  icon: string;
  schema: boolean;
  className: string;
}

interface EditProps {
  attributes: DateAttributes;
  setAttributes: (attrs: Partial<DateAttributes>) => void;
}

function DateEdit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { date, icon, schema } = attributes;
  const blockProps = useBlockProps();

  const displayDate = date || new Date().toLocaleDateString();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Date Settings", "wp-components")}>
          <TextControl
            label={__("Custom Date", "wp-components")}
            help={__("Leave empty to use post date", "wp-components")}
            value={date}
            onChange={(value: string) => setAttributes({ date: value })}
          />
          <TextControl
            label={__("Icon Class", "wp-components")}
            help={__("e.g., fa fa-calendar", "wp-components")}
            value={icon}
            onChange={(value: string) => setAttributes({ icon: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <time>
          {icon && <i className={`${icon} hvr-icon`}></i>}
          {displayDate}
        </time>
      </div>
    </>
  );
}

export default DateEdit;
