/**
 * Video Block Editor
 * Attributes match Video.php $atts
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

interface VideoAttributes extends Partial<BaseAttributes> {
  date: string;
  description: string;
  name: string;
  placer: string;
  schema: boolean;
  thumbnail: string;
  video: string;
  video_height: string;
  video_width: string;
}

interface EditProps {
  attributes: VideoAttributes;
  setAttributes: (attrs: Partial<VideoAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const {
    date,
    description,
    name,
    schema,
    thumbnail,
    video,
    video_height,
    video_width,
  } = attributes;

  return (
    <BlockWrapper>
      <InspectorControls>
        <PanelBody
          title={__("Video Settings", "wp-components")}
          initialOpen={true}
        >
          <TextControl
            label={__("Video URL or Embed", "wp-components")}
            value={video}
            onChange={(value: string) => setAttributes({ video: value })}
            placeholder="https://youtube.com/watch?v=..."
            help={__("YouTube/Vimeo URL or embed code", "wp-components")}
          />
          <TextControl
            label={__("Width", "wp-components")}
            value={video_width}
            onChange={(value: string) => setAttributes({ video_width: value })}
            placeholder="640"
          />
          <TextControl
            label={__("Height", "wp-components")}
            value={video_height}
            onChange={(value: string) => setAttributes({ video_height: value })}
            placeholder="360"
          />
          <TextControl
            label={__("Thumbnail URL", "wp-components")}
            value={thumbnail}
            onChange={(value: string) => setAttributes({ thumbnail: value })}
            help={__("Custom thumbnail image URL", "wp-components")}
          />
        </PanelBody>

        <PanelBody
          title={__("Schema Settings", "wp-components")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Enable Schema Markup", "wp-components")}
            checked={schema}
            onChange={(value: boolean) => setAttributes({ schema: value })}
          />
          {schema && (
            <>
              <TextControl
                label={__("Video Name", "wp-components")}
                value={name}
                onChange={(value: string) => setAttributes({ name: value })}
              />
              <TextControl
                label={__("Description", "wp-components")}
                value={description}
                onChange={(value: string) =>
                  setAttributes({ description: value })
                }
              />
              <TextControl
                label={__("Upload Date", "wp-components")}
                value={date}
                onChange={(value: string) => setAttributes({ date: value })}
                placeholder="2024-01-01"
                help={__("ISO 8601 format (YYYY-MM-DD)", "wp-components")}
              />
            </>
          )}
        </PanelBody>

        <BaseAttributesPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <ServerSideRender block="wpc/video" attributes={attributes} />
    </BlockWrapper>
  );
}
