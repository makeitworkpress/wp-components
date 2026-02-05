/**
 * Search Block Editor
 * Attributes match Search.php $atts
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

interface SearchAttributes extends Partial<BaseAttributes> {
  ajax: boolean;
  all: string;
  collapse: boolean;
  form: string;
  link: string;
  types: string[];
}

interface EditProps {
  attributes: SearchAttributes;
  setAttributes: (attrs: Partial<SearchAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { ajax, all, collapse } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Search Settings", "wp-components")}
          initialOpen={true}
        >
          <ToggleControl
            label={__("Enable AJAX Search", "wp-components")}
            checked={ajax}
            onChange={(value: boolean) => setAttributes({ ajax: value })}
            help={__("Show live search results as user types", "wp-components")}
          />
          <ToggleControl
            label={__("Collapsible", "wp-components")}
            checked={collapse}
            onChange={(value: boolean) => setAttributes({ collapse: value })}
            help={__(
              "Show only search icon that expands on click",
              "wp-components",
            )}
          />
          {ajax && (
            <TextControl
              label={__("View All Text", "wp-components")}
              value={all}
              onChange={(value: string) => setAttributes({ all: value })}
              placeholder={__("View all search results", "wp-components")}
            />
          )}
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/search" attributes={attributes} />
    </BlockWrapper>
  );
}
