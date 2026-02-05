/**
 * Comments Block Editor
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

interface CommentsAttributes extends Partial<BaseAttributes> {
  closed_text: string;
  form: boolean;
  pagination: boolean;
  seperate: boolean;
  title: string;
}

interface EditProps {
  attributes: CommentsAttributes;
  setAttributes: (attrs: Partial<CommentsAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const { closed_text, form, pagination, seperate, title } = attributes;

  return (
    <BlockWrapper className="atom-comments">
      <InspectorControls>
        <PanelBody
          title={__("Comments Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Title", "wp-components")}
            value={title}
            onChange={(value: string) => setAttributes({ title: value })}
          />
          <TextControl
            label={__("Closed Text", "wp-components")}
            value={closed_text}
            onChange={(value: string) => setAttributes({ closed_text: value })}
          />
          <ToggleControl
            label={__("Show Comment Form", "wp-components")}
            checked={form}
            onChange={(value: boolean) => setAttributes({ form: value })}
          />
          <ToggleControl
            label={__("Show Pagination", "wp-components")}
            checked={pagination}
            onChange={(value: boolean) => setAttributes({ pagination: value })}
          />
          <ToggleControl
            label={__("Separate by Type", "wp-components")}
            checked={seperate}
            onChange={(value: boolean) => setAttributes({ seperate: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/comments" attributes={attributes} />
    </BlockWrapper>
  );
}
