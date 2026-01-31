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
  registerBlockType(archiveTitleMetadata.name, { edit: ArchiveTitleEdit });
  registerBlockType(authorMetadata.name, { edit: AuthorEdit });
  registerBlockType(breadcrumbsMetadata.name, { edit: BreadcrumbsEdit });
  registerBlockType(buttonMetadata.name, { edit: ButtonEdit });
  registerBlockType(cartMetadata.name, { edit: CartEdit });
  registerBlockType(commentsMetadata.name, { edit: CommentsEdit });
  registerBlockType(contentMetadata.name, { edit: ContentEdit });
  registerBlockType(copyrightMetadata.name, { edit: CopyrightEdit });
  registerBlockType(dateMetadata.name, { edit: DateEdit });
  registerBlockType(descriptionMetadata.name, { edit: DescriptionEdit });
  registerBlockType(imageMetadata.name, { edit: ImageEdit });
  registerBlockType(listMetadata.name, { edit: ListEdit });
  registerBlockType(logoMetadata.name, { edit: LogoEdit });
  registerBlockType(mapMetadata.name, { edit: MapEdit });
  registerBlockType(menuMetadata.name, { edit: MenuEdit });
  registerBlockType(metaMetadata.name, { edit: MetaEdit });
  registerBlockType(modalMetadata.name, { edit: ModalEdit });
  registerBlockType(paginationMetadata.name, { edit: PaginationEdit });
  registerBlockType(rateMetadata.name, { edit: RateEdit });
  registerBlockType(scrollMetadata.name, { edit: ScrollEdit });
  registerBlockType(searchMetadata.name, { edit: SearchEdit });
  registerBlockType(shareMetadata.name, { edit: ShareEdit });
  registerBlockType(sidebarMetadata.name, { edit: SidebarEdit });
  registerBlockType(socialMetadata.name, { edit: SocialEdit });
  registerBlockType(tabsMetadata.name, { edit: TabsEdit });
  registerBlockType(termlistMetadata.name, { edit: TermlistEdit });
  registerBlockType(termsMetadata.name, { edit: TermsEdit });
  registerBlockType(titleMetadata.name, { edit: TitleEdit });
  registerBlockType(typeMetadata.name, { edit: TypeEdit });
  registerBlockType(videoMetadata.name, { edit: VideoEdit });

  // Molecules
  registerBlockType(footerMetadata.name, { edit: FooterEdit });
  registerBlockType(headerMetadata.name, { edit: HeaderEdit });
  registerBlockType(postsMetadata.name, { edit: PostsEdit });
  registerBlockType(sectionMetadata.name, { edit: SectionEdit });
  registerBlockType(sliderMetadata.name, { edit: SliderEdit });
}

// Register blocks when DOM is ready
registerWPCBlocks();

export { registerWPCBlocks };
