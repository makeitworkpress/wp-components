/**
 * WPC Copyright Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  SelectControl,
} from "@wordpress/components";

// Import block.json metadata

interface CopyrightAttributes {
  copyright: string;
  date: string;
  name: string;
  itemtype: string;
  className: string;
}

interface EditProps {
  attributes: CopyrightAttributes;
  setAttributes: (attrs: Partial<CopyrightAttributes>) => void;
}

function CopyrightEdit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { copyright, date, name, itemtype } = attributes;
  const blockProps = useBlockProps();

  const currentYear = new Date().getFullYear().toString();
  const displayDate = date || currentYear;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Copyright Settings", "wp-components")}>
          <TextControl
            label={__("Copyright Symbol", "wp-components")}
            value={copyright}
            onChange={(value: string) => setAttributes({ copyright: value })}
          />
          <TextControl
            label={__("Year", "wp-components")}
            help={__("Leave empty for current year", "wp-components")}
            value={date}
            onChange={(value: string) => setAttributes({ date: value })}
          />
          <TextControl
            label={__("Organization/Person Name", "wp-components")}
            value={name}
            onChange={(value: string) => setAttributes({ name: value })}
          />
          <SelectControl
            label={__("Schema Type", "wp-components")}
            value={itemtype}
            options={[
              {
                label: __("Organization", "wp-components"),
                value: "http://schema.org/Organization",
              },
              {
                label: __("Person", "wp-components"),
                value: "http://schema.org/Person",
              },
            ]}
            onChange={(value: string) => setAttributes({ itemtype: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <span>{copyright}</span> <span>{displayDate}</span>{" "}
        <span>{name || __("[Organization Name]", "wp-components")}</span>
      </div>
    </>
  );
}

export default CopyrightEdit;
