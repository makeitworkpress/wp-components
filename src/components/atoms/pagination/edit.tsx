/**
 * WPC Pagination Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";

interface Attributes { type: string; prevText: string; nextText: string; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }

function Edit({ attributes, setAttributes }: Props) {
  const { type, prevText, nextText } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-pagination" });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Pagination Settings", "wp-components")} initialOpen={true}>
          <SelectControl label={__("Type", "wp-components")} value={type} options={[
            { label: __("Numbers", "wp-components"), value: "numbers" },
            { label: __("Previous/Next", "wp-components"), value: "prevnext" },
          ]} onChange={(value) => setAttributes({ type: value })} />
          <TextControl label={__("Previous Text", "wp-components")} value={prevText} onChange={(value) => setAttributes({ prevText: value })} />
          <TextControl label={__("Next Text", "wp-components")} value={nextText} onChange={(value) => setAttributes({ nextText: value })} />
        </PanelBody>
      </InspectorControls>
      <nav {...blockProps}>
        {type === "numbers" ? (
          <ul className="atom-pagination-list">
            <li><a href="#">{prevText}</a></li>
            <li><a href="#">1</a></li>
            <li><span className="current">2</span></li>
            <li><a href="#">3</a></li>
            <li><a href="#">{nextText}</a></li>
          </ul>
        ) : (
          <div className="atom-pagination-prevnext">
            <a href="#">← {prevText}</a>
            <a href="#">{nextText} →</a>
          </div>
        )}
      </nav>
    </>
  );
}

export default Edit;
