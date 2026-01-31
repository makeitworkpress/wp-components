const wp = (window as any).wp;
const { __ } = wp.i18n;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, Placeholder } = wp.components;
interface Attributes { postType: string; postsPerPage: number; columns: number; layout: string; showImage: boolean; showExcerpt: boolean; showDate: boolean; showAuthor: boolean; categories: number[]; orderBy: string; order: string; ajax: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }
function Edit({ attributes, setAttributes }: Props) {
  const { postType, postsPerPage, columns, layout, showImage, showExcerpt, showDate, showAuthor, orderBy, order, ajax } = attributes;
  const blockProps = useBlockProps({ className: `molecule molecule-posts molecule-posts-${layout}` });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Query Settings", "wp-components")} initialOpen={true}>
          <TextControl label={__("Post Type", "wp-components")} value={postType} onChange={(value: string) => setAttributes({ postType: value })} />
          <RangeControl label={__("Posts Per Page", "wp-components")} value={postsPerPage} onChange={(value: number) => setAttributes({ postsPerPage: value || 6 })} min={1} max={24} />
          <SelectControl label={__("Order By", "wp-components")} value={orderBy} options={[
            { label: __("Date", "wp-components"), value: "date" },
            { label: __("Title", "wp-components"), value: "title" },
            { label: __("Random", "wp-components"), value: "rand" },
            { label: __("Menu Order", "wp-components"), value: "menu_order" },
          ]} onChange={(value: string) => setAttributes({ orderBy: value })} />
          <SelectControl label={__("Order", "wp-components")} value={order} options={[
            { label: __("Descending", "wp-components"), value: "DESC" },
            { label: __("Ascending", "wp-components"), value: "ASC" },
          ]} onChange={(value: string) => setAttributes({ order: value })} />
        </PanelBody>
        <PanelBody title={__("Layout Settings", "wp-components")} initialOpen={false}>
          <SelectControl label={__("Layout", "wp-components")} value={layout} options={[
            { label: __("Grid", "wp-components"), value: "grid" },
            { label: __("List", "wp-components"), value: "list" },
          ]} onChange={(value: string) => setAttributes({ layout: value })} />
          {layout === "grid" && <RangeControl label={__("Columns", "wp-components")} value={columns} onChange={(value: number) => setAttributes({ columns: value || 3 })} min={1} max={6} />}
        </PanelBody>
        <PanelBody title={__("Display Settings", "wp-components")} initialOpen={false}>
          <ToggleControl label={__("Show Featured Image", "wp-components")} checked={showImage} onChange={(value: boolean) => setAttributes({ showImage: value })} />
          <ToggleControl label={__("Show Excerpt", "wp-components")} checked={showExcerpt} onChange={(value: boolean) => setAttributes({ showExcerpt: value })} />
          <ToggleControl label={__("Show Date", "wp-components")} checked={showDate} onChange={(value: boolean) => setAttributes({ showDate: value })} />
          <ToggleControl label={__("Show Author", "wp-components")} checked={showAuthor} onChange={(value: boolean) => setAttributes({ showAuthor: value })} />
          <ToggleControl label={__("AJAX Load More", "wp-components")} checked={ajax} onChange={(value: boolean) => setAttributes({ ajax: value })} />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <Placeholder icon="grid-view" label={__("WPC Posts", "wp-components")} instructions={`${postsPerPage} ${postType}s in ${columns}-column ${layout}`} />
      </div>
    </>
  );
}

export default Edit;
