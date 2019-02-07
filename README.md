# wp-components
Many frameworks use a modular approach for designing applications. While developing WordPress websites, we found out we're writing similar code a lot of times, even with existing frameworks and themes. That's why we developed WP Components, a set of common components with minimal styling but many functionalities.

WP Components contains common components that may be used in WordPress development. This helps to speed up development greatly, because the components doens't have to be redeveloped. It is aimed at WordPress Developers.

The components are seperated in two classes, namely atoms which are single components and molecules which are consisting of multiple atoms.
* An atom is for example a set of **sharing buttons**, a **title**, a **button**, a **search field**, **breadcrumbs** and so forth.
* A molecule is for example a **site header**, a **grid of posts**, a **slider**, a **header** within an article, and so forth.

WP Components is maintained by [Make it WorkPress](https://www.makeitworkpress.com/scripts/wp-components/).

&nbsp;
## Usage

Require the Ajax.php, Boot.php and Build.php files in your theme functions.php or a custom plugin. Additionaly, you could also use an autoloader or include it as a repository using Composer. 

### Booting Components
Before building components, you should boot the general script which enqueues the styles and scripts by the components.


```php
$components = new MakeitWorkPress\WP_Components\Boot();
```

If you don't want to include the scripts (which breaks some of the components), you can insert configurations in the component like this:

```php
$components = new MakeitWorkPress\WP_Components\Boot( ['css' => false, 'js' => false] );
```

### Rendering an atom
If you want to render an atom, you have to utilize the Build class, the name of the atom, the properties and eventually if you want to render this atom or return it as a string.

```php
MakeitWorkPress\WP_Components\Build::atom( string $name, array $properties, boolean $render = true );
```

For example, rendering a lazyloading image atom, where the attachment ID of the image is 71, is done in the following manner:

```php
MakeitWorkPress\WP_Components\Build::atom( 'image', ['image' => 71, 'lazyload' => true] );
```

There is also a shorter function available:

```php
wpc_atom( 'image', ['image' => 71, 'lazyload' => true] );
```

### Rendering a molecule
If you want to render a molecule, you have to utilize the Build class and use the name of the molecule, the properties and eventually if you want to render the molecule or return it as a string.

```php
MakeitWorkPress\WP_Components\Build::molecule( string $name, array $properties, boolean $render = true );
```

For example, rendering the header molecule is done in the following manner:

```php
MakeitWorkPress\WP_Components\Build::molecule( 'header', ['fixed' => true, 'transparent' => true] );
```

There is also a shorter function available:

```php
wpc_molecule( 'header', ['fixed' => true, 'transparent' => true] );
```

### Common Properties
Each component (atom or molecule) can have custom properties and has a set of predefined properties, such as alignment, attributes, background, border, color, float, height, parallax, rounded, width and so forth. 
These are explained in [the wiki](https://github.com/makeitworkpress/wp-components/wiki/Common-Properties).

&nbsp;
## WP Components WIKI
You can find more information on using components and all the properties that may be used for each component in [our wiki](https://github.com/makeitworkpress/wp-components/wiki).

&nbsp;
## Compatibility
WP Components works with PHP 7+ and is tested with WordPress 4.9 and higher.
