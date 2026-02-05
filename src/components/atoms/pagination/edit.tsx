/**
 * Pagination Block Editor
 * Attributes match Pagination.php $atts
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, RangeControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface PaginationAttributes extends Partial<BaseAttributes> {
  format: string;
  next: string;
  pagination: string;
  prev: string;
  size: number;
  type: string;
}

interface EditProps {
  attributes: PaginationAttributes;
  setAttributes: (attrs: Partial<PaginationAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { format, next, prev, size, type } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Pagination Settings", "wp-components")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Type", "wp-components")}
            value={type}
            options={[
              { label: __("Numbers", "wp-components"), value: "numbers" },
              { label: __("Arrows", "wp-components"), value: "arrows" },
              { label: __("Post Navigation", "wp-components"), value: "post" },
            ]}
            onChange={(value: string) => setAttributes({ type: value })}
          />
          <TextControl
            label={__("Previous Text", "wp-components")}
            value={prev}
            onChange={(value: string) => setAttributes({ prev: value })}
            placeholder="‹"
          />
          <TextControl
            label={__("Next Text", "wp-components")}
            value={next}
            onChange={(value: string) => setAttributes({ next: value })}
            placeholder="›"
          />
          <RangeControl
            label={__("Pages to Show", "wp-components")}
            value={size}
            onChange={(value: number) => setAttributes({ size: value })}
            min={1}
            max={10}
          />
          <TextControl
            label={__("URL Format", "wp-components")}
            value={format}
            onChange={(value: string) => setAttributes({ format: value })}
            placeholder="/page/%#%"
            help={__("Use %#% as placeholder for page number", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/pagination" attributes={attributes} />
    </BlockWrapper>
  );
}
