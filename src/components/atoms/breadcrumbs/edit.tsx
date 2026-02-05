/**
 * Breadcrumbs Block Editor
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

interface BreadcrumbsAttributes extends Partial<BaseAttributes> {
  archive: boolean;
  home: string;
  seperator: string;
  taxonomy: string;
}

interface EditProps {
  attributes: BreadcrumbsAttributes;
  setAttributes: (attrs: Partial<BreadcrumbsAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { archive, home, seperator, taxonomy } = attributes;

  return (
    <BlockWrapper className="atom-breadcrumbs">
      <InspectorControls>
        <PanelBody
          title={__("Breadcrumbs Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Home Text", "wp-components")}
            value={home}
            onChange={(value: string) => setAttributes({ home: value })}
          />
          <TextControl
            label={__("Separator", "wp-components")}
            value={seperator}
            onChange={(value: string) => setAttributes({ seperator: value })}
          />
          <TextControl
            label={__("Taxonomy", "wp-components")}
            value={taxonomy}
            onChange={(value: string) => setAttributes({ taxonomy: value })}
            help={__("Show taxonomy in breadcrumbs", "wp-components")}
          />
          <ToggleControl
            label={__("Show Archive Link", "wp-components")}
            checked={archive}
            onChange={(value: boolean) => setAttributes({ archive: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/breadcrumbs" attributes={attributes} />
    </BlockWrapper>
  );
}
