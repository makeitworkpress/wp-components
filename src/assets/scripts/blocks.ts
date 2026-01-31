/**
 * WPC Blocks - Entry point for all Gutenberg blocks
 *
 * This file registers all WPC component blocks with the WordPress block editor.
 */

const wp = (window as any).wp;
const { registerBlockType, registerBlockCollection } = wp.blocks;

// Atom edit components
import ArchiveTitleEdit from "../../components/atoms/archive-title/edit";
import AuthorEdit from "../../components/atoms/author/edit";
import BreadcrumbsEdit from "../../components/atoms/breadcrumbs/edit";
import ButtonEdit from "../../components/atoms/button/edit";
import CartEdit from "../../components/atoms/cart/edit";
import CommentsEdit from "../../components/atoms/comments/edit";
import ContentEdit from "../../components/atoms/content/edit";
import CopyrightEdit from "../../components/atoms/copyright/edit";
import DateEdit from "../../components/atoms/date/edit";
import DescriptionEdit from "../../components/atoms/description/edit";
import ImageEdit from "../../components/atoms/image/edit";
import ListEdit from "../../components/atoms/list/edit";
import LogoEdit from "../../components/atoms/logo/edit";
import MapEdit from "../../components/atoms/map/edit";
import MenuEdit from "../../components/atoms/menu/edit";
import MetaEdit from "../../components/atoms/meta/edit";
import ModalEdit from "../../components/atoms/modal/edit";
import PaginationEdit from "../../components/atoms/pagination/edit";
import RateEdit from "../../components/atoms/rate/edit";
import ScrollEdit from "../../components/atoms/scroll/edit";
import SearchEdit from "../../components/atoms/search/edit";
import ShareEdit from "../../components/atoms/share/edit";
import SidebarEdit from "../../components/atoms/sidebar/edit";
import SocialEdit from "../../components/atoms/social/edit";
import TabsEdit from "../../components/atoms/tabs/edit";
import TermlistEdit from "../../components/atoms/termlist/edit";
import TermsEdit from "../../components/atoms/terms/edit";
import TitleEdit from "../../components/atoms/title/edit";
import TypeEdit from "../../components/atoms/type/edit";
import VideoEdit from "../../components/atoms/video/edit";

// Atom metadata
import archiveTitleMetadata from "../../components/atoms/archive-title/block.json";
import authorMetadata from "../../components/atoms/author/block.json";
import breadcrumbsMetadata from "../../components/atoms/breadcrumbs/block.json";
import buttonMetadata from "../../components/atoms/button/block.json";
import cartMetadata from "../../components/atoms/cart/block.json";
import commentsMetadata from "../../components/atoms/comments/block.json";
import contentMetadata from "../../components/atoms/content/block.json";
import copyrightMetadata from "../../components/atoms/copyright/block.json";
import dateMetadata from "../../components/atoms/date/block.json";
import descriptionMetadata from "../../components/atoms/description/block.json";
import imageMetadata from "../../components/atoms/image/block.json";
import listMetadata from "../../components/atoms/list/block.json";
import logoMetadata from "../../components/atoms/logo/block.json";
import mapMetadata from "../../components/atoms/map/block.json";
import menuMetadata from "../../components/atoms/menu/block.json";
import metaMetadata from "../../components/atoms/meta/block.json";
import modalMetadata from "../../components/atoms/modal/block.json";
import paginationMetadata from "../../components/atoms/pagination/block.json";
import rateMetadata from "../../components/atoms/rate/block.json";
import scrollMetadata from "../../components/atoms/scroll/block.json";
import searchMetadata from "../../components/atoms/search/block.json";
import shareMetadata from "../../components/atoms/share/block.json";
import sidebarMetadata from "../../components/atoms/sidebar/block.json";
import socialMetadata from "../../components/atoms/social/block.json";
import tabsMetadata from "../../components/atoms/tabs/block.json";
import termlistMetadata from "../../components/atoms/termlist/block.json";
import termsMetadata from "../../components/atoms/terms/block.json";
import titleMetadata from "../../components/atoms/title/block.json";
import typeMetadata from "../../components/atoms/type/block.json";
import videoMetadata from "../../components/atoms/video/block.json";

