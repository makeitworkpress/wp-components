/**
 * Author Block Editor
 */
import {
  BaseAttributesPanel,
  BaseAttributes,
  BlockWrapper,
} from "@scripts/editor";

const wp = (window as any).wp;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl } = wp.components;
const ServerSideRender = wp.serverSideRender;

interface AuthorAttributes extends Partial<BaseAttributes> {
  description: string;
  image_float: string;
  image_rounded: boolean;
  job_title: string;
  name: string;
  prepend: string;
  schema: boolean;
}

interface EditProps {
  attributes: AuthorAttributes;
  setAttributes: (attrs: Partial<AuthorAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const {
    description,
    image_float,
    image_rounded,
    job_title,
    name,
    prepend,
    schema,
  } = attributes;

  return (
    <BlockWrapper className="atom-author">
      <InspectorControls>
        <PanelBody
          title={__("Author Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Name", "wp-components")}
            value={name}
            onChange={(value: string) => setAttributes({ name: value })}
          />
          <TextControl
            label={__("Job Title", "wp-components")}
            value={job_title}
            onChange={(value: string) => setAttributes({ job_title: value })}
          />
          <TextControl
            label={__("Description", "wp-components")}
            value={description}
            onChange={(value: string) => setAttributes({ description: value })}
          />
          <TextControl
            label={__("Prepend", "wp-components")}
            value={prepend}
            onChange={(value: string) => setAttributes({ prepend: value })}
            help={__("Text before the author name", "wp-components")}
          />
        </PanelBody>

        <PanelBody
          title={__("Image Settings", "wp-components")}
          initialOpen={false}
        >
          <SelectControl
            label={__("Image Float", "wp-components")}
            value={image_float}
            options={[
              { label: __("None", "wp-components"), value: "none" },
              { label: __("Left", "wp-components"), value: "left" },
              { label: __("Right", "wp-components"), value: "right" },
            ]}
            onChange={(value: string) => setAttributes({ image_float: value })}
          />
          <ToggleControl
            label={__("Rounded Image", "wp-components")}
            checked={image_rounded}
            onChange={(value: boolean) =>
              setAttributes({ image_rounded: value })
            }
          />
        </PanelBody>

        <PanelBody title={__("Schema", "wp-components")} initialOpen={false}>
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/author" attributes={attributes} />
    </BlockWrapper>
  );
}
