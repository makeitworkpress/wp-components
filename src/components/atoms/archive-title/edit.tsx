/**
 * Archive Title Block Editor
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

interface ArchiveTitleAttributes extends Partial<BaseAttributes> {
  custom: string;
}

interface EditProps {
  attributes: ArchiveTitleAttributes;
  setAttributes: (attrs: Partial<ArchiveTitleAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { custom } = attributes;

  return (
    <BlockWrapper className="atom-archive-title">
      <InspectorControls>
        <PanelBody
          title={__("Archive Title Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Custom Title", "wp-components")}
            value={custom}
            onChange={(value: string) => setAttributes({ custom: value })}
            help={__("Override the automatic archive title", "wp-components")}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/archive-title" attributes={attributes} />
    </BlockWrapper>
  );
}
