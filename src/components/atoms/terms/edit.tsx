/**
 * Terms Block Editor
 * Attributes match Terms.php $atts
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

interface TermsAttributes extends Partial<BaseAttributes> {
  after: string;
  args: { taxonomy: string };
  before: string;
  hover_item: string;
  seperator: string;
  terms: any[];
  term_style: string;
}

interface EditProps {
  attributes: TermsAttributes;
  setAttributes: (attrs: Partial<TermsAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const {
    after,
    args = { taxonomy: "post_tag" },
    before,
    hover_item,
    seperator,
    term_style,
  } = attributes;

  const updateArgs = (key: string, value: string) => {
    setAttributes({
      args: {
        ...args,
        [key]: value,
      },
    });
  };

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Terms Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Taxonomy", "wp-components")}
            value={args.taxonomy}
            onChange={(value: string) => updateArgs("taxonomy", value)}
            placeholder="post_tag"
            help={__(
              "e.g., category, post_tag, or custom taxonomy",
              "wp-components",
            )}
          />
          <SelectControl
            label={__("Term Style", "wp-components")}
            value={term_style}
            options={[
              { label: __("Normal", "wp-components"), value: "normal" },
              { label: __("Button", "wp-components"), value: "button" },
            ]}
            onChange={(value: string) => setAttributes({ term_style: value })}
          />
          <TextControl
            label={__("Separator", "wp-components")}
            value={seperator}
            onChange={(value: string) => setAttributes({ seperator: value })}
            placeholder="/"
          />
          <TextControl
            label={__("Before", "wp-components")}
            value={before}
            onChange={(value: string) => setAttributes({ before: value })}
            placeholder=""
          />
          <TextControl
            label={__("After", "wp-components")}
            value={after}
            onChange={(value: string) => setAttributes({ after: value })}
            placeholder=""
          />
          <TextControl
            label={__("Hover Effect", "wp-components")}
            value={hover_item}
            onChange={(value: string) => setAttributes({ hover_item: value })}
            placeholder="grow"
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/terms" attributes={attributes} />
    </BlockWrapper>
  );
}
