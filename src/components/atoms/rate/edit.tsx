/**
 * Rate Block Editor
 * Attributes match Rate.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RangeControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface RateAttributes extends Partial<BaseAttributes> {
  author: string;
  author_type: string;
  count: number;
  id: number;
  max: number;
  min: number;
  rate: boolean;
  reviewed: string;
  schema: boolean;
  value: number;
}

interface EditProps {
  attributes: RateAttributes;
  setAttributes: (attrs: Partial<RateAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { author, author_type, max, min, rate, reviewed, schema, value } =
    attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Rating Settings", "wp-components")}
          initialOpen={true}
        >
          <RangeControl
            label={__("Maximum Stars", "wp-components")}
            value={max}
            onChange={(value: number) => setAttributes({ max: value })}
            min={1}
            max={10}
          />
          <RangeControl
            label={__("Minimum Rating", "wp-components")}
            value={min}
            onChange={(value: number) => setAttributes({ min: value })}
            min={0}
            max={5}
          />
          <RangeControl
            label={__("Initial Value", "wp-components")}
            value={value}
            onChange={(val: number) => setAttributes({ value: val })}
            min={0}
            max={max || 5}
            step={0.5}
          />
          <ToggleControl
            label={__("Allow Voting", "wp-components")}
            checked={rate}
            onChange={(value: boolean) => setAttributes({ rate: value })}
            help={__("Enable user ratings", "wp-components")}
          />
        </PanelBody>

        <PanelBody
          title={__("Schema Settings", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Enable Schema.org Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
          {schema && (
            <>
              <TextControl
                label={__("Author Name", "wp-components")}
                value={author}
                onChange={(value: string) => setAttributes({ author: value })}
              />
              <TextControl
                label={__("Author Type", "wp-components")}
                value={author_type}
                onChange={(value: string) =>
                  setAttributes({ author_type: value })
                }
                placeholder="http://schema.org/Person"
              />
              <TextControl
                label={__("Item Reviewed", "wp-components")}
                value={reviewed}
                onChange={(value: string) => setAttributes({ reviewed: value })}
              />
            </>
          )}
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/rate" attributes={attributes} />
    </BlockWrapper>
  );
}
