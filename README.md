# wp-components
Many frameworks use a modular approach for designing applications. While developing WordPress websites, we found out we're writing similar code a lot of times, even with existing frameworks and themes. That's why we developed WP Components, a set of common components with minimal styling but many functionalities.

WP Components contains common components that may be used in WordPress development. This helps to speed up development greatly, because the components have not to be redeveloped time over time. 

The components are seperated in two classes, namely atoms which are single components and molecules which are consisting of multiple atoms.
* An atom is for example a set of sharing buttons, a title, a button, a search field, breadcrumbs and so forth.
* A molecule is for exampe a site header, a grid of posts, a header within an article, and so forth.

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
Each component can have custom properties and has a set of predefined properties, such as alignment, attributes, background, border, color, float, height, parallax, rounded, width and so forth. 
These are explained in the wiki.

### Rendering an atom
If you want to render an atom, you have to utilize the Build class, the name of the atom, the properties and eventually if you want to return instead of echo. Probably, we might write a shorter function for this in future versions.

```php
MakeitWorkPress\WP_Components\Build::atom( string $name, array $properties, boolean $return = false );
```


For example, rendering a lazyloading image molecule is done in the following manner:

```php
MakeitWorkPress\WP_Components\Build::atom( 'image', ['lazyload' => true] );
```

### Rendering a molecule
If you want to render a molecule, you have to utilize the Build class and use the name of the molecule, the properties and eventually if you want to return instead of echo.

```php
MakeitWorkPress\WP_Components\Build::molecule( string $name, array $properties, boolean $return = false );
```

For example, rendering the header molecule is done in the following manner:

```php
MakeitWorkPress\WP_Components\Build::molecule( 'header', ['fixed' => true, 'transparent' => true] );
```

## WP Components WIKI
You can find more information on using components in our wiki.