// Molecule edit components
import FooterEdit from "../../components/molecules/footer/edit";
import HeaderEdit from "../../components/molecules/header/edit";
import PostsEdit from "../../components/molecules/posts/edit";
import SectionEdit from "../../components/molecules/section/edit";
import SliderEdit from "../../components/molecules/slider/edit";

// Molecule metadata
import footerMetadata from "../../components/molecules/footer/block.json";
import headerMetadata from "../../components/molecules/header/block.json";
import postsMetadata from "../../components/molecules/posts/block.json";
import sectionMetadata from "../../components/molecules/section/block.json";
import sliderMetadata from "../../components/molecules/slider/block.json";

/**
 * Register all WPC blocks
 */
function registerWPCBlocks(): void {

  registerBlockCollection("wpc", {
    title: "WPC Blocks",
    icon: "admin-plugins",
  });

  // Atoms
  registerBlockType(archiveTitleMetadata, { edit: ArchiveTitleEdit, save: () => null });
  registerBlockType(authorMetadata, { edit: AuthorEdit, save: () => null });
  registerBlockType(breadcrumbsMetadata, { edit: BreadcrumbsEdit, save: () => null });
  registerBlockType(buttonMetadata, { edit: ButtonEdit, save: () => null });
  registerBlockType(cartMetadata, { edit: CartEdit, save: () => null });
  registerBlockType(commentsMetadata, { edit: CommentsEdit, save: () => null });
  registerBlockType(contentMetadata, { edit: ContentEdit, save: () => null });
  registerBlockType(copyrightMetadata, { edit: CopyrightEdit, save: () => null });
  registerBlockType(dateMetadata, { edit: DateEdit, save: () => null });
  registerBlockType(descriptionMetadata, { edit: DescriptionEdit, save: () => null });
  registerBlockType(imageMetadata, { edit: ImageEdit, save: () => null });
  registerBlockType(listMetadata, { edit: ListEdit, save: () => null });
  registerBlockType(logoMetadata, { edit: LogoEdit, save: () => null });
  registerBlockType(mapMetadata, { edit: MapEdit, save: () => null });
  registerBlockType(menuMetadata, { edit: MenuEdit, save: () => null });
  registerBlockType(metaMetadata, { edit: MetaEdit, save: () => null });
  registerBlockType(modalMetadata, { edit: ModalEdit, save: () => null });
  registerBlockType(paginationMetadata, { edit: PaginationEdit, save: () => null });
  registerBlockType(rateMetadata, { edit: RateEdit, save: () => null });
  registerBlockType(scrollMetadata, { edit: ScrollEdit, save: () => null });
  registerBlockType(searchMetadata, { edit: SearchEdit, save: () => null });
  registerBlockType(shareMetadata, { edit: ShareEdit, save: () => null });
  registerBlockType(sidebarMetadata, { edit: SidebarEdit, save: () => null });
  registerBlockType(socialMetadata, { edit: SocialEdit, save: () => null });
  registerBlockType(tabsMetadata, { edit: TabsEdit, save: () => null });
  registerBlockType(termlistMetadata, { edit: TermlistEdit, save: () => null });
  registerBlockType(termsMetadata, { edit: TermsEdit, save: () => null });
  registerBlockType(titleMetadata, { edit: TitleEdit, save: () => null });
  registerBlockType(typeMetadata, { edit: TypeEdit, save: () => null });
  registerBlockType(videoMetadata, { edit: VideoEdit, save: () => null });

  // Molecules
  registerBlockType(footerMetadata, { edit: FooterEdit, save: () => null });
  registerBlockType(headerMetadata, { edit: HeaderEdit, save: () => null });
  registerBlockType(postsMetadata, { edit: PostsEdit, save: () => null });
  registerBlockType(sectionMetadata, { edit: SectionEdit, save: () => null });
  registerBlockType(sliderMetadata, { edit: SliderEdit, save: () => null });
}

// Register blocks when DOM is ready
registerWPCBlocks();

export { registerWPCBlocks };
