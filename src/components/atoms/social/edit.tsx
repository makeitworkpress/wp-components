/**
 * WPC Social Links Block - Editor Component
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, ToggleControl, Button } from "@wordpress/components";

interface Profile { network: string; url: string; icon: string; }
interface Attributes { profiles: Profile[]; showLabels: boolean; className: string; }
interface Props { attributes: Attributes; setAttributes: (attrs: Partial<Attributes>) => void; }

function Edit({ attributes, setAttributes }: Props) {
  const { profiles, showLabels } = attributes;
  const blockProps = useBlockProps({ className: "atom atom-social" });

  const addProfile = () => setAttributes({ profiles: [...profiles, { network: "", url: "", icon: "fab fa-" }] });
  const removeProfile = (index: number) => setAttributes({ profiles: profiles.filter((_, i) => i !== index) });
  const updateProfile = (index: number, field: keyof Profile, value: string) => {
    const newProfiles = profiles.map((p, i) => i === index ? { ...p, [field]: value } : p);
    setAttributes({ profiles: newProfiles });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Social Settings", "wp-components")} initialOpen={true}>
          <ToggleControl label={__("Show Labels", "wp-components")} checked={showLabels} onChange={(value) => setAttributes({ showLabels: value })} />
        </PanelBody>
        <PanelBody title={__("Profiles", "wp-components")} initialOpen={true}>
          {profiles.map((profile, i) => (
            <div key={i} style={{ marginBottom: "16px", padding: "8px", background: "#f0f0f0" }}>
              <TextControl label={__("Network", "wp-components")} value={profile.network} onChange={(v) => updateProfile(i, "network", v)} />
              <TextControl label={__("URL", "wp-components")} value={profile.url} onChange={(v) => updateProfile(i, "url", v)} />
              <TextControl label={__("Icon", "wp-components")} value={profile.icon} onChange={(v) => updateProfile(i, "icon", v)} />
              <Button isDestructive onClick={() => removeProfile(i)}>{__("Remove", "wp-components")}</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addProfile}>{__("Add Profile", "wp-components")}</Button>
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <ul className="atom-social-list">
          {profiles.map((p, i) => (
            <li key={i}><a href={p.url || "#"}><i className={p.icon} />{showLabels && <span>{p.network}</span>}</a></li>
          ))}
          {profiles.length === 0 && <li style={{ color: "#999" }}>{__("Add social profiles in settings", "wp-components")}</li>}
        </ul>
      </div>
    </>
  );
}

export default Edit;
