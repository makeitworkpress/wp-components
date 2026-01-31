/**
 * WPC Description Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  SelectControl,
  ToggleControl,
} from "@wordpress/components";

interface DescriptionAttributes {
  description: string;
  tag: string;
  schema: boolean;
  className: string;
}

interface EditProps {
  attributes: DescriptionAttributes;
  setAttributes: (attrs: Partial<DescriptionAttributes>) => void;
}

function DescriptionEdit({ attributes, setAttributes }: EditProps): JSX.Element {
  const { description, tag, schema } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Description Settings", "wp-components")}>
          <SelectControl
            label={__("HTML Tag", "wp-components")}
            value={tag}
            options={[
              { label: "p", value: "p" },
              { label: "span", value: "span" },
              { label: "div", value: "div" },
              { label: "h2", value: "h2" },
              { label: "h3", value: "h3" },
              { label: "h4", value: "h4" },
              { label: "h5", value: "h5" },
              { label: "h6", value: "h6" },
            ]}
            onChange={(value: string) => setAttributes({ tag: value })}
          />
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          tagName={tag}
          value={description}
          onChange={(value: string) => setAttributes({ description: value })}
          placeholder={__("Enter description...", "wp-components")}
        />
      </div>
    </>
  );
}

export default DescriptionEdit;
